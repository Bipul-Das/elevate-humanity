import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// 1. Bootstrap CSS (Looks)
import "bootstrap/dist/css/bootstrap.min.css";

// 2. Bootstrap JS (Actions) - ADD THIS LINE!
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
