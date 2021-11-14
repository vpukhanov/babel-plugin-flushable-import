import type typesNs from '@babel/types'
import type templateFn from '@babel/template'

export default function flushableImportPlugin({
  types: t,
  template,
}: {
  types: typeof typesNs
  template: typeof templateFn
}) {}
