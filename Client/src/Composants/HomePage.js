import Logout from "./Logout";
import ListeMessages from "./ListeMessages.js";
import SaisieMessage from "./SaisieMessage";
import BarreRecherche from "./BarreRecherche";
import { useState, useEffect } from "react";
import axios from "axios";
import ListeProfils from "./ListeProfils";

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
        <BarreRecherche setResultat={setResultatRecherche} setFaitRecherche={setFaitRecherche}/>
        <button id="saisie" onClick={handlerSaisie}>
          NouvelFrame
        </button>
        <button id="recharger" onClick={rechargerMessagesHandler}>
          Recharger les messages
        </button>
      </div>
      {saisir && <SaisieMessage myLogin={props.myLogin}/>}
      {faitRecherche ? (
        <div className="resultatRecherche">
          <h2>Résultat de la recherche</h2>
          <ListeMessages 
            messages={resultatRecherche.messages} 
            setCurrentPage={props.setCurrentPage}
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
          />
        </article>          
      )}
      <footer>
        <Logout setLogout={props.logout} />
      </footer>
    </div>
  );
}
