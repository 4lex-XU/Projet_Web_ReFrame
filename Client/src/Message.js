import "./CSS/message.css";

export default function Message(props) {
  const content = props.content;
  const date = props.date;
  const user = props.user;
  const clock = props.clock;

  return (
    <article className="message">
      <div>
        <a className="user" href="profil_user">
          {user}
        </a>{" "}
        <button type="button">+</button>
      </div>
      <div className="content">
        <textarea
          className="texte-msg"
          rows="5"
          cols="33"
          readOnly="readonly"
          value={content}
        />
      </div>
      <p className="date">
        {clock}
        {" · "}
        {date}
      </p>
    </article>
  );
}
