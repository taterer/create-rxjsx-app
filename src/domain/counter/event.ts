import { v4 as uuid } from 'uuid'
import { EntityEventHandlers, entityServiceFactory } from '@taterer/rx-entity'
import { memoryDb$, MemoryEntity } from '../../persistence/memory'
import { counterCommands$, CounterEvent, IncrementCounter, NewCounter, FinishCounter } from './command'

export interface Counter {
  id: string
  count: number
}

export const counterEventHandlers: EntityEventHandlers<Counter, CounterEvent> = {
  [CounterEvent.new]: (entity, event: NewCounter) => {
    return {
      id: uuid(),
      count: 1
    }
  },
  [CounterEvent.increment]: (entity, event: IncrementCounter) => {
    return {
      id: event.id,
      count: entity.count + 1
    }
  },
  [CounterEvent.finish]: (entity, event: FinishCounter) => {
    return {
      ...entity,
      deleted: true
    }
  },
}

export const counterEntity$ = counterCommands$
  .pipe(
    entityServiceFactory(
      memoryDb$,
      MemoryEntity.counter,
      counterEventHandlers,
    ),
  )
