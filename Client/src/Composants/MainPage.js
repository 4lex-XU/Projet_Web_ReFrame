import { useState } from 'react';
import '../CSS/styles.css';
import '../CSS/formulaire.css';
import '../CSS/message.css';
import logo from '../Images/Logo-ReFrame.png';

import NavigationPanel from './NavigationPanel.js';
import Login from './Login';
import Signin from './Signin';
import HomePage from './HomePage';
import PageProfil from './PageProfil';
import EditerProfil from './EditerProfil';

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
          <img src={logo} />
        </a>
        <aside>
          <NavigationPanel
            myLogin={myLogin}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            setLogout={setLogout}
            isConnected={isConnected}
          />
        </aside>
      </header>
      <main>
        {currentPage === 'signin_page' ? (
          <Signin setCurrentPage={setCurrentPage} />
        ) : isConnected ? (
          currentPage === 'home_page' ? (
            <HomePage myLogin={myLogin} setCurrentPage={setCurrentPage} />
          ) : currentPage === 'edit_page' ? (
            <EditerProfil
              myLogin={myLogin}
              setMyLogin={setMyLogin}
              setCurrentPage={setCurrentPage}
            />
          ) : (
            <PageProfil
              myLogin={myLogin}
              userProfil={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )
        ) : (
          <Login
            setMyLogin={setMyLogin}
            getConnected={getConnected}
            setCurrentPage={setCurrentPage}
          />
        )}
      </main>
    </div>
  );
}
