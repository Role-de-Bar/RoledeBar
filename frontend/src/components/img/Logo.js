import { Link,useLocation } from "react-router-dom";
import logo from "../../assets/img/logo-role-de-bar.png";
import Nlogo from  "../../assets/img/Newlogo.png"


function Logo() {
  const location = useLocation();
  const isEstabelecimentosPage = location.pathname === "/estabelecimentos";

  return (
    <div className="divLogo">
      {isEstabelecimentosPage ? (
        <img src={Nlogo} alt="Rolê de bar" className="logoApp" />
      ) : (
        <Link to="/">
          <img src={Nlogo} alt="Rolê de bar" className="logoApp" />
        </Link>
      )}
    </div>
  );
}


export default Logo;
