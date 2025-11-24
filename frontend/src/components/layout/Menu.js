import { useState } from "react";
import { HashLink } from "react-router-hash-link";
import { Home, Info, Phone, LogIn, Menu as MenuIcon, X } from "lucide-react";
import Logo from "../img/Logo";
import "./Header.css";

function Menu() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="navBar">
            <div className="divLogo">
                <Logo className="logoApp" />
            </div>
                                                                            
            <button
                className="hamburgerBtn"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Abrir menu"
            >
                {menuOpen ? <X size={28} /> : <MenuIcon size={28} />}
            </button>

            <ul className={`listaHeader ${menuOpen ? "open" : ""}`}>
                <li>
                    <HashLink smooth to="#servicos" onClick={() => setMenuOpen(false)}>
                        <Home className="icon" size={20} /> Serviços
                    </HashLink>
                </li>
                <li>
                    <HashLink smooth to="#sobre" onClick={() => setMenuOpen(false)}>
                        <Info className="icon" size={20} /> Sobre nós
                    </HashLink>
                </li>
                <li>
                    <HashLink smooth to="#contato" onClick={() => setMenuOpen(false)}>
                        <Phone className="icon" size={20} /> Contato
                    </HashLink>
                </li>
                <li>
                    <HashLink to="/login" className="linkLogin" onClick={() => setMenuOpen(false)}>
                        <LogIn className="icon" size={20} /> Log-in
                    </HashLink>
                </li>
            </ul>
        </nav>
    );
}

export default Menu;