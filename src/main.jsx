import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

const widgetDivs = document.querySelectorAll(".nicoraynaud-finance-widget");

widgetDivs.forEach((div) => {
  const bgColor = div.getAttribute("data-widget-bg-color");
  ReactDOM.createRoot(div).render(
    <React.StrictMode>
      <App bgColor={bgColor} />
    </React.StrictMode>
  );
});
