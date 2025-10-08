import { Menu, User, Heart, LogOut, Search,  Grip } from "lucide-react";
import { useState } from "react";
import "./headerEstabelecimento.css";

function HeaderEstabelecimento({ onToggleFiltros }) {
  const [menuMobileOpen, setMenuMobileOpen] = useState(false);
  const returnHome = () => {
    window.location.href = "/";
  }

  const submitLogin = () =>{
    window.location.href = "/login"
  }
  return (
    <div className="headerEstabelecimento">
      <header className="headerEsta">
        <div className="left">
          <button className="icon-btn" onClick={onToggleFiltros}>
            <Grip size={24} />
          </button>
          <h1 className="logo">Role de Bar</h1>
        </div>

        <div className="search-bar">
          <input type="text" placeholder="Pesquisar Bar" />
          <button className="icon-btn">
            <Search size={20} />
          </button>
        </div>

        {/* Desktop icons */}
        <div className="right desktop-icons">
          <button className="icon-btn" onClick={() => submitLogin()}>
            <User size={24} />
          </button>
          <button className="icon-btn">
            <Heart size={24} />
          </button>
          <button className="icon-btn" onClick={() => returnHome()}>
            <LogOut size={24} />
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="right mobile-menu-btn">
          <button className="icon-btn" onClick={() => setMenuMobileOpen(!menuMobileOpen)}>
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {menuMobileOpen && (
        <div className="mobile-menu-dropdown">
          <button className="icon-btn" onClick={() => submitLogin()}>
            <User size={24} /> <span>Login</span>
          </button>
          <button className="icon-btn">
            <Heart size={24} /> <span>Favoritos</span>
          </button>
          <button className="icon-btn" onClick={() => returnHome()}>
            <LogOut size={24} /> <span>Sair</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default HeaderEstabelecimento;
