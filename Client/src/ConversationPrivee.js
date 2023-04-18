import Message from "./Message";

export default function ConversationPrivee(props) {
  //on suppose la liste de messages est classée par ordre chronologique

  return (
    <div className="conversation">
      {props.listMessages.map((message) =>
        message.from === "mine" ? (
          <div className="myMessage">
            <Message
              content={message.content}
              date={message.date}
              user={message.user}
              clock={message.clock}
            />
          </div>
        ) : (
          <div className="yourMessage">
            <Message
              content={message.content}
              date={message.date}
              user={message.user}
              clock={message.clock}
            />
          </div>
        )
      )}
    </div>
  );
}
