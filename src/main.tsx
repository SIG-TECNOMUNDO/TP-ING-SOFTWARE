import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import { AuthProvider } from "./context/AuthContext"
import "./index.css"

// Ensure any previous manual theme classes or storage are cleared so OS prefers-color-scheme takes full control
document.documentElement.classList.remove("dark", "light")
localStorage.removeItem("sig_theme")

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
