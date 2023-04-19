export default function Logout(props) {
  const handle = () => props.setLogout();

  return (
    <button className="Logout" onClick={handle}>
      Logout
    </button>
  );
}
