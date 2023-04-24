export default function ListeProfils(props) {
  return (
    <div>
      {props.profils &&
        props.profils.map((profil, index) => (
          <div key={index}>
            <a
              href="a"
              onClick={(evt) => {
                evt.preventDefault();
                props.setCurrentPage(profil.login || profil);
              }}
            >
              {profil.login || profil}
            </a>
          </div>
        ))}
    </div>
  );
}
