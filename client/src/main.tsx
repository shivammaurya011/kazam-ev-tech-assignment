import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import { ToastProvider } from './components/ToastContext.tsx'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>

    <ToastProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ToastProvider>
    </Provider>
)
