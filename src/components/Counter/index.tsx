import { filter, map, startWith, takeUntil } from "rxjs";
import { incrementCounter } from "../../domain/counter/command";
import { counterEntity$ } from "../../domain/counter/event";

export default function Counter({ destruction$, id }) {
  const counter$ = counterEntity$.pipe(
    filter((counter) => counter.id === id),
    startWith({ id, count: 1 }),
    map((counter) => {
      return (
        <div
          style={`
          cursor: pointer;
          text-align: center;
          margin: 10px;
          padding: 10px;
          background-color: lightblue;
        `}
          onclick={() => incrementCounter({ id })}
        >
          {counter.count}
        </div>
      );
    }),
    takeUntil(destruction$)
  );

  return <div single$={counter$} />;
}
