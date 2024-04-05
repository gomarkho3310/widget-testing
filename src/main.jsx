import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

const widgetDivs = document.querySelectorAll(".nicoraynaud-finance-widget");
// const widgetBgColor = document
//   .querySelector("script[data-widget-bg-color]")
//   .getAttribute("data-widget-bg-color")

const widgetBgColor = "green";

widgetDivs.forEach((div) => {
  ReactDOM.createRoot(div).render(
    <React.StrictMode>
      <App bgColor={widgetBgColor} />
    </React.StrictMode>
  );
});
