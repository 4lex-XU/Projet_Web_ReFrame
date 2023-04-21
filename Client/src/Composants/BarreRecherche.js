import axios from "axios";
import React, { useState } from "react";

export default function BarreRecherche(props) {
  const [recherche, setRecherche] = useState("");
  const [resultats, setResultats] = useState([]);
  const [erreur, setErreur] = useState(null);

  function handleInputChange(evt) {
    setRecherche(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    const data = {
      filter: recherche
    }
    axios.get(`/recherche`, recherche, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
      credentials: 'include'
    })
      .then((res) => {
        console.log(res.data);
        setResultats(res.data);
        
      })
      .catch((err) => {
        console.log(err.response.data);
        setErreur(err.response.data);
      });
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
        {erreur && <p style={{ color: "red", fontSize: "12px" }}>{erreur.message}</p>}
      </div>
    </form>
  );
}
