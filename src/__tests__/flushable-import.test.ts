import 'regenerator-runtime/runtime'

import flushableImport from '../flushable-import'

const config = {
  load: () => import('../flushable-import'),
  resolve: () => null,
  path: () => '<path>',
  chunkName: '<chunkName>',
}

test('returns given config', () => {
  expect(flushableImport(config)).toMatchSnapshot()
})

test.each(['then', 'catch'])('adds %s field to config', fieldName => {
  expect(flushableImport(config)).toHaveProperty(fieldName)
})

test('awaits to imported module', async () => {
  const expectedMod = await import('../flushable-import')
  const mod = await flushableImport(config)
  expect(mod).toEqual(expectedMod)
})
