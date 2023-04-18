import { useState } from "react";
import EditerProfil from "./EditerProfil";
import ListeMessages from "./ListeMessages";
import Logout from "./Logout";

export default function PageProfil(props) {
  const userProfil = props.userProfil;
  const userLogin = props.login;
  const [isAbonne, setIsAbonne] = useState(false);
  const [listeAbonne, setListeAbonne] = useState([]);
  const messages = [
    {
      user: "Nie",
      content: "bonjour je suis le roi des pandas",
      date: new Date(2002, 3, 19).toLocaleDateString("fr"),
      clock: "15:50"
    }
  ];

  const isFriend = (evt) => {
    evt.preventDefault();
    let newAbonne = props.login;
    setListeAbonne([...listeAbonne, newAbonne]);
    setIsAbonne(true);
  };

  const notFriend = (evt) => {
    evt.preventDefault();
    let oldAbonne = props.login;
    setListeAbonne(listeAbonne.filter((abonne) => abonne !== oldAbonne));
    setIsAbonne(false);
  };

  const handleEdit = () => <EditerProfil />;

  return (
    <div className="profil">
      <div>{props.login}</div>
      <div>{props.description}</div>
      <div>{props.anniversaire}</div>
      <button onClick="">Amis</button>
      {userLogin === userProfil ? (
        <button onClick={handleEdit}>Editer le profil</button>
      ) : isAbonne === false ? (
        <button onClick={isFriend}>Suivre</button>
      ) : (
        <button onClick={notFriend}>Ne plus suivre</button>
      )}
      <div>
        <ListeMessages messages={messages} />
      </div>
      <Logout setLogout={props.logout} />
    </div>
  );
}
