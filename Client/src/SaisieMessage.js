import { useState } from "react";
import "./CSS/message.css";

export default function SaisieMessage(props) {
  const [content, setContent] = useState("");
  const currentDate = new Date();
  const date = currentDate.toLocaleDateString("fr");
  const clock = currentDate.getHours() + ":" + currentDate.getMinutes();
  const getContent = (evt) => setContent(evt.target.value);

  return (
    <div className="message">
      <form>
        <textarea
          className="texte-msg"
          rows="5"
          cols="33"
          placeholder="Entrez votre message ici"
          onChange={getContent}
          defaultValue={content}
        />
        <p className="date">
          {clock}
          {" · "}
          {date}
        </p>
        <button type="submit">Post</button>
      </form>
    </div>
  );
}
