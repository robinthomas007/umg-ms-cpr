import React, { useEffect } from 'react'
import getAuthUser from './utils/getAuthUser'
import Unauthorized from './globalComponents/Unauthorized'
import Router from './Router'
// import { ColorModeProvider } from './Context/ColorModeContext'
import { useAuth } from './Context/authContext'
import Toaster from './Componets/Common/Toaster'
import { cprUrls } from './config'
import { ConfigProvider, theme } from 'antd'
import customTheme from './globalTheme'

const cpr_app_urls = cprUrls(process.env.REACT_APP_ENV || 'dev')

export const BASE_URL = cpr_app_urls?.url
export const WIDGET_URL = cpr_app_urls?.widgetUrl
export const PARTY_API_URL = cpr_app_urls?.apiUrl

function App() {
  const user = getAuthUser()
  const { darkTheme, lightTheme } = customTheme
  const { darkMode } = useAuth()

  // if (!user) {
  //   return <Unauthorized />
  // }

  return (
    <div className="App">
      {/* <ColorModeProvider> */}
      <ConfigProvider
        theme={{
          // algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          // token: darkMode ? darkTheme : lightTheme,
          algorithm: theme.darkAlgorithm,
          token: darkTheme,
          // token:{
          //   colorte
          // }
        }}
      >
        <div
          style={{
            background: 'black',
          }}
        >
          <Toaster />
          <Router />
        </div>
      </ConfigProvider>
      {/* </ColorModeProvider> */}
    </div>
  )
}

export default App

// import React from "react";
// import Router from "./Router";
// import { ColorModeProvider } from "./Context/ColorModeContext";
// import { AuthProvider } from "./Context/authContext";
// import Toaster from './Components/Common/Toaster';
// import { cprUrls } from './config'
// import "./custom.scss";

// const cp3_app_urls = cprUrls(process.env.REACT_APP_ENV || 'dev')

// export const BASE_URL = cp3_app_urls?.url;
// export const WIDGET_URL = cp3_app_urls?.widgetUrl;
// export const PARTY_API_URL = cp3_app_urls?.apiUrl;

// function App() {
//   return (
//     <div className="App">
//       <AuthProvider>
//         <ColorModeProvider>
//           <Toaster />
//           <Router />
//         </ColorModeProvider>
//       </AuthProvider>
//     </div>
//   );
// }

// export default App;
