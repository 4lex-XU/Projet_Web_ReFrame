import { useState } from "react";
import "../CSS/styles.css";
import "../CSS/formulaire.css";
import "../CSS/message.css";

import NavigationPanel from "./NavigationPanel.js";

export default function MainPage(props) {
  // states
  const [isConnected, setConnect] = useState(false);
  const [currentPage, setCurrentPage] = useState("signin_page");
  const [myLogin, setMyLogin] = useState("");

  // comportements
  const getConnected = () => {
    setConnect(true);
    setCurrentPage("home_page");
  };
  const setLogout = () => {
    setConnect(false);
    setCurrentPage("login_page");
  };

  // render
  return (
    <div>
      <header className="reframe">
        <h1>ReFrame</h1>
      </header>
      <main>
        <NavigationPanel
          myLogin={myLogin}
          setMyLogin={setMyLogin}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          login={getConnected}
          logout={setLogout}
          isConnected={isConnected}
        />
      </main>
    </div>
  );
}
