import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

const widgetDivs = document.querySelectorAll(".nicoraynaud-finance-widget");

widgetDivs.forEach((div) => {
  ReactDOM.createRoot(div).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
