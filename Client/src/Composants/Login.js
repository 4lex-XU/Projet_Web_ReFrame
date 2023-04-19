import { useState } from "react";
import axios from "axios";

export default function Login(props) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const getLogin = (evt) => {
    setLogin(evt.target.value);
  };
  const getPasseword = (evt) => {
    setPassword(evt.target.value);
  };
  const submissionHandler = (evt) => {
    evt.preventDefault();
    setError(null);
    const data = {
      login: login,
      password: password,
    };
    axios
      .post("/user/login", data, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
        credentials: 'include'
      })
      .then((response) => {
        console.log(response.data);
        props.setMyLogin(login);
        props.getConnected();
        props.setCurrentPage("home_page");
      })
      .catch((error) => {
        console.log(error.response.data)
        setError(error.response.data);
      }
    );
  };
  const signinHandler = (evt) => {
    evt.preventDefault();
    props.setCurrentPage("signin_page");
  };
  return (
    <div>
      <form>
        <label htmlFor="login">Login</label>
        <input id="login" onChange={getLogin} />
        <label htmlFor="mdp">Passeword</label>
        <input type="password" id="mdp" onChange={getPasseword} />
        <div>
          <button onClick={submissionHandler}>
            Log In
          </button>
          <button type="reset">Reset</button>
        </div>
        {error && <p style={{ color: "red" }}>{error.message} {error.detail}</p>}
        <a className="signin" href="a" onClick={signinHandler}>
          pas encore inscrit ?
        </a>
      </form>
    </div>
  );
}
