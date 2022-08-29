import { from, shareReplay, withLatestFrom } from "rxjs"
import { Persistable, Persistence } from "@taterer/persist"
import { memoryFactory } from "@taterer/persist-memory"

export enum MemoryEntity {
  counter = 'counter',
}

export async function memoryPersistence (): Promise<Persistence<any & Persistable, MemoryEntity>> {
  const memoryDb = await memoryFactory([
    {
      name: MemoryEntity.counter,
    },
  ])
  return memoryDb
}

export const memoryDb$ = from(memoryPersistence()).pipe(shareReplay(1))

// sudo subject
memoryDb$.subscribe()

export function withMemoryDb<T> () {
  return withLatestFrom<T, [Persistence<any & Persistable, MemoryEntity>]>(memoryDb$)
}
