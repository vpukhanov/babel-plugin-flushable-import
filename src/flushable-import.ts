type FlushableImportConfig<T> = {
  load: () => Promise<T>
  resolve: () => string | number
  path: () => string
  chunkName: string
}

export type FlushableImportReturn<T> = FlushableImportConfig<T> & {
  then: (cb: (mod: T) => void) => void
  catch: (cb: (err: Error) => void) => void
}

export default function flushableImport<T>(
  config: FlushableImportConfig<T>
): FlushableImportReturn<T> {
  const { load } = config
  return {
    ...config,
    then: cb => load().then(mod => cb(mod)),
    catch: cb => load().catch(err => cb(err)),
  }
}
