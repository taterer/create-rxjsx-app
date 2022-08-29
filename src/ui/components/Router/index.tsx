import { map, takeUntil } from 'rxjs'
import { firstPathChange$, subscribeToHistory } from '@taterer/rx-router'
import { routeRegExpMap } from '../../../domain/router'
import Home from '../../views/Home'
import RxJSX from '../../views/RxJSX'

export default function Router ({ destruction$ }) {
  subscribeToHistory(destruction$)

  const route$ = firstPathChange$
  .pipe(
    map(firstPath => {
      if (routeRegExpMap.home.test(firstPath)) {
        return <Home destruction$={firstPathChange$} />
      } else if (routeRegExpMap.rxjsx.test(firstPath)) {
        return <RxJSX destruction$={firstPathChange$} />
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
