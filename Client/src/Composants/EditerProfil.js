import { useEffect, useState } from "react";
import axios from "axios";

export default function EditerProfil(props) {
  const [newLogin, setNewLogin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [PassOk, setPassOk] = useState(true);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  
  const getNewLogin = (evt) => {
    setNewLogin(evt.target.value);
  }
  const getNewPassword = (evt) => {
    setNewPassword(evt.target.value);
  }
  const getNewPasswordConfirm = (evt) => {
    setNewPasswordConfirm(evt.target.value);
  }
  const getNewFirstName = (evt) => {
    setNewFirstName(evt.target.value);
  }
  const getNewLastName = (evt) => {
    setNewLastName(evt.target.value);
  }

  useEffect(() => {
    axios.get(`/user/${props.myLogin}`, {
      headers: {
        'Content-Type': 'application/json'
        },
        withCredentials: true,
        credentials: 'include'
        })
      .then((res) => {
        setFirstName(res.data.first_name);
        setLastName(res.data.last_name);
        setLogin(res.data.login);
        setPassword(res.data.password);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, []);

  const Edit = (evt) => {
    evt.preventDefault();
    if(newPassword === newPasswordConfirm){
      const data = {
        login: newLogin,
        password: newPassword,
        confirmpassword: newPasswordConfirm,
        firstname: newFirstName,
        lastname: newLastName
      };
      console.log(data);
      axios.post(`/user/${props.myLogin}/edit`, data, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
        credentials: 'include'
      })
        .then((res) => {
          console.log(res.data);
          if(newLogin !== ""){
            props.setMyLogin(newLogin);
            props.setCurrentPage(newLogin);
            return;
          }
          props.setCurrentPage(props.myLogin);
        })
        .catch((err) => {
          console.log(err.response.data);
          setError(err.response.data);
        });
    }else{
      setPassOk(false);
    }
  }

  const pageProfilHandler = (evt) => {
    evt.preventDefault();
    props.setCurrentPage(props.myLogin);
  }

  return (
    <div className="EditerProfil">
      <form onSubmit={Edit}>
        <label htmlFor="newLogin">New login</label>
        <input type="text" id="newLogin" className="newLogin" onChange={getNewLogin} placeholder={login}/>
        <label htmlFor="newPassword">New password</label>
        <input type="password" id="newPassword" className="newPassword" onChange={getNewPassword} placeholder={password}/>
        <label htmlFor="newPasswordConfirm">Confirm new password</label>
        <input type="password" id="newPasswordConfirm" className="newPasswordConfirm" onChange={getNewPasswordConfirm} placeholder={password}/>
        <label htmlFor="newFirstName">New firstname</label>
        <input type="text" id="newFirstName" className="newFirstName" onChange={getNewFirstName} placeholder={firstName}/>
        <label htmlFor="newLastName">New lastname</label>
        <input type="text" id="newLastName" className="newLastName" onChange={getNewLastName} placeholder={lastName}/>
        <button type="submit">Valider</button>
        {!PassOk && <p style={{color:'red'}}>Les mots de passe ne correspondent pas</p>}
        {error && <p style={{color:'red'}}>{error.message}</p>}
        <a className="pageProfil" href="a" onClick={pageProfilHandler}>
          Retour
        </a>
      </form>
    </div>
  );
}
