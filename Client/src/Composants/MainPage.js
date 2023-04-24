import { useState } from 'react';
import '../CSS/styles.css';
import '../CSS/formulaire.css';
import '../CSS/message.css';
import logo from '../Images/Logo-ReFrame.png';

import NavigationPanel from './NavigationPanel.js';

export default function MainPage(props) {
  // states
  const [isConnected, setConnect] = useState(false);
  const [currentPage, setCurrentPage] = useState('signin_page');
  const [myLogin, setMyLogin] = useState('');

  // comportements
  const getConnected = () => {
    setConnect(true);
    setCurrentPage('home_page');
  };
  const setLogout = () => {
    setConnect(false);
    setCurrentPage('login_page');
  };

  const handler = (evt) => {
    evt.preventDefault();
    if (isConnected) {
      setCurrentPage('home_page');
    } else if (currentPage === 'signin_page') {
      setCurrentPage('login_page');
    } else {
      setCurrentPage('signin_page');
    }
  };

  // render
  return (
    <div>
      <header className="reframe">
        <a className="logo" href="a" onClick={handler}>
          <img src={logo} style={{ width: '50%' }} />
        </a>
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
