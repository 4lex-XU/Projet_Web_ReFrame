import { useState, useEffect } from "react";
import EditerProfil from "./EditerProfil";
import ListeMessages from "./ListeMessages";
import Logout from "./Logout";
import axios from "axios";

export default function PageProfil(props) {
  const userProfil = props.userProfil;
  const userLogin = props.login;
  const [isAbonne, setIsAbonne] = useState(false);
  const [listeAbonne, setListeAbonne] = useState([]);
  const [messages, setMessages] = useState([]);

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
  const homePageHandler = (evt) => {
    evt.preventDefault();
    props.setCurrentPage("home_page");
  };
  
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
      <a className="homePage" href="a" onClick={homePageHandler}>
          Page d'acceuil
      </a>
      <div>
        <ListeMessages messages={messages.reverse()} />
      </div>
      <Logout setLogout={props.logout} />
    </div>
  );
}
