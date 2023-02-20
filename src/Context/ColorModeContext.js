import { createContext, useState, useContext } from 'react'

export const ColorModeContext = createContext('light')

export const ColorModeProvider = ({ children }) => {
  const [colorMode, setColorMode] = useState('light')

  const toggleColorMode = () => {
    setColorMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
  }
  return <ColorModeContext.Provider value={{ colorMode, toggleColorMode }}>{children}</ColorModeContext.Provider>
}

export const useColor = () => {
  return useContext(ColorModeContext)
}
