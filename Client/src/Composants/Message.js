import React, { useEffect, useState } from 'react';
import SaisieMessage from './SaisieMessage';
import ListeMessages from './ListeMessages';
import {
  faTrash,
  faHeart as faHeartSolid,
  faFlag,
} from '@fortawesome/free-solid-svg-icons';
import {
  faHeart as faHeartRegularIcon,
  faComment,
} from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

export default function Message(props) {
  const [saisir, setSaisir] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [nbLikes, setNbLikes] = useState(props.nbLikes);
  const [nbComments, setNbComments] = useState(null);
  const [rechargerLikes, setRechargerLikes] = useState(false);
  const [rechargerNbComments, setRechargerNbComments] = useState(false);
  const [rechargerCommentaires, setRechargerCommentaires] = useState(false);
  const [afficherCommentaires, setAfficherCommentaires] = useState(false);
  const [commentaires, setCommentaires] = useState([]);
  const [isAbonne, setIsAbonne] = useState(null);

  // PERMET DE CHANGER DE PAGE
  const pageProfilHandler = (evt) => {
    evt.preventDefault();
    props.setCurrentPage(props.login);
  };

  // PERMET D'OUVRIR UN MENU D'OPTION SUR UN MESSAGE
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  // PERMET DE SUPPRIMER UN MESSAGE
  const deleteMessage = (evt) => {
    evt.preventDefault();
    axios
      .delete(`/user/${props.id}/messages`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        credentials: 'include',
      })
      .then((res) => {
        console.log(res.data);
        props.setMessages(props.messages.filter((msg) => msg.id !== props.id));
        props.setRechargerMessages(!props.rechargerMessages);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  // PERMET DE SIGNALER UN MESSAGE
  const warning = (evt) => {
    evt.preventDefault();
    axios
      .post(
        `/messages/warning/${props.id}/${props.login}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          credentials: 'include',
        }
      )
      .then((res) => {
        console.log(res.data);
        props.setRechargerMessages(!props.rechargerMessages);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  // PERMET DE METTRE A JOUR LE NOMBRE DE LIKE D'UN MESSAGE
  useEffect(() => {
    const data = {
      MessageId: props.id,
    };
    axios
      .get(`/message/nblike`, {
        headers: {
          'Content-Type': 'application/json',
        },
        params: data,
        withCredentials: true,
        credentials: 'include',
      })
      .then((res) => {
        //console.log(res.data.nbLikes);
        setNbLikes(res.data.nbLikes);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, [rechargerLikes]);

  // PERMET DE METTRE A JOUR LE NOMBRE DE COMMENTAIRE D'UN MESSAGE
  useEffect(() => {
    const data = {
      parentId: props.id,
    };
    axios
      .get(`/message/nbcomment`, {
        headers: {
          'Content-Type': 'application/json',
        },
        params: data,
        withCredentials: true,
        credentials: 'include',
      })
      .then((res) => {
        setNbComments(res.data.nbComments);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, [rechargerCommentaires, rechargerNbComments]);

  // PERMET LORS DE LA CONNEXION SI LE MESSAGE EST DEJA LIKE OU NON
  useEffect(() => {
    const data = {
      messageId: props.id,
      login: props.myLogin,
    };
    axios
      .get('/message/:login/:messageId', {
        headers: {
          'Content-Type': 'application/json',
        },
        params: data,
        withCredentials: true,
        credentials: 'include',
      })
      .then((res) => {
        //console.log(res.data);
        if (res.data) {
          setIsLiked(true);
        }
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, []);

  // PERMET DE LIKE UN MESSAGE
  const like = (evt) => {
    evt.preventDefault();
    axios
      .post(
        `/messages/like/${props.myLogin}/${props.id}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          credentials: 'include',
        }
      )
      .then((res) => {
        console.log(res.data);
        setIsLiked(true);
        setRechargerLikes(!rechargerLikes);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  // PERMET DE DISLIKE UN MESSAGE
  const dislike = (evt) => {
    evt.preventDefault();
    axios
      .post(
        `/messages/dislike/${props.myLogin}/${props.id}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
          credentials: 'include',
        }
      )
      .then((res) => {
        console.log(res.data);
        setIsLiked(false);
        setRechargerLikes(!rechargerLikes);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  // PERMET D'OUVRIR LA SAISIE D'UN COMMENTAIRE
  const handlerSaisie = (evt) => {
    if (saisir) setSaisir(false);
    else setSaisir(true);
  };

  // PERMET D'AFFICHER LES COMMENTAIRES
  const handlerCommentaire = (evt) => {
    evt.preventDefault();
    setAfficherCommentaires(!afficherCommentaires);
  };

  // PERMET DE RECUPERER LES COMMENTAIRES D'UN MESSAGE
  useEffect(() => {
    axios
      .get(`/comment/${props.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        credentials: 'include',
      })
      .then((res) => {
        //console.log(res.data);
        setCommentaires(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, [rechargerCommentaires, afficherCommentaires]);

  // Au chargement de la page, on détermine si l'utilisateur est abonné au profil
  useEffect(() => {
    axios
      .get(`/user/${props.myLogin}/friends/${props.login}`, {
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
  }, [isAbonne, props.login]);

  // Permet de suivre un profil
  const Follow = (evt) => {
    evt.preventDefault();
    const data = {
      friend_login: props.login,
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
      .delete(`/user/${props.myLogin}/friends/${props.login}`, {
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

  return (
    <article className="message">
      <div>
        <a className="user" href="a" onClick={pageProfilHandler}>
          {props.login}
        </a>
        <button className="menuBurger" onClick={toggleMenu}>
          ...
        </button>
        {isMenuOpen && (
          <div className="menuList">
            {props.myLogin === props.login ? (
              <div>
                <button onClick={deleteMessage}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ) : (
              <div>
                <button onClick={warning}>
                  <FontAwesomeIcon icon={faFlag} />
                </button>
                {isAbonne === false ? (
                  <button onClick={Follow}>Suivre</button>
                ) : (
                  <button onClick={unFollow}>Ne plus suivre</button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="content">
        <textarea
          className="texte-msg"
          rows="5"
          cols="33"
          readOnly="readonly"
          value={props.content}
        />
      </div>
      <div className="message_button">
        {!isLiked ? (
          <button onClick={like}>
            <FontAwesomeIcon icon={faHeartRegularIcon} />
          </button>
        ) : (
          <button onClick={dislike}>
            <FontAwesomeIcon icon={faHeartSolid} />
          </button>
        )}
        {nbLikes}{' '}
        <button onClick={handlerSaisie}>
          <FontAwesomeIcon icon={faComment} />
        </button>
        {nbComments}{' '}
        {!afficherCommentaires ? (
          <button onClick={handlerCommentaire}>
            Afficher <FontAwesomeIcon icon={faComment} />
          </button>
        ) : (
          <button onClick={handlerCommentaire}>
            Masquer <FontAwesomeIcon icon={faComment} />
          </button>
        )}
      </div>
      <p className="date">
        {props.clock}
        {' · '}
        {props.date}
      </p>
      {saisir && (
        <SaisieMessage
          myLogin={props.myLogin}
          setRechargerMessages={setRechargerCommentaires}
          rechargerMessages={rechargerCommentaires}
          id={props.id}
          comment={true}
          setRechargerNbComments={setRechargerNbComments}
          rechargerNbComments={rechargerNbComments}
        />
      )}
      {afficherCommentaires && (
        <ListeMessages
          messages={commentaires}
          setCurrentPage={props.setCurrentPage}
          setMessages={setCommentaires}
          setRechargerMessages={setRechargerCommentaires}
          rechargerMessages={rechargerCommentaires}
          myLogin={props.myLogin}
        />
      )}
    </article>
  );
}
