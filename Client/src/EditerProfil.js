import { useState } from "react";

export default function EditerProfil(props) {
  const [Nom, setNom] = useState("");
  const [Description, setDescription] = useState("");
  const [Naissance, setNaissance] = useState("");

  const handleNom = (evt) => setNom(evt.target.value);
  const handleBibliographie = (evt) => setDescription(evt.target.value);
  const handleNaissance = (evt) => setNaissance(evt.target.value);

  return (
    <div className="edition">
      <div>
        <label htmlFor="nom">Nom</label>
        <input id="nom" type="text" onChange={handleNom} />
      </div>
      <div>
        <label htmlFor="bibliographie">Bibliographie</label>
        <textarea
          className="bibliographie"
          rows="5"
          cols="33"
          onChange={handleBibliographie}
          defaultValue={Description}
        />
      </div>
      <div>
        <label htmlFor="naissance">Date de Naissance</label>
        <input id="nassance" type="text" onChange={handleNaissance} />
      </div>
    </div>
  );
}
