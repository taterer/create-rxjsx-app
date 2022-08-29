import { filter, map, takeUntil } from "rxjs";
import { CounterEvent, newCounter } from "../../../domain/counter/command";
import { counterEntity$ } from "../../../domain/counter/event";
import Counter from "../../components/Counter";

export default function Memory ({ destruction$ }) {
  const counters$ = counterEntity$
  .pipe(
    filter(counter => counter.meta.eventType === CounterEvent.new),
    map(counter => <Counter destruction$={destruction$} id={counter.id} />),
    takeUntil(destruction$)
  )

  return (
    <div style={`
      padding: 20px;
    `}>
      <h1>In memory counting</h1>
      <div style={`
        cursor: pointer;
        background-color: lightblue;
        text-align: center;
        margin: 10px;
        padding: 10px;
      `} onclick={() => newCounter({})}>
        Create counter
      </div>
      <div multi$={counters$} />
    </div>
  )
}
