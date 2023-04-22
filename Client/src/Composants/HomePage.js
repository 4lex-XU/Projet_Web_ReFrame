import Logout from './Logout';
import ListeMessages from './ListeMessages.js';
import SaisieMessage from './SaisieMessage';
import BarreRecherche from './BarreRecherche';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ListeProfils from './ListeProfils';

export default function HomePage(props) {
  const [saisir, setSaisir] = useState(false);
  const [messages, setMessages] = useState([]);
  const [rechargerMessages, setRechargerMessages] = useState(false);
  const [faitRecherche, setFaitRecherche] = useState(false);
  const [resultatRecherche, setResultatRecherche] = useState(null);

  const handlerSaisie = (evt) => {
    if (saisir) setSaisir(false);
    else setSaisir(true);
  };
  const pageProfilHandler = (evt) => {
    evt.preventDefault();
    props.setCurrentPage(props.myLogin);
  };

  useEffect(() => {
    axios
      .get(`/messages/getAll/${props.myLogin}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        credentials: 'include',
      })
      .then((res) => {
        if (res.data !== 'Aucun message trouvé') {
          setMessages(res.data.reverse());
        } else setMessages([]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [rechargerMessages]);

  return (
    <div>
      <div className="headerHome">
        <a className="profilPage" href="a" onClick={pageProfilHandler}>
          Mon Profil
        </a>
        <BarreRecherche
          setResultat={setResultatRecherche}
          setFaitRecherche={setFaitRecherche}
          faitRecherche={faitRecherche}
        />
        <button id="saisie" onClick={handlerSaisie}>
          Nouvelle Frame
        </button>
      </div>
      {saisir && (
        <SaisieMessage
          myLogin={props.myLogin}
          setRechargerMessages={setRechargerMessages}
          rechargerMessages={rechargerMessages}
        />
      )}
      {faitRecherche ? (
        <div className="resultatRecherche">
          <h2>Résultat de la recherche</h2>
          <ListeMessages
            messages={resultatRecherche.messages}
            setCurrentPage={props.setCurrentPage}
            setMessages={setMessages}
            setRechargerMessages={setRechargerMessages}
            rechargerMessages={rechargerMessages}
            myLogin={props.myLogin}
          />
          <ListeProfils
            profils={resultatRecherche.profils}
            setCurrentPage={props.setCurrentPage}
          />
        </div>
      ) : (
        <article className="listeMsg">
          <ListeMessages
            messages={messages}
            setCurrentPage={props.setCurrentPage}
            setMessages={setMessages}
            setRechargerMessages={setRechargerMessages}
            rechargerMessages={rechargerMessages}
            myLogin={props.myLogin}
          />
        </article>
      )}
      <footer>
        <Logout setLogout={props.logout} />
      </footer>
    </div>
  );
}
