import { Route } from "../../../domain/router";
import NavbarItem from "./NavbarItem";

export default function Navbar({ destruction$ }) {
  return (
    <nav
      style={`
      padding: 15px;
      background-color: #29f;
      display: flex;
      flex-direction: row;
    `}
    >
      <NavbarItem destruction$={destruction$} route={Route.home} title="Home" />
      <NavbarItem
        destruction$={destruction$}
        route={Route.memory}
        title="Memory"
      />
      <NavbarItem destruction$={destruction$} route={Route.todo} title="TODO" />
    </nav>
  );
}
