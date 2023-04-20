import axios from "axios";

export default function Logout(props) {
  const handle = () => {
    axios.post("/user/logout",{} ,{
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
      credentials: 'include'
    })
      .then((res) => {
        console.log(res.data);
        props.setLogout();
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  return (
    <button className="Logout" onClick={handle}>
      Logout
    </button>
  );
}
