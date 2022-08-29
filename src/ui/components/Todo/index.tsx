import { filter, mergeWith, map, takeUntil, Subject } from "rxjs"
import { completeTodo, redoTodo } from "../../../domain/todo/command"
import { todoEntity$ } from "../../../domain/todo/event"
import { getTodo, getTodoResponse$ } from "../../../domain/todo/query"

export default function Todo ({ destruction$, id }) {
  const destroy$ = new Subject()

  const todo$ = todoEntity$
  .pipe(
    mergeWith(getTodoResponse$),
    filter(todo => todo.id === id),
    map(todo => {
      if (todo.deleted) {
        destroy$.next(undefined)
      }
      return (
        <div style={`
          text-decoration: ${todo.done ? 'line-through' : 'none'};
          cursor: pointer;
          text-align: center;
          margin: 10px;
          padding: 10px;
          background-color: ${todo.done ? 'lightgreen' : 'lightblue'};
        `} onclick={() => {
          if (todo.done) {
            redoTodo({ id })
          } else {
            completeTodo({ id })
          }
        }}>
          <span>{todo.title}</span>
        </div>
      )
    }),
    takeUntil(destruction$),
    takeUntil(destroy$)
  )

  setTimeout(() => getTodo({ id }))

  return (
    <div single$={todo$} />
  )
}
