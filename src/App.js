import getAuthUser from './utils/getAuthUser'
import Unauthorized from './globalComponents/Unauthorized'
import Pages from './pages'
import LayOut from './globalComponents/LayOut'

function App() {
  const user = getAuthUser()

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
