export default function ListeProfils(props) {
  return (
    <div>
      {props.profils && props.profils.map((profil, index) => (
        <div>
          <a href="a" onClick={(evt) => {
            evt.preventDefault();
            props.setCurrentPage(profil.login);
          }}>
            {profil.login}
          </a>
          {profil.nom && <p>{profil.nom}</p>}
        </div>
      ))}
    </div>
  );
}
