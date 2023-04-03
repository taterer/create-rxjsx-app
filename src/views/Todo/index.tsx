import {
  classSync,
  fromEventElement$,
  fromValueElementKeyup$,
} from "@taterer/rx-jsx";
import { filter, map, mergeWith, of, takeUntil, withLatestFrom } from "rxjs";
import { newTodo, removeTodo, TodoEvent } from "../../domain/todo/command";
import { todoEntity$ } from "../../domain/todo/event";
import { getAllTodos } from "../../domain/todo/query";
import {
  IndexedDBEntity,
  withIndexedDB,
} from "../../persistence/indexed-db";
import Todo from "../../components/Todo";
import "./todo.css";

export default function TodoApp({ destruction$ }) {
  const todolist$ = todoEntity$.pipe(
    filter((todo) => todo.meta.eventType === TodoEvent.new),
    mergeWith(getAllTodos()),
    map((todo) => <Todo destruction$={destruction$} id={todo.id} />),
    takeUntil(destruction$)
  );

  const input$ = of(<input type="text" />);
  const add$ = of(
    <span
      class="disabled"
      style={`
      padding: 5px;
      border-radius: 5px;
    `}
    >
      Add
    </span>
  );

  const clear$ = of(
    <div
      style={`
    background-color: lightblue;
    text-align: center;
    cursor: pointer;
    padding: 10px;
    margin: 10px;
  `}
    >
      Clear
    </div>
  );

  fromValueElementKeyup$(input$)
    .pipe(withLatestFrom(add$), takeUntil(destruction$))
    .subscribe(([inputValue, addElement]) => {
      classSync(addElement, "disabled", !inputValue);
      classSync(addElement, "enabled", !!inputValue);
    });

  fromEventElement$(add$, "click")
    .pipe(withLatestFrom(input$), takeUntil(destruction$))
    .subscribe(([click, inputElement]: any) => {
      if (inputElement.value) {
        newTodo({ title: inputElement.value });
        inputElement.value = "";
        classSync(click.target, "disabled", true);
        classSync(click.target, "enabled", false);
      }
    });

  fromEventElement$(clear$, "click")
    .pipe(withIndexedDB(), takeUntil(destruction$))
    .subscribe(async ([_click, indexedDb]) => {
      const allTodo = await indexedDb.query(IndexedDBEntity.todo);
      allTodo.forEach((todo) => {
        removeTodo({ id: todo.id });
      });
    });

  return (
    <div
      style={`
      padding: 20px;
    `}
    >
      <h1>TODO App</h1>
      <div
        style={`
        display: flex;
      `}
      >
        <div single$={input$} />
        <div single$={add$} />
      </div>
      <div multi$={todolist$} />
      <div single$={clear$} />
    </div>
  );
}
