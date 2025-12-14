import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@arco-design/web-react/dist/css/arco.css";
import '@arco-design/web-react/es/_util/react-19-adapter';
import './index.css'
import 'virtual:uno.css'
import { RouterProvider } from 'react-router';
import router from './routers';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider
      router={router}
    ></RouterProvider>
  </StrictMode>,
)
