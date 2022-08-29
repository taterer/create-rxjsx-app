import { from } from 'rxjs'
import { shareReplay, withLatestFrom } from 'rxjs/operators'
import { indexedDbFactory } from '@taterer/persist-indexed-db'
import { Persistable, Persistence } from '@taterer/persist'

export enum IndexedDbEntity {
  todo = 'todo'
}

async function indexedDbPersistence (): Promise<Persistence<any & Persistable, IndexedDbEntity>> {
  const databaseName = 'db-create-rxjsx-app'

  try {
    // Increment the version number anytime the database schema changes
    const indexedDb = await indexedDbFactory<IndexedDbEntity>(databaseName, 1, [
      {
        name: IndexedDbEntity.todo,
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

export const indexedDb$ = from(indexedDbPersistence()).pipe(shareReplay(1))

export function withIndexedDb<Entity> () {
  return withLatestFrom<Entity, [Persistence<any & Persistable, IndexedDbEntity>]>(indexedDb$)
}
