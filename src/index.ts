import * as typesNs from '@babel/types'
import type templateFn from '@babel/template'
import type { Visitor, NodePath } from '@babel/traverse'

const visited = Symbol('visited')

export default function flushableImportPlugin({
  types: t,
  template,
}: {
  types: typeof typesNs
  template: typeof templateFn
}): { name: string; visitor: Visitor } {
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
      },
    },
  }
}

function extractChunkName(importNp: NodePath<typesNs.Import>) {
  const argNP = importNp.parentPath.get(
    'arguments'
  )[0] as NodePath<typesNs.Node>
  const argN = argNP.node
  const { leadingComments } = argN

  if (leadingComments.length > 0) {
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
