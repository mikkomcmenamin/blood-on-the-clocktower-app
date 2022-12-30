import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppContext, Context, initialCtxValue } from "./context";
import "./index.css";
import {enableSounds} from "./components/soundManager";

const ContextAwareApp: React.FC = () => {
  const [value, setValue] = React.useState<Context>(initialCtxValue);

  enableSounds(value.sound);

  return (
    <AppContext.Provider value={{ value, setValue }}>
      <App />
    </AppContext.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ContextAwareApp />
);
