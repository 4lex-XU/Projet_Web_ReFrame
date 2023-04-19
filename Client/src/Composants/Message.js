export default function Message(props) {

  return (
    <article className="message">
      <div>
        <a className="user" href="profil_user">
          {props.login}
        </a>{" "}
        <button type="button">+</button>
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
        {" · "}
        {props.date}
      </p>
    </article>
  );
}
