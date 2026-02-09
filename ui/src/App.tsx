import { Route, Routes } from "react-router"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import New from "./pages/events/New"
import Single from "./pages/events/Single"

const App = () => {
  return (
    <Routes>
      <Route index element={<Home />} />

      <Route>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route path="events">
        <Route path=":event" element={<Single />} />
        <Route path="new" element={<New />} />
      </Route>
    </Routes>
  )
}

export default App
