import getAuthUser from './utils/getAuthUser'
import Unauthorized from './globalComponents/Unauthorized'
import Router from './Router'
// import { ColorModeProvider } from './Context/ColorModeContext'
import { AuthProvider } from './Context/authContext'
import Toaster from './Componets/Common/Toaster'
import { cp3Urls } from './config'

const cp3_app_urls = cp3Urls(process.env.REACT_APP_ENV || 'dev')

export const BASE_URL = cp3_app_urls?.url
export const WIDGET_URL = cp3_app_urls?.widgetUrl
export const PARTY_API_URL = cp3_app_urls?.apiUrl

function App() {
  const user = getAuthUser()

  if (!user) {
    return <Unauthorized />
  }

  return (
    <div className="App" style={{ background: '#000' }}>
      <AuthProvider>
        {/* <ColorModeProvider> */}
        <Toaster />
        <Router />
        {/* </ColorModeProvider> */}
      </AuthProvider>
    </div>
  )
}

export default App

// import React from "react";
// import Router from "./Router";
// import { ColorModeProvider } from "./Context/ColorModeContext";
// import { AuthProvider } from "./Context/authContext";
// import Toaster from './Components/Common/Toaster';
// import { cp3Urls } from './config'
// import "./custom.scss";

// const cp3_app_urls = cp3Urls(process.env.REACT_APP_ENV || 'dev')

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
