import type typesNs from '@babel/types'
import type templateFn from '@babel/template'
import type { Visitor } from '@babel/traverse'

export default function flushableImportPlugin({
  types: t,
  template,
}: {
  types: typeof typesNs
  template: typeof templateFn
}): { name: string; visitor: Visitor } {
  return {
    name: 'flushable-import',
    visitor: {},
  }
}
