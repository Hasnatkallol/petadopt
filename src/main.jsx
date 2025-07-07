import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { router } from './Router/Router.jsx'
import { RouterProvider } from 'react-router'
import FirebaseProvider from './Firebase/FirebaseProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FirebaseProvider>
       <RouterProvider router={router} />
    </FirebaseProvider>
  </StrictMode>,
)
