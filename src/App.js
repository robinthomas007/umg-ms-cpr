import Router from './Router/index'
import { ColorModeProvider } from './Context/ColorModeContext'
import { AuthProvider } from './Context/authContext'

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <ColorModeProvider>
          <Router />
        </ColorModeProvider>
      </AuthProvider>
    </div>
  )
}

export default App
