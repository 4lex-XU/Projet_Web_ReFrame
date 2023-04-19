import React, { useState } from "react";

export default function BarreRecherche(props) {
  const [recherche, setRecherche] = useState("");

  function handleInputChange(evt) {
    setRecherche(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    //props.onSearch(recherche);
  }

  return (
    <form className="barreRecherche" onSubmit={handleSubmit}>
      <div>
        <input
          type="text"
          placeholder="Rechercher sur ReFrame"
          value={recherche}
          onChange={handleInputChange}
        />
        <button type="submit">Rechercher</button>
      </div>
    </form>
  );
}
