import { useState } from "react";
import "./styles.css";

import PageProfil from "./PageProfil";
import ListeMessages from "./ListeMessages.js";
import SaisieMessage from "./SaisieMessage";
import NavigationPanel from "./NavigationPanel.js";
import EditerProfil from "./EditerProfil";
import Signin from "./Signin";
import Login from "./Login";

export default function MainPage(props) {
  // states
  const [isConnected, setConnect] = useState(false);
  const [currentPage, setCurrentPage] = useState("signin_page");
  const messages = [
    {
      user: "salade",
      content: "bonjour je suis une salade",
      date: new Date(2023, 2, 0).toLocaleDateString("fr"),
      clock: "15:50"
    },
    {
      user: "panda",
      content: "bonjour j'ai des cernes",
      date: new Date(2002, 3, 19).toLocaleDateString("fr"),
      clock: "15:50"
    },
    {
      user: "salade",
      content: "bonjour je suis une salade",
      date: new Date(2023, 2, 0).toLocaleDateString("fr"),
      clock: "15:50"
    },
    {
      user: "salade",
      content: "bonjour je suis une salade",
      date: new Date(2023, 2, 0).toLocaleDateString("fr"),
      clock: "15:50"
    },
    {
      user: "salade",
      content: "bonjour je suis une salade",
      date: new Date(2023, 2, 0).toLocaleDateString("fr"),
      clock: "15:50"
    }
  ];

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
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          login={getConnected}
          logout={setLogout}
          isConnected={isConnected}
          messages={messages}
        />
      </main>
    </div>
  );
}
