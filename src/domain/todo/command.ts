import { merge } from "rxjs"
import { eventFactory } from "@taterer/rx-entity"
import { IndexedDBEntity } from "../../persistence/indexed-db"

export enum TodoEvent {
  new = 'new',
  redefine = 'redefine',
  complete = 'complete',
  redo = 'redo',
  remove = 'remove',
}

export interface NewTodo {
  title: string
}

export const [newTodo$, newTodo] = eventFactory<NewTodo>({ entity: IndexedDBEntity.todo, eventType: TodoEvent.new })

export interface RedefineTodo {
  id: string
  title: string
}

export const [redefineTodo$, redefineTodo] = eventFactory<RedefineTodo>({ entity: IndexedDBEntity.todo, eventType: TodoEvent.redefine })

export interface CompleteTodo {
  id: string
}

export const [completeTodo$, completeTodo] = eventFactory<CompleteTodo>({ entity: IndexedDBEntity.todo, eventType: TodoEvent.complete })

export interface RedoTodo {
  id: string
}

export const [redoTodo$, redoTodo] = eventFactory<RedoTodo>({ entity: IndexedDBEntity.todo, eventType: TodoEvent.redo })

export interface RemoveTodo {
  id: string
}

export const [removeTodo$, removeTodo] = eventFactory<RemoveTodo>({ entity: IndexedDBEntity.todo, eventType: TodoEvent.remove })

export const todoCommands$ = merge(
  newTodo$,
  redefineTodo$,
  completeTodo$,
  redoTodo$,
  removeTodo$,
)
