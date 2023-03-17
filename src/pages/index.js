import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Search from './Search'

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/search" element={<Search />}></Route>
    </Routes>
  )
}
