declare module '@babel/helper-module-imports' {
  import type * as typesNs from '@babel/types'
  import { NodePath } from '@babel/traverse'

  function addDefault(
    path: NodePath,
    source: string,
    opts?: Partial<{ nameHint: string }>
  ): typesNs.Node
}
