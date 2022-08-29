import { merge } from "rxjs"
import { eventFactory } from "@taterer/rx-entity"
import { MemoryEntity } from "../../persistence/memory"

export enum CounterEvent {
  new = 'new',
  increment = 'increment',
  finish = 'finish',
}

export interface NewCounter {}

export const [newCounter$, newCounter] = eventFactory<NewCounter>({ entity: MemoryEntity.counter, eventType: CounterEvent.new })

export interface IncrementCounter {
  id: string
}

export const [incrementCounter$, incrementCounter] = eventFactory<IncrementCounter>({ entity: MemoryEntity.counter, eventType: CounterEvent.increment })

export interface FinishCounter {
  id: string
}

export const [finishCounter$, finishCounter] = eventFactory<FinishCounter>({ entity: MemoryEntity.counter, eventType: CounterEvent.finish })

export const counterCommands$ = merge(
  newCounter$,
  incrementCounter$,
  finishCounter$,
)
