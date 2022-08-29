import { map, takeUntil } from 'rxjs'
import { firstPathChange$, subscribeToHistory } from '@taterer/rx-router'
import { routeRegExpMap } from '../../../domain/router'
import Home from '../../views/Home'
import Memory from '../../views/Memory'
import Todo from '../../views/Todo'

export default function Router ({ destruction$ }) {
  subscribeToHistory(destruction$)

  const route$ = firstPathChange$
  .pipe(
    map(firstPath => {
      if (routeRegExpMap.home.test(firstPath)) {
        return <Home destruction$={firstPathChange$} />
      } else if (routeRegExpMap.memory.test(firstPath)) {
        return <Memory destruction$={firstPathChange$} />
      } else if (routeRegExpMap.todo.test(firstPath)) {
        return <Todo destruction$={firstPathChange$} />
      } else {
        return <div>Not found</div>
      }
    }),
    takeUntil(destruction$)
  )

  return (
    <div single$={route$} />
  )
}
