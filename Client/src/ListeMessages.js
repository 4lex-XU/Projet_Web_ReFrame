import Message from "./Message";

export default function ListeMessages(props) {
  const messages = props.messages;

  return (
    <div className="listeMsg">
      {messages.map((message, index) => (
        <Message
          key={index}
          user={message.user}
          content={message.content}
          date={message.date}
          clock={message.clock}
        />
      ))}
    </div>
  );
}
