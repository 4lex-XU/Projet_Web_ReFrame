import Message from './Message';

export default function ListeMessages(props) {
  const messages = props.messages;
  return (
    <div className="listeMsg">
      {messages &&
        messages.map((message) => (
          <Message
            id={message._id}
            login={message.login}
            content={message.content}
            date={message.date}
            clock={message.clock}
            setCurrentPage={props.setCurrentPage}
            messages={props.messages}
            setMessages={props.setMessages}
            rechargerMessages={props.rechargerMessages}
            setRechargerMessages={props.setRechargerMessages}
            myLogin={props.myLogin}
          />
        ))}
    </div>
  );
}
