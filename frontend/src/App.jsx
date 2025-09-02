import { Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { Navigate } from "react-router-dom"

// import pages
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home "
import Todo from "./pages/Todo"

function App() {
  return (
    <>
    <Routes>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>

      <Route path="/home" element={<Home />}></Route>
      <Route path="/add" element={<Todo />}></Route>

      <Route path="*" element={<Navigate to="/home" />}></Route>
    </Routes>

    <ToastContainer />
    </>
  )
}

export default App
