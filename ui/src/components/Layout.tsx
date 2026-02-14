import { Outlet } from "react-router"
import TopNavigation from "./TopNavigation"

const Layout = () => {
  return (
    <>
      <TopNavigation />
      <Outlet />
    </>
  )
}

export default Layout
