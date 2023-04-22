import { useState } from "react";
import axios from "axios";

export default function SaisieMessage(props) {
  const [content, setContent] = useState("");
  const currentDate = new Date();
  const date = currentDate.toLocaleDateString("fr");
  const clock = currentDate.getHours() + ":" + currentDate.getMinutes();
  const [error, setError] = useState("");

  const getContent = (evt) => setContent(evt.target.value);

  const submissionHandler = (evt) => {
    evt.preventDefault();
    setError(null);
    const data = {
      login: props.myLogin,
      content: content,
      date: date,
      clock: clock,
    };
    axios
      .put('/user/newMessage', data, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
        credentials: 'include'
      })
      .then((response) => {
        console.log(response.data);
        setContent("");
        props.setRechargerMessages(!props.rechargerMessages);
      })
      .catch((error) => {
        console.log(error.response.data);
        setError(error.response.data);
      });
  };

  return (
    <div className="message">
      <form>
        <textarea
          className="texte-msg"
          rows="5"
          cols="33"
          placeholder="Entrez votre message ici"
          onChange={getContent}
          value={content}
        />
        <p className="date">
          {clock}
          {" · "}
          {date}
        </p>
        {error && <p style={{ color: "red", fontSize: "12px" }}>{error.message} {error.detail}</p>}
        <button onClick={submissionHandler}>Post</button>
      </form>
    </div>
  );
}
