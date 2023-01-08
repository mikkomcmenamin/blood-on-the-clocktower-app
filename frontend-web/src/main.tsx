import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "jotai";

const ContextAwareApp: React.FC = () => {
  return (
    <Provider>
      <App />
    </Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ContextAwareApp />
);
