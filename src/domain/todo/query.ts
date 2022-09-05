import { concatMap, filter, from, merge, Observable, switchMap } from "rxjs";
import { indexedDB$, IndexedDBEntity } from "../../persistence/indexed-db";
import { Todo, todoEntity$ } from "./event";
import { TodoEvent } from "./command";

export function getAllTodos(): Observable<Todo> {
  return indexedDB$
  .pipe(
    concatMap(db => db.query(IndexedDBEntity.todo)),
    switchMap(values => from(values as Todo[])),
  )
}

export function getTodo(id): Observable<Todo & {
  meta: {
      entity: IndexedDBEntity;
      eventType: TodoEvent;
  };
}> {
  return merge(
    indexedDB$.pipe(concatMap(db => db.get(IndexedDBEntity.todo, id))),
    todoEntity$.pipe(filter(i => i.id === id))
  ).pipe(filter(i => !!i))
}
