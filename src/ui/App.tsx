import { EMPTY } from 'rxjs'
import Navbar from './components/Navbar'
import Router from './components/Router'

export default function App () {
  return (
    <div style={`
      display: flex;
      flex-direction: column;
      justify-content: left;
      align-items: center;
    `}>
      <Navbar destruction$={EMPTY} />
      <Router destruction$={EMPTY} />
    </div>
  )
}
