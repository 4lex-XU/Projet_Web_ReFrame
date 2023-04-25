import { useState, useEffect } from 'react';
import ListeMessages from './ListeMessages';
import ListeProfils from './ListeProfils';
import Logout from './Logout';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

export default function PageProfil(props) {
  const [isAbonne, setIsAbonne] = useState(null);
  const [messages, setMessages] = useState([]);
  const [afficherAmis, setAfficherAmis] = useState(false);
  const [amis, setAmis] = useState([]);
  const [rechargerMessages, setRechargerMessages] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [naissance, setNaissance] = useState('');
  const [description, setDescription] = useState('');
  const [ville, setVille] = useState('');
  const [amiStar, setAmiStar] = useState(null);
  const [isBlocked, setIsBlocked] = useState(null);
  const [afficherBlacklist, setAfficherBlacklist] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState([]);

  // Lors de l'ouverture de la page, on récupère les informations du profil
  useEffect(() => {
    axios
      .get(`/user/${props.userProfil}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        credentials: 'include',
      })
      .then((res) => {
        setFirstName(res.data.firstName);
        setLastName(res.data.lastName);
        setNaissance(res.data.naissance);
        setDescription(res.data.description);
        setVille(res.data.ville);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, [props.userProfil]);

  // Au chargement de la page, on détermine si l'utilisateur est abonné au profil
  useEffect(() => {
    axios
      .get(`/user/${props.myLogin}/friends/${props.userProfil}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        credentials: 'include',
      })
      .then((res) => {
        setIsAbonne(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, [isAbonne, props.userProfil]);

  // Au chargement de la page, on détermine si l'utilisateur est bloqué par le profil
  useEffect(() => {
    axios
      .get(`/blacklist/${props.myLogin}/${props.userProfil}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        credentials: 'include',
      })
      .then((res) => {
        setIsBlocked(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, [isBlocked, props.userProfil]);

  // Au chargement de la page, on récupère les messages du profil
  useEffect(() => {
    axios
      .get(`/user/${props.userProfil}/messages`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        credentials: 'include',
      })
      .then((res) => {
        if (res.data !== 'Aucun message trouvé') {
          setMessages(res.data.reverse());
        }
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, [rechargerMessages, props.userProfil]);

  // Permet de suivre un profil
  const Follow = (evt) => {
    evt.preventDefault();
    const data = {
      friend_login: props.userProfil,
    };
    axios
      .put(`/user/${props.myLogin}/newfriend`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        credentials: 'include',
      })
      .then((res) => {
        console.log(res.data);
        setIsAbonne(true);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  // Permet de ne plus suivre un profil
  const unFollow = (evt) => {
    evt.preventDefault();
    axios
      .delete(`/user/${props.myLogin}/friends/${props.userProfil}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        credentials: 'include',
      })
      .then((res) => {
        console.log(res.data);
        setIsAbonne(false);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  // Permet de passer à la page d'édition du profil
  const handleEdit = (evt) => {
    evt.preventDefault();
    props.setCurrentPage('edit_page');
  };

  // Permet de passer à la page d'accueil
  const homePageHandler = (evt) => {
    evt.preventDefault();
    props.setCurrentPage('home_page');
  };

  // Permet de supprimer le compte
  const handleDelete = () => {
    axios
      .delete(`/user/${props.myLogin}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        credentials: 'include',
      })
      .then((res) => {
        props.logout();
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  // Permet de récupérer la liste des amis
  const getListAmis = () => {
    setAfficherAmis(!afficherAmis);
  };
  useEffect(() => {
    axios
      .get(`/user/${props.userProfil}/friends`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        credentials: 'include',
      })
      .then((res) => {
        console.log(res.data);
        if (res.data === 'Aucun ami trouvé') {
          setAmis(null);
        } else {
          setAmis(res.data);
        }
      })
      .catch((err) => {
        console.log(err.response.data);
      });

    axios
      .get(`/user/${props.myLogin}/statistique`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        credentials: 'include',
      })
      .then((res) => {
        console.log(res.data);
        setAmiStar(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, [afficherAmis, props.userProfil]);

  // Permet de bloquer un utilisateur
  const blocked = (evt) => {
    evt.preventDefault();
    const data = {
      blackLogin: props.userProfil,
    };
    axios
      .put(`/blacklist/${props.myLogin}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        credentials: 'include',
      })
      .then((res) => {
        console.log(res.data);
        setIsBlocked(true);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  // Permet de debloquer un utilisateur
  const unBlocked = (evt) => {
    evt.preventDefault();
    const data = {
      blackLogin: props.userProfil,
    };
    axios
      .delete(`/blacklist/${props.myLogin}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        params: data,
        withCredentials: true,
        credentials: 'include',
      })
      .then((res) => {
        console.log(res.data);
        setIsBlocked(false);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  // Permet de récupérer la liste des utilisateurs bloqués
  const getListBlocked = () => {
    setAfficherBlacklist(!afficherBlacklist);
  };
  useEffect(() => {
    axios
      .get(`/blacklist/${props.myLogin}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        credentials: 'include',
      })
      .then((res) => {
        console.log(res.data);
        if (res.data === 'Liste noire vide') {
          setBlockedUsers(null);
        } else setBlockedUsers(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, [afficherBlacklist, props.myLogin]);

  return (
    <div className="profil">
      <div className="headerHome">
        <button onClick={homePageHandler}>
          <FontAwesomeIcon icon={faHome} size="3x" />
        </button>
        <h3 className="prenom-nom">
          {firstName} {lastName}{' '}
          <span className="tag">@{props.userProfil}</span>
        </h3>
        <div>
          <p>{naissance}</p>
          <p>{ville}</p>
          <p>{description}</p>
        </div>
        {props.myLogin === props.userProfil ? (
          <div className="headerHome">
            <button onClick={getListAmis}>Amis</button>
            <button onClick={getListBlocked}>Utilisateurs bloqués</button>
            <button onClick={handleEdit}>Editer le profil</button>
            <button onClick={handleDelete}>Supprimer mon compte</button>
          </div>
        ) : isAbonne === false && isBlocked === false ? (
          <div className="headerHome">
            <button onClick={getListAmis}>Amis</button>
            <button onClick={Follow}>Suivre</button>
            <button onClick={blocked}>Bloquer</button>
          </div>
        ) : isAbonne === false && isBlocked === true ? (
          <div className="headerHome">
            <button onClick={getListAmis}>Amis</button>
            <button onClick={Follow}>Suivre</button>
            <button onClick={unBlocked}>Débloquer</button>
          </div>
        ) : isAbonne === true && isBlocked == true ? (
          <div className="headerHome">
            <button onClick={getListAmis}>Amis</button>
            <button onClick={unFollow}>Ne plus suivre</button>
            <button onClick={unBlocked}>Débloquer</button>
          </div>
        ) : (
          <div className="headerHome">
            <button onClick={getListAmis}>Amis</button>
            <button onClick={unFollow}>Ne plus suivre</button>
            <button onClick={blocked}>Bloquer</button>
          </div>
        )}
      </div>

      {afficherAmis && (
        <div>
          <h2>Amis</h2>
          <div>AmiStar : {amiStar}</div>
          <ListeProfils profils={amis} setCurrentPage={props.setCurrentPage} />
        </div>
      )}
      {afficherBlacklist && props.myLogin === props.userProfil && (
        <div>
          <h2>Utilisateurs bloqués</h2>
          <ListeProfils
            profils={blockedUsers}
            setCurrentPage={props.setCurrentPage}
          />
        </div>
      )}
      <div>
        <ListeMessages
          messages={messages}
          setCurrentPage={props.setCurrentPage}
          setMessages={setMessages}
          setRechargerMessages={setRechargerMessages}
          rechargerMessages={rechargerMessages}
          myLogin={props.myLogin}
        />
      </div>
      <Logout setLogout={props.logout} />
    </div>
  );
}
