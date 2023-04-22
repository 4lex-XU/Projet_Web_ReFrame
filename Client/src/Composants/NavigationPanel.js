import Login from "./Login";
import Signin from "./Signin";
import HomePage from "./HomePage";
import PageProfil from "./PageProfil";
import EditerProfil from "./EditerProfil";

export default function NavigationPanel(props) {
  return (
    <nav>
      {props.currentPage === "signin_page" ? (
        <Signin setCurrentPage={props.setCurrentPage} />
      ) : props.isConnected ? (
        props.currentPage === "home_page" ? (
          <HomePage
            myLogin={props.myLogin}
            logout={props.logout}
            setCurrentPage={props.setCurrentPage}
          />
        ) : ( 
          props.currentPage === "edit_page" ? (
            <EditerProfil
              myLogin={props.myLogin}
              logout={props.logout}
              setCurrentPage={props.setCurrentPage}
            />
          ) : (
          <PageProfil
            myLogin={props.myLogin}
            userProfil={props.currentPage}
            logout={props.logout}
            setCurrentPage={props.setCurrentPage}
          />
        ))
      ) : (
        <Login
          setMyLogin={props.setMyLogin}
          getConnected={props.login}
          setCurrentPage={props.setCurrentPage}
        />
      )}
    </nav>
  );
}
