import React, { useEffect } from 'react'
import getAuthUser from './utils/getAuthUser'
import Router from './Router'
import { useAuth } from './Context/authContext'
import { cprUrls } from './config'
import { ConfigProvider, theme } from 'antd'
import customTheme from './globalTheme'

const cpr_app_urls = cprUrls(process.env.REACT_APP_ENV || 'dev')

export const BASE_URL = cpr_app_urls?.url

function App() {
  const user = getAuthUser()
  const { darkTheme, lightTheme } = customTheme
  const { darkMode } = useAuth()

  return (
    <div className="App">
      <ConfigProvider
        theme={{
          // algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          // token: darkMode ? darkTheme : lightTheme,
          algorithm: theme.darkAlgorithm,
          token: darkTheme,
        }}
      >
        <div
          style={{
            background: 'black',
          }}
        >
          <Router />
        </div>
      </ConfigProvider>
    </div>
  )
}

export default App
