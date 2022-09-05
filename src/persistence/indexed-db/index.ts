import { from } from 'rxjs'
import { shareReplay, withLatestFrom } from 'rxjs/operators'
import { indexedDbFactory as indexedDBFactory } from '@taterer/persist-indexed-db'
import { Persistable, Persistence } from '@taterer/persist'

export enum IndexedDBEntity {
  todo = 'todo'
}

async function indexedDBPersistence (): Promise<Persistence<any & Persistable, IndexedDBEntity>> {
  const databaseName = 'db-create-rxjsx-app'

  try {
    // Increment the version number anytime the database schema changes
    const indexedDb = await indexedDBFactory<IndexedDBEntity>(databaseName, 1, [
      {
        name: IndexedDBEntity.todo,
        options: {
          keyPath: 'id'
        }
      },
    ])

    return indexedDb
  } catch (err) {
    console.log('Failed to create indexedDb persistence.', err)
    throw err
  }
}

export const indexedDB$ = from(indexedDBPersistence()).pipe(shareReplay(1))

export function withIndexedDB<Entity> () {
  return withLatestFrom<Entity, [Persistence<any & Persistable, IndexedDBEntity>]>(indexedDB$)
}
