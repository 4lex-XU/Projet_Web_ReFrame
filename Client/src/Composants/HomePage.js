import Logout from "./Logout";
import ListeMessages from "./ListeMessages.js";
import SaisieMessage from "./SaisieMessage";
import BarreRecherche from "./BarreRecherche";
import { useState, useEffect } from "react";
import axios from "axios";

export default function HomePage(props) {
  const [saisir, setSaisir] = useState(false);
  const [messages, setMessages] = useState([]);

  const handlerSaisie = (evt) => {
    if (saisir) setSaisir(false);
    else setSaisir(true);
  };
  const pageProfilHandler = (evt) => {
    evt.preventDefault();
    props.setCurrentPage("profil_page");
  };

  useEffect(() => {
    axios.get(`/user/${props.myLogin}/messages`, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
      credentials: 'include'
    })
      .then((res) => {
        setMessages(res.data.reverse());
      })
      .catch((err) => {
        console.log(err);
      });
  }, [messages]);

  return (
    <div>
      <div className="headerHome">
        <a className="profilPage" href="a" onClick={pageProfilHandler}>
          Mon Profil
        </a>
        <BarreRecherche />
      </div>
      {saisir === false ? null : <SaisieMessage myLogin={props.myLogin}/>}
      <button id="saisie" onClick={handlerSaisie}>
        NouvelFrame
      </button>
      <article className="listeMsg">
        <ListeMessages messages={messages} />
      </article>
      <footer>
        <Logout setLogout={props.logout} />
      </footer>
    </div>
  );
}
