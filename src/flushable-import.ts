export type FlushableImportConfig<T> = {
  load: () => Promise<T>
  resolve: () => string | number
  path: () => string
  chunkName: string
}

export default function flushableImport<T>(
  config: FlushableImportConfig<T>
): FlushableImportConfig<T> & {
  then: (cb: (mod: T) => void) => void
  catch: (cb: (err: Error) => void) => void
} {
  const { load } = config
  return {
    ...config,
    then: cb => load().then(mod => cb(mod)),
    catch: cb => load().catch(err => cb(err)),
  }
}
