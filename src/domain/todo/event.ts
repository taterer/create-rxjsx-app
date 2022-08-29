import { v4 as uuid } from 'uuid'
import { EntityEventHandlers, entityServiceFactory } from '@taterer/rx-entity'
import { indexedDb$, IndexedDbEntity } from '../../persistence/indexed-db'
import { CompleteTodo, NewTodo, RedefineTodo, RedoTodo, RemoveTodo, todoCommands$, TodoEvent } from './command'

export interface Todo {
  id: string
  deleted?: boolean
  title: string
  done: boolean
  completions: number[] // date
}

export const todoEventHandlers: EntityEventHandlers<Todo, TodoEvent> = {
  [TodoEvent.new]: (entity, event: NewTodo) => {
    return {
      id: uuid(),
      title: event.title,
      done: false,
      completions: []
    }
  },
  [TodoEvent.redefine]: (entity, event: RedefineTodo) => {
    return {
      ...entity,
      title: event.title
    }
  },
  [TodoEvent.complete]: (entity, event: CompleteTodo) => {
    return {
      ...entity,
      done: true,
      completions: [...entity.completions, Date.now()]
    }
  },
  [TodoEvent.redo]: (entity, event: RedoTodo) => {
    return {
      ...entity,
      done: false
    }
  },
  [TodoEvent.remove]: (entity, event: RemoveTodo) => {
    return {
      ...entity,
      deleted: true
    }
  },
}

export const todoEntity$ = todoCommands$
  .pipe(
    entityServiceFactory(
      indexedDb$,
      IndexedDbEntity.todo,
      todoEventHandlers,
    ),
  )
