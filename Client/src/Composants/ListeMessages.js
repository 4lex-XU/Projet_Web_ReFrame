import Message from "./Message";

export default function ListeMessages(props) {
  const messages = props.messages;
  return (
    <div className="listeMsg">
      {messages.map((message, index) => (
        <Message
          key={index}
          login={message.login}
          content={message.content}
          date={message.date}
          clock={message.clock}
          setCurrentPage={props.setCurrentPage}
        />
      ))}
    </div>
  );
}
