// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { makeServer } from "./Server";

// Check if Mirage is running
console.log('Setting up MirageJS server...');

if (process.env.NODE_ENV === "development") {
 const server = makeServer({ environment: "development" });
  console.log('MirageJS server created:', server);
  
  // Test if MirageJS is intercepting requests
  fetch('/api/jobs?page=1&pageSize=2')
    .then(res => res.json())
    .then(data => console.log('Mirage test response:', data))
    .catch(err => console.error('Mirage test failed:', err));
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)