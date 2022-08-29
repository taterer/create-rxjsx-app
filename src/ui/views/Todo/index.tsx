import { classSync, fromEventElement$, fromValueElementKeyup$ } from "@taterer/rx-jsx";
import { filter, map, mergeWith, of, takeUntil, withLatestFrom } from "rxjs";
import { newTodo, removeTodo, TodoEvent } from "../../../domain/todo/command";
import { todoEntity$ } from "../../../domain/todo/event";
import { loadAllTodo, loadAllTodoResponse$ } from "../../../domain/todo/query";
import { IndexedDbEntity, withIndexedDb } from "../../../persistence/indexed-db";
import Todo from "../../components/Todo";
import './todo.css'

export default function TodoApp ({ destruction$ }) {
  const todolist$ = todoEntity$
  .pipe(
    filter(todo => todo.meta.eventType === TodoEvent.new),
    mergeWith(loadAllTodoResponse$),
    map(todo => <Todo destruction$={destruction$} id={todo.id} />),
    takeUntil(destruction$)
  )

  // we need to wait to load until the subscription for the query has been created through rx-jsx
  setTimeout(() => loadAllTodo({}), 0)

  const input$ = of(<input type="text" />)
  const add$ = of(<span class='disabled'
    style={`
      padding: 5px;
      border-radius: 5px;
    `}>Add</span>)

  const clear$ = of(<div style={`
    background-color: lightblue;
    text-align: center;
    cursor: pointer;
    padding: 10px;
    margin: 10px;
  `}>Clear</div>)

  fromValueElementKeyup$(input$)
  .pipe(
    withLatestFrom(add$),
    takeUntil(destruction$)
  )
  .subscribe(([inputValue, addElement]) => {
    classSync(addElement, 'disabled', !inputValue)
    classSync(addElement, 'enabled', !!inputValue)
  })

  fromEventElement$(add$, 'click')
  .pipe(
    withLatestFrom(input$),
    takeUntil(destruction$)
  )
  .subscribe(([click, inputElement]) => {
    if (inputElement.value) {
      newTodo({ title: inputElement.value })
      inputElement.value = ''
      classSync(click.target as Element, 'disabled', true)
      classSync(click.target as Element, 'enabled', false)
    }
  })

  fromEventElement$(clear$, 'click')
  .pipe(
    withIndexedDb(),
    takeUntil(destruction$)
  )
  .subscribe(async ([_click, indexedDb]) => {
    const allTodo = await indexedDb.query(IndexedDbEntity.todo)
    allTodo.forEach(todo => {
      removeTodo({ id: todo.id })
    })
  })

  return (
    <div style={`
      padding: 20px;
    `}>
      <h1>TODO App</h1>
      <div style={`
        display: flex;
      `}>
        <div single$={input$} />
        <div single$={add$} />
      </div>
      <div multi$={todolist$} />
      <div single$={clear$} />
    </div>
  )
}
