import { Menu, User, Heart, LogOut, Search, Grip,LayoutGrid  } from "lucide-react";
import { useState, useEffect } from "react";
import "./headerEstabelecimento.css";

function HeaderEstabelecimento({ onToggleFiltros }) {
  const [menuMobileOpen, setMenuMobileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    // Recupera dados do usuário do localStorage
    const userData = localStorage.getItem('usuarioLogado');
    if (userData) {
      setUsuarioLogado(JSON.parse(userData));
    }
  }, []);

  const goToFavoritos = () => window.location.href = "/favoritos";
  
  const submitLogin = () => {
    goToLoginOrPerfil();
  };

  const returnHome = () => {
    // Limpa dados do login
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioLogado');
    setUsuarioLogado(null);
    setIsModalOpen(false);
    window.location.href = "/";
  };

  const goEstabelecimentos = () => {
    window.location.href = "/cadastroEstabelecimento";
  };

  const goToLoginOrPerfil = () => {
    if (usuarioLogado) {
      window.location.href = "/perfil";
    } else {
      window.location.href = "/login";
    }
  };

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
          <button className="icon-btn" onClick={submitLogin}>
            <User size={24} />
            {usuarioLogado && <span className="user-name">{usuarioLogado.nome}</span>}
          </button>
    
          {usuarioLogado && (
            <button className="icon-btn" onClick={goToFavoritos}>
              <Heart size={24} />
            </button>
          )}
          
          {usuarioLogado ? (
            <button className="icon-btn" onClick={returnHome}>
              <LogOut size={24} />
            </button>
          ) : (
            <button className="icon-btn" onClick={() => window.location.href = "/"}>
              <LogOut size={24} />
            </button>
          )}
            {usuarioLogado &&(
                <button className="icon-btn" onClick={() =>goEstabelecimentos()}>
                      <LayoutGrid size={24} />
                </button>
            )}
        </div>

        {/* Mobile menu */}
        <div className="right mobile-menu-btn">
          <button
            className="icon-btn"
            onClick={() => setMenuMobileOpen(!menuMobileOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {menuMobileOpen && (
        <div className="mobile-menu-dropdown">
          <button className="icon-btn" onClick={submitLogin}>
            <User size={24} />
            <span>{usuarioLogado ? usuarioLogado.nome : 'Login'}</span>
          </button>
          
          {usuarioLogado && (
            <button className="icon-btn" onClick={goToFavoritos}>
              <Heart size={24} />
              <span>Favoritos</span>
            </button>
          )}
          
          <button className="icon-btn" onClick={returnHome}>
            <LogOut size={24} />
            <span>{usuarioLogado ? 'Sair' : 'Voltar'}</span>
          </button>
            {usuarioLogado &&(
                <button className="icon-btn" onClick={() =>goEstabelecimentos()}>
                      <LayoutGrid size={24} />
                      <span>Estabelecimentos</span>
                </button>
            )}
        </div>
      )}
    </div>
  );
}

export default HeaderEstabelecimento;