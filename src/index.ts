import { addDefault as addDefaultImport } from '@babel/helper-module-imports'

import type * as typesNS from '@babel/types'
import type templateFn from '@babel/template'
import type { Visitor, NodePath } from '@babel/traverse'

export default function flushableImportPlugin({
  types: t,
  template,
}: {
  types: typeof typesNS
  template: typeof templateFn
}): { name: string; visitor: Visitor } {
  const visited = Symbol('visited')

  const loadTemplate = template(
    '() => Promise.all([IMPORT]).then(proms => proms[0])'
  )

  return {
    name: 'flushable-import',
    visitor: {
      Import(np) {
        if (np[visited]) {
          return
        }

        np[visited] = true

        const existingChunkName = extractChunkName(np)

        const flushableImport = addDefaultImport(
          np,
          '@vpukhanov/babel-plugin-flushable-import/flushable-import',
          { nameHint: 'flushableImport' }
        )

        const configProperties = [
          loadProperty(np, existingChunkName, loadTemplate as any, t),
          // resolve
          // path
          // chunkName
        ]

        const config = t.objectExpression(configProperties)

        const call = t.callExpression(flushableImport, [config])

        np.parentPath.replaceWith(call)
      },
    },
  }
}

function loadProperty(
  importNP: NodePath<typesNS.Import>,
  existingChunkName: string,
  template: (arg: Record<string, unknown>) => {
    expression: typesNS.Expression
  },
  types: typeof typesNS
) {
  const argNP = getImportNodePathArgNodePath(importNP)
  const chunkName = existingChunkName || generateChunkName(importNP)

  argNP.addComment('leading', ` webpackChunkName: '${chunkName}' `)

  const loadFnCall = template({ IMPORT: argNP.parent }).expression

  return types.objectProperty(types.identifier('load'), loadFnCall)
}

function resolveProperty() {}

function pathProperty() {}

function chunkNameProperty() {}

function extractChunkName(importNP: NodePath<typesNS.Import>) {
  const argNP = getImportNodePathArgNodePath(importNP)
  const argN = argNP.node
  const { leadingComments } = argN

  if (leadingComments && leadingComments.length > 0) {
    const magicComment = leadingComments[0].value
    const chunkNameMarkIdx = magicComment.indexOf('webpackChunkName:')

    if (chunkNameMarkIdx >= 0) {
      const chunkName = magicComment.slice(
        chunkNameMarkIdx + 'webpackChunkName:'.length
      )
      return chunkName.replace(/["']/g, '').trim()
    }
  }

  return null
}

function generateChunkName(importNP: NodePath<typesNS.Import>) {
  const argNP = getImportNodePathArgNodePath(importNP)
  return makeChunkNameFromArbitraryString(
    (argNP.node as typesNS.StringLiteral).value
  )
}

function makeChunkNameFromArbitraryString(str: string) {
  return str.replace(/^[./]+|(\.js$)/g, '')
}

function getImportNodePathArgNodePath(importNP: NodePath<typesNS.Import>) {
  return importNP.parentPath.get('arguments')[0] as NodePath<typesNS.Node>
}
