import { useState, useEffect } from "react";
import EditerProfil from "./EditerProfil";
import ListeMessages from "./ListeMessages";
import Logout from "./Logout";
import axios from "axios";

export default function PageProfil(props) {
  const [isAbonne, setIsAbonne] = useState(false);
  const [listeAbonne, setListeAbonne] = useState([]);
  const [messages, setMessages] = useState([]);
  const [rechargerMessages, setRechargerMessages] = useState(false);

  useEffect(() => {
    axios.get(`/user/${props.userProfil}/messages`, {
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
  }, [rechargerMessages]);

  const rechargerMessagesHandler = () => {
    setRechargerMessages(!rechargerMessages);
  };

  const isFriend = (evt) => {
    evt.preventDefault();
    /*let newAbonne = props.login;
    setListeAbonne([...listeAbonne, newAbonne]);
    setIsAbonne(true);*/
  };

  const notFriend = (evt) => {
    /*evt.preventDefault();
    let oldAbonne = props.login;
    setListeAbonne(listeAbonne.filter((abonne) => abonne !== oldAbonne));
    setIsAbonne(false);*/
  };

  const handleEdit = () => <EditerProfil />;
  const homePageHandler = (evt) => {
    evt.preventDefault();
    props.setCurrentPage("home_page");
  };

  const handleDelete = () => {
    axios.delete(`/user/${props.myLogin}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
      credentials: 'include'
    })
      .then((res) => {
        console.log(res.data);
        props.setLogout();
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  const getListAmis = () => {
  };
  return (
    <div className="profil">
      <div>{props.userProfil}</div>
      <button onClick={getListAmis}>Amis</button>
      

      {props.myLogin === props.userProfil ? (
        <div>
          <button onClick={handleEdit}>Editer le profil</button>
          <button onClick={handleDelete}>Supprimer mon compte</button> 
        </div>
      ) : isAbonne === false ? (
        <button onClick={isFriend}>Suivre</button>
      ) : (
        <button onClick={notFriend}>Ne plus suivre</button>
      )}


      <a className="homePage" href="a" onClick={homePageHandler}>
          Page d'accueil
      </a>
      <button id="recharger" onClick={rechargerMessagesHandler}>
        Recharger les messages
      </button>
      <div>
        <ListeMessages 
          messages={messages} 
          setCurrentPage={props.setCurrentPage}
        />
      </div>
      <Logout setLogout={props.logout} />
    </div>
  );
}
