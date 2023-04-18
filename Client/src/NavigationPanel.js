import Login from "./Login";
import Signin from "./Signin";
import HomePage from "./HomePage";
import PageProfil from "./PageProfil";

export default function NavigationPanel(props) {
  return (
    <nav>
      {props.currentPage === "signin_page" ? (
        <Signin setCurrentPage={props.setCurrentPage} />
      ) : props.isConnected ? (
        props.currentPage === "home_page" ? (
          <HomePage
            logout={props.logout}
            setCurrentPage={props.setCurrentPage}
            messages={props.messages}
          />
        ) : (
          <PageProfil
            logout={props.logout}
            setCurrentPage={props.setCurrentPage}
          />
        )
      ) : (
        <Login
          getConnected={props.login}
          setCurrentPage={props.setCurrentPage}
        />
      )}
    </nav>
  );
}
