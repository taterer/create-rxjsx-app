import { css } from '@emotion/css'
import NavbarItem from './NavbarItem'
import { Route } from '../../../domain/router'

export default function Navbar ({ destruction$ }) {
  return (
    <nav class={css`
      padding: 15px;
      background-color: #29f;
      display: flex;
      flex-direction: row;
    `}>
        <NavbarItem destruction$={destruction$} route={Route.home} title="Home" />
        <NavbarItem destruction$={destruction$} route={Route.rxjsx} title="RxJSX" />
    </nav>
  )
}
