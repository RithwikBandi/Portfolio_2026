import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/index.css'
import App from './App.jsx'

const root = document.getElementById('root')
const tree = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Production HTML is prerendered, so hydrate; in dev the root is empty.
if (root.firstElementChild) hydrateRoot(root, tree)
else createRoot(root).render(tree)
