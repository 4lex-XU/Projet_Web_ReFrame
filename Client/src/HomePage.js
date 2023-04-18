import Logout from "./Logout";
import ListeMessages from "./ListeMessages.js";
import SaisieMessage from "./SaisieMessage";
import BarreRecherche from "./BarreRecherche";
import { useState } from "react";

export default function HomePage(props) {
  const [saisir, setSaisir] = useState(false);
  const handlerSaisie = (evt) => {
    if (saisir) setSaisir(false);
    else setSaisir(true);
  };
  const pageProfilHandler = (evt) => {
    evt.preventDefault();
    props.setCurrentPage("profil_page");
  };
  return (
    <div>
      <div className="headerHome">
        <a className="profilPage" href="a" onClick={pageProfilHandler}>
          Mon Profil
        </a>
        <BarreRecherche />
      </div>
      {saisir === false ? null : <SaisieMessage />}
      <button id="saisie" onClick={handlerSaisie}>
        NouvelFrame
      </button>
      <article className="listeMsg">
        <ListeMessages messages={props.messages} />
      </article>
      <footer>
        <Logout setLogout={props.logout} />
      </footer>
    </div>
  );
}
