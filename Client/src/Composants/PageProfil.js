import { useState, useEffect } from "react";
import EditerProfil from "./EditerProfil";
import ListeMessages from "./ListeMessages";
import Logout from "./Logout";
import axios from "axios";

export default function PageProfil(props) {
  const [isAbonne, setIsAbonne] = useState(null);
  const [messages, setMessages] = useState([]);
  const [rechargerMessages, setRechargerMessages] = useState(false);

  useEffect(() => {
    axios.get(`/user/${props.myLogin}/friends/${props.userProfil}`, {
      headers: {
        'Content-Type': 'application/json'
        },
        withCredentials: true,
        credentials: 'include'
        })
      .then((res) => {
        setIsAbonne(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, [isAbonne]);

  useEffect(() => {
    axios.get(`/user/${props.userProfil}/messages`, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
      credentials: 'include'
    })
      .then((res) => {
        if(res.data !== "Aucun message trouvé"){
          setMessages(res.data.reverse());
        }
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, [rechargerMessages]);

  const Follow = (evt) => {
    evt.preventDefault();
    const data = {
      friend_login: props.userProfil
    };
    axios.put(`/user/${props.myLogin}/newfriend`, data,{
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
      credentials: 'include'
    })
      .then((res) => {
        console.log(res.data);
        setIsAbonne(true);
      })  
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  const unFollow = (evt) => {
    evt.preventDefault();
    axios
      .delete(`/user/${props.myLogin}/friends/${props.userProfil}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
        credentials: 'include'
      })
      .then((res) => {
        console.log(res.data);
        setIsAbonne(false);
      }
      )
      .catch((err) => {
        console.log(err.response.data);
      }
      );
  };

  const handleEdit = (evt) => {
    evt.preventDefault();
    props.setCurrentPage("edit_page");
  };

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
        props.logout();
        console.log(res.data);
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
        <button onClick={Follow}>Suivre</button>
      ) : (
        <button onClick={unFollow}>Ne plus suivre</button>
      )}

      <a className="homePage" href="a" onClick={homePageHandler}>
          Page d'accueil
      </a>
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
