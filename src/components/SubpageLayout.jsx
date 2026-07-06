import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'

export default function SubpageLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}
