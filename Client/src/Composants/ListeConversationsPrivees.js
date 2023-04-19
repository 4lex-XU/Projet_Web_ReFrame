import { useState } from "react";
import ConversationPrivee from "./ConversationPrivee";

export default function ListeConversationPrivee(props) {
  //classé par les plus récents
  const [isInConversation, setIsInConversation] = useState(true);

  const goToConversation = (evt) => {
    setIsInConversation(true);
  };

  return (
    <div className="listeConversation">
      <p>Messages Privés :</p>
      {isInConversation ? (
        <ConversationPrivee
          listMessages={props.listConversation.listMessages}
        />
      ) : (
        props.listConversation.map((conversation) => (
          <div>
            <button type="button" onClick={goToConversation}>
              {conversation.user}
            </button>
          </div>
        ))
      )}
    </div>
  );
}
