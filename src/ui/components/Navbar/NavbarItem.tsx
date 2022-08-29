import { of, takeUntil, withLatestFrom } from 'rxjs'
import { classSync } from '@taterer/rx-jsx'
import { pushHistory, firstPathChange$ } from '@taterer/rx-router';
import { routePathMap, routeRegExpMap } from '../../../domain/router';

export default function NavbarItem ({ destruction$, title, route }) {
  const navbarItem$ = of<Element>(
    <a style={`
      padding: 15px;
    `} href={`/${routePathMap[route]}`} onClick={event => {
      if (!event.ctrlKey) {
        pushHistory({ url: `/${routePathMap[route]}` })
        event.preventDefault()
      }
    }}>{title}</a>
  )

  firstPathChange$
  .pipe(
    withLatestFrom(navbarItem$),
    takeUntil(destruction$)
  )
  .subscribe({
    next: ([firstPath, navbarItem]) => {
      classSync(
        navbarItem,
        'active',
        (routeRegExpMap[route] && routeRegExpMap[route].test(firstPath)) ||
          // If there is no match for any route regular expressions, set active if the given navbar path item has no corresponding route regular expression
          (!routeRegExpMap[route] && !Object.values(routeRegExpMap).some(regexp => regexp.test(firstPath)))
      )
    }
  })

  return (
    <div single$={navbarItem$} />
  )
}
