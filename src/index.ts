import { addDefault as addDefaultImport } from '@babel/helper-module-imports'

import type * as typesNs from '@babel/types'
import type templateFn from '@babel/template'
import type { Visitor, NodePath } from '@babel/traverse'

export default function flushableImportPlugin({
  types: t,
  template,
}: {
  types: typeof typesNs
  template: typeof templateFn
}): { name: string; visitor: Visitor } {
  const visited = Symbol('visited')

  let chunkName: string | null = null

  return {
    name: 'flushable-import',
    visitor: {
      Import(np) {
        if (np[visited]) {
          return
        }

        np[visited] = true

        chunkName = extractChunkName(np)

        const flushableImport = addDefaultImport(
          np,
          '@vpukhanov/babel-plugin-flushable-import/flushable-import',
          { nameHint: 'flushableImport' }
        )

        const configProperties = [
          // load
          // resolve
          // path
          // chunkName
        ]

        const config = t.objectExpression(configProperties)

        const call = t.callExpression(flushableImport, [config])

        chunkName = null

        np.parentPath.replaceWith(call)
      },
    },
  }
}

function loadProperty() {}

function resolveProperty() {}

function pathProperty() {}

function chunkNameProperty() {}

function extractChunkName(importNp: NodePath<typesNs.Import>) {
  const argNP = importNp.parentPath.get(
    'arguments'
  )[0] as NodePath<typesNs.Node>
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
