import { useState } from 'react';
import axios from 'axios';

export default function Signin(props) {
  const [login, setLogin] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [passOK, setPassOK] = useState(false);
  const [pass, setPass] = useState('');
  const [passVerif, setPassVerif] = useState('');
  const [error, setError] = useState(null);

  const getLogin = (evt) => {
    setLogin(evt.target.value);
  };
  const getFirstName = (evt) => {
    setFirstName(evt.target.value);
  };
  const getLastName = (evt) => {
    setLastName(evt.target.value);
  };
  const getPass = (evt) => {
    setPass(evt.target.value);
  };
  const getPassVerif = (evt) => {
    setPassVerif(evt.target.value);
  };
  const submissionHandler = (evt) => {
    if (pass === passVerif) setPassOK(false);
    else setPassOK(true);
    evt.preventDefault();
    setError(null);
    if (!passOK) {
      const data = {
        login: login,
        password: pass,
        lastname: lastName,
        firstname: firstName,
      };
      console.log(data);
      axios
        .put('/user', data)
        .then((response) => {
          console.log(response.data);
          props.setCurrentPage('login_page');
        })
        .catch((error) => {
          console.log(error.response.data);
          setError(error.response.data);
        });
    }
  };

  const loginHandler = (evt) => {
    evt.preventDefault();
    props.setCurrentPage('login_page');
  };

  return (
    <div>
      <form name="signin">
        <label htmlFor="firstname">First name</label>
        <input id="firstname" onChange={getFirstName} />
        <label htmlFor="lastname">Last name</label>
        <input id="lastname" onChange={getLastName} />
        <label htmlFor="signin_login">Login</label>
        <input id="signin_login" onChange={getLogin} />
        <label htmlFor="signin_mdp1">Password</label>
        <input type="password" id="signin_mdp1" onChange={getPass} />
        <label htmlFor="signin_mdp2">Confirm Password</label>
        <input type="password" id="signin_mdp2" onChange={getPassVerif} />
        {passOK && (
          <p style={{ color: 'red' }}>Veuillez reconfirmer le mot de passe</p>
        )}
        {error && (
          <p style={{ color: 'red' }}>
            {error.message} {error.detail}
          </p>
        )}
        <div className="signin-input">
          <button onClick={submissionHandler}>Sign In</button>
          <button type="reset">Reset</button>
        </div>
        <a className="connexion" href="a" onClick={loginHandler}>
          déja inscrit ?
        </a>
      </form>
    </div>
  );
}
