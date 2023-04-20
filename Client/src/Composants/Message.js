export default function Message(props) {
  const pageProfilHandler = (evt) => {
    evt.preventDefault();
    props.setCurrentPage(props.login);
  };
  return (
    <article className="message">
      <div>
        <a className="user" href="a" onClick={pageProfilHandler}>
          {props.login}
        </a>
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
