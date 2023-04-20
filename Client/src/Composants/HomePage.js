import Logout from "./Logout";
import ListeMessages from "./ListeMessages.js";
import SaisieMessage from "./SaisieMessage";
import BarreRecherche from "./BarreRecherche";
import { useState, useEffect } from "react";
import axios from "axios";

export default function HomePage(props) {
  const [saisir, setSaisir] = useState(false);
  const [messages, setMessages] = useState([]);
  const [rechargerMessages, setRechargerMessages] = useState(false);

  const handlerSaisie = (evt) => {
    if (saisir) setSaisir(false);
    else setSaisir(true);
  };
  const pageProfilHandler = (evt) => {
    evt.preventDefault();
    props.setCurrentPage(props.myLogin);
  };

  useEffect(() => {
    axios.get(`/messages/getAll`)
      .then((res) => {
        setMessages(res.data.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  }, [rechargerMessages]);

  const rechargerMessagesHandler = () => {
    setRechargerMessages(!rechargerMessages);
  };

  return (
    <div>
      <div className="headerHome">
        <a className="profilPage" href="a" onClick={pageProfilHandler}>
          Mon Profil
        </a>
        <BarreRecherche />
      </div>
      {saisir && <SaisieMessage myLogin={props.myLogin}/>}
      <button id="saisie" onClick={handlerSaisie}>
        NouvelFrame
      </button>
      <button id="recharger" onClick={rechargerMessagesHandler}>
        Recharger les messages
      </button>
      <article className="listeMsg">
        <ListeMessages 
          messages={messages} 
          setCurrentPage={props.setCurrentPage}
        />
      </article>
      <footer>
        <Logout setLogout={props.logout} />
      </footer>
    </div>
  );
}
