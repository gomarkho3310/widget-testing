import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// const widgetBgColor = document
//   .querySelector("script[data-widget-bg-color]")
//   .getAttribute("data-widget-bg-color");

const topContainer = document.body.children[0];

const widgetRoot = document.createElement("div");
topContainer.appendChild(widgetRoot);

ReactDOM.createRoot(widgetRoot).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// const widgetDivs = document.querySelectorAll(".nicoraynaud-finance-widget");
// const widgetBgColor = document
//   .querySelector("script[data-widget-bg-color]")
//   .getAttribute("data-widget-bg-color");

// widgetDivs.forEach((div) => {
//   ReactDOM.createRoot(div).render(
//     <React.StrictMode>
//       <App bgColor={widgetBgColor} />
//     </React.StrictMode>
//   );
// });
