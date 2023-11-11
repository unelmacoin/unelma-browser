import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import './css/styles.css'

function render() {
   const root = createRoot(document.getElementById("app"));
   root.render(<App />);
}

render();
