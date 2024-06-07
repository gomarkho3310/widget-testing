import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

const widgetKey = document
  .querySelector("script[data-key]")
  .getAttribute("data-key");

const widgetRoot = document.createElement("div");
document.body.appendChild(widgetRoot);

ReactDOM.createRoot(widgetRoot).render(
  <React.StrictMode>
    <App wkey={widgetKey} />
  </React.StrictMode>
);

// const topContainer = document.body.children[0];
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
