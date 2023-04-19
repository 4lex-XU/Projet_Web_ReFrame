import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import MainPage from "./Composants/MainPage";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
axios.defaults.baseURL = "http://localhost:4000/api";

root.render(
  <StrictMode>
    <div className="mainpage">
      <MainPage />
    </div>
  </StrictMode>
);
