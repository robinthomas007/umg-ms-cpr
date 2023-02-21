import getAuthUser from './utils/getAuthUser'
import Unauthorized from './globalComponents/Unauthorized'
import { useEffect } from 'react'
import Pages from './pages'
import LayOut from './globalComponents/LayOut'

function App() {
  const user = getAuthUser()

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        alert('Session timed out!')
        window.location.reload()
      }, user.exp)
    }
  }, [user])

  if (!user) {
    return <Unauthorized />
  }

  return (
    <LayOut>
      <Pages />
    </LayOut>
  )
}

export default App
