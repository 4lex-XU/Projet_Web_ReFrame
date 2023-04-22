import React, { useState } from 'react';
import axios from 'axios';
export default function Message(props) {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const pageProfilHandler = (evt) => {
    evt.preventDefault();
    props.setCurrentPage(props.login);
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

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

  const editMessage = () => {
    // Code pour éditer le message
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
          <ul className="menuList">
            {props.myLogin === props.login ? (
              <div>
                <li onClick={deleteMessage}>Supprimer le message</li>
                <li onClick={editMessage}>Editer le message</li>
              </div>
            ) : (
              <div>
                <li>Signaler le message</li>
                <li>Suivre/Ne plus suivre</li>
              </div>
            )}
          </ul>
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
      <p className="date">
        {props.clock}
        {' · '}
        {props.date}
      </p>
    </article>
  );
}
