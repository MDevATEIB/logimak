import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";

// La démo web utilise exactement le même App.tsx que la version desktop
// Seul le service database change (localStorage au lieu de Tauri Store)

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
