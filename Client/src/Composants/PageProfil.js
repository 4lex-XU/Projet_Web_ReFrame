import { useState, useEffect } from 'react';
import ListeMessages from './ListeMessages';
import ListeProfils from './ListeProfils';
import avatar from '../Images/avatar.png';
import entete from '../Images/entete.png';
import '../CSS/profil.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCake,
  faMapMarkerAlt,
  faStar,
} from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';

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
      <div className="headerProfil">
        <div className="entete">
          <img src={entete} />
        </div>
        <div className="avatar">
          <img src={avatar} />
        </div>
        <div className="header-info">
          <div className="prenom-nom">
            {firstName} {lastName}
          </div>
          <div className="tag">@{props.userProfil}</div>
        </div>
        <div className="list-info">
          <p>
            <p>{description}</p>
            <FontAwesomeIcon icon={faCake} /> {naissance}
            {'  '}
            <FontAwesomeIcon icon={faMapMarkerAlt} /> {ville}
          </p>
        </div>
        <div className="btn-group">
          {props.myLogin === props.userProfil ? (
            <div className="button-container">
              <button className="btn btn-secondary" onClick={getListAmis}>
                Amis
              </button>
              <button className="btn btn-secondary" onClick={getListBlocked}>
                Utilisateurs bloqués
              </button>
              <button className="btn btn-secondary" onClick={handleEdit}>
                Editer le profil
              </button>
              <button className="btn btn-secondary" onClick={handleDelete}>
                Supprimer mon compte
              </button>
            </div>
          ) : isAbonne === false && isBlocked === false ? (
            <div className="button-container">
              <button className="btn btn-secondary" onClick={getListAmis}>
                Amis
              </button>
              <button className="btn btn-secondary" onClick={Follow}>
                Suivre
              </button>
              <button className="btn btn-secondary" onClick={blocked}>
                Bloquer
              </button>
            </div>
          ) : isAbonne === false && isBlocked === true ? (
            <div className="button-container">
              <button className="btn btn-secondary" onClick={getListAmis}>
                Amis
              </button>
              <button className="btn btn-secondary" onClick={Follow}>
                Suivre
              </button>
              <button className="btn btn-secondary" onClick={unBlocked}>
                Débloquer
              </button>
            </div>
          ) : isAbonne === true && isBlocked === true ? (
            <div className="button-container">
              <button className="btn btn-secondary" onClick={getListAmis}>
                Amis
              </button>
              <button className="btn btn-secondary" onClick={unFollow}>
                Ne plus suivre
              </button>
              <button className="btn btn-secondary" onClick={unBlocked}>
                Débloquer
              </button>
            </div>
          ) : (
            <div className="button-container">
              <button className="btn btn-secondary" onClick={getListAmis}>
                Amis
              </button>
              <button className="btn btn-secondary" onClick={unFollow}>
                Ne plus suivre
              </button>
              <button className="btn btn-secondary" onClick={blocked}>
                Bloquer
              </button>
            </div>
          )}
        </div>
      </div>

      {afficherAmis && (
        <div className="liste-amis">
          <h2>Amis</h2>
          <div>
            <FontAwesomeIcon icon={faStar} beat></FontAwesomeIcon> {amiStar}
          </div>
          <ListeProfils profils={amis} setCurrentPage={props.setCurrentPage} />
        </div>
      )}
      {afficherBlacklist && props.myLogin === props.userProfil && (
        <div className="liste-amis">
          <h2>Utilisateurs bloqués</h2>
          <ListeProfils
            profils={blockedUsers}
            setCurrentPage={props.setCurrentPage}
          />
        </div>
      )}
      <div className="liste-messages">
        <ListeMessages
          messages={messages}
          setCurrentPage={props.setCurrentPage}
          setMessages={setMessages}
          setRechargerMessages={setRechargerMessages}
          rechargerMessages={rechargerMessages}
          myLogin={props.myLogin}
        />
      </div>
    </div>
  );
}
