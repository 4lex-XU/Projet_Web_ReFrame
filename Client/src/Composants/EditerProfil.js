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
    axios.get(`/user/${props.myLogin}`)
      .then((res) => {
        setNewLogin(res.data.login);
        setNewPassword(res.data.password);
        setNewFirstName(res.data.firstName);
        setNewLastName(res.data.lastName);
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
        first_name: newFirstName,
        last_name: newLastName
      };
      axios.post(`/user/${props.myLogin}/edit`, data, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
        credentials: 'include'
      })
        .then((res) => {
          console.log(res.data);
          props.setRechargerProfil(true);
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    }else{
      setPassOk(false);
    }
  }

  const pageProfilHandler = (evt) => {
    evt.preventDefault();
    props.setCurrentPage("profil_page");
  }

  return (
    <div className="EditerProfil">
      <form onSubmit={Edit}>
        <label htmlFor="newLogin">New login</label>
        <input type="text" id="newLogin" className="newLogin" onChange={getNewLogin} placeholder={newLogin}/>
        <label htmlFor="newPassword">New password</label>
        <input type="password" id="newPassword" className="newPassword" onChange={getNewPassword} />
        <label htmlFor="newPasswordConfirm">Confirm new password</label>
        <input type="password" id="newPasswordConfirm" className="newPasswordConfirm" onChange={getNewPasswordConfirm} />
        {!PassOk && <p style={{color:red}}>Les mots de passe ne correspondent pas</p>}
        <label htmlFor="newFirstName">New firstname</label>
        <input type="text" id="newFirstName" className="newFirstName" onChange={getNewFirstName} />
        <label htmlFor="newLastName">New lastname</label>
        <input type="text" id="newLastName" className="newLastName" onChange={getNewLastName} />
        <button type="submit">Valider</button>
        <a className="pageProfil" href="a" onClick={pageProfilHandler}>
          Retour
        </a>
      </form>
    </div>
  );
}
