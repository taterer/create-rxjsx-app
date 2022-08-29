import { concatMap, from, shareReplay, switchMap } from "rxjs";
import { eventFactory } from "@taterer/rx-entity";
import { IndexedDbEntity, withIndexedDb } from "../../persistence/indexed-db";
import { Todo } from "./event";

export enum TodoQuery {
  load = 'load'
}

export interface LoadAllTodo {}

export const [_loadAllTodo$, loadAllTodo] = eventFactory<LoadAllTodo>({ entity: IndexedDbEntity.todo, eventType: TodoQuery.load })

export const loadAllTodoResponse$ = _loadAllTodo$
  .pipe(
    withIndexedDb(),
    switchMap(([event, db]) => db.query(event.meta.entity as IndexedDbEntity)),
    switchMap(values => from(values as Todo[])),
  )

export interface GetTodo {
  id: string
}

export const [_getTodo$, getTodo] = eventFactory<GetTodo>({ entity: IndexedDbEntity.todo, eventType: TodoQuery.load })

export const getTodoResponse$ = _getTodo$
  .pipe(
    withIndexedDb(),
    concatMap(([event, db]) => db.get(IndexedDbEntity.todo, event.id)),
    shareReplay<Todo>(20),
  )
