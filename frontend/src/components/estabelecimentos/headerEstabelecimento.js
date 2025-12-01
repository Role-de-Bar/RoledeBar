import {
  Menu,
  User,
  Heart,
  SquarePlus,
  LogOut,
  Search,
  Grip,
  LayoutGrid,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./headerEstabelecimento.css";

function HeaderEstabelecimento({ onToggleFiltros, onBuscarNome }) {
  const [menuMobileOpen, setMenuMobileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [textoBusca, setTextoBusca] = useState("");

  const navigate = useNavigate();

  // Função helper para atualizar estados do usuário
  const atualizarUsuario = () => {
    const userData = localStorage.getItem("usuarioLogado");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUsuarioLogado(parsed);
        const tipo = parsed.tipoUsuario;
        const tipoCapitalizado = tipo
          ? tipo.charAt(0).toUpperCase() + tipo.slice(1)
          : "Consumidor";
        setTipoUsuario(tipoCapitalizado);
        console.log("Usuário atualizado:", parsed, "Tipo:", tipoCapitalizado);
      } catch (e) {
        console.error("Erro ao parsear usuário do localStorage:", e);
        setUsuarioLogado(null);
        setTipoUsuario(null);
      }
    } else {
      setUsuarioLogado(null);
      setTipoUsuario(null);
    }
  };

  // useEffect para inicializar ao montar
  useEffect(() => {
    atualizarUsuario();
  }, []);

  // Função para verificar se token expirou
  const verificarTokenExpirado = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      // Decoda o token (sem validar a assinatura, só para ler o payload)
      const partes = token.split(".");
      if (partes.length !== 3) return false;

      const payload = JSON.parse(atob(partes[1]));
      const agora = Math.floor(Date.now() / 1000);

      // Se exp existe e é menor que agora, token expirou
      if (payload.exp && payload.exp < agora) {
        console.log("Token expirou. Deslogando...");
        return true;
      }
      return false;
    } catch (e) {
      console.error("Erro ao verificar token:", e);
      return false;
    }
  };

  // Função para fazer logout forçado
  const fazerLogoutForçado = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioLogado");
    localStorage.setItem("isLogged", "false");
    setUsuarioLogado(null);
    setTipoUsuario(null);
    setMenuMobileOpen(false);
    console.log("Usuário deslogado automaticamente (token expirou)");
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setTextoBusca(value);

    // envia para o componente pai
    onBuscarNome(value);
  };

  // useEffect para monitorar mudanças no localStorage
  useEffect(() => {
    const handleStorageChange = (event) => {
      // Se a chave 'usuarioLogado' foi alterada, atualizar
      if (event.key === "usuarioLogado" || event.key === null) {
        atualizarUsuario();
      }
    };

    // Event listener para mudanças em outras abas/janelas
    window.addEventListener("storage", handleStorageChange);

    // Event listener customizado para mudanças na mesma aba
    const handleCustomStorageChange = () => {
      atualizarUsuario();
    };
    window.addEventListener(
      "usuarioLogadoAtualizado",
      handleCustomStorageChange
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "usuarioLogadoAtualizado",
        handleCustomStorageChange
      );
    };
  }, []);

  // useEffect para verificar expiração de token periodicamente
  useEffect(() => {
    // Verificar token expirado ao montar
    if (verificarTokenExpirado()) {
      fazerLogoutForçado();
    }

    // Verificar a cada 1 minuto (60000ms) se o token ainda é válido
    const intervalo = setInterval(() => {
      if (verificarTokenExpirado()) {
        fazerLogoutForçado();
        clearInterval(intervalo);
      }
    }, 60000); // 1 minuto

    return () => clearInterval(intervalo);
  }, []);

  const goToFavoritos = () => navigate("/favoritos");

  const submitLogin = () => {
    goToLoginOrPerfil();
  };

  const returnHome = () => {
    localStorage.clear();
    sessionStorage.clear();
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioLogado");
    localStorage.setItem("isLogged", "false");
    setUsuarioLogado(null);
    setTipoUsuario(null);
    setIsModalOpen(false);
    navigate("/");
  };

  const goEstabelecimentos = () => {
    navigate("/cadastroEstabelecimento");
  };

  const goToLoginOrPerfil = () => {
    if (usuarioLogado) {
      navigate("/perfil");
    } else {
      navigate("/login");
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
          <input
            type="text"
            placeholder="Pesquisar Bar"
            value={textoBusca}
            onChange={handleSearchChange}
          />
          <button className="icon-btn">
            <Search size={20} />
          </button>
        </div>

        {/* Desktop icons */}
        <div className="right desktop-icons">
          <button className="icon-btn" onClick={submitLogin}>
            <User size={24} />
            {usuarioLogado && (
              <span className="user-name">{usuarioLogado.nome}</span>
            )}
          </button>

          {usuarioLogado && (
            <button className="icon-btn" onClick={goToFavoritos}>
              <Heart size={24} />
            </button>
          )}

          {usuarioLogado && tipoUsuario === "Proprietario" && (
            <button className="icon-btn" onClick={() => goEstabelecimentos()}>
              <SquarePlus size={24} />
            </button>
          )}

          {usuarioLogado ? (
            <button className="icon-btn" onClick={returnHome}>
              <LogOut size={24} />
            </button>
          ) : (
            <button className="icon-btn" onClick={() => navigate("/")}>
              <LogOut size={24} />
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
            <span>{usuarioLogado ? usuarioLogado.nome : "Login"}</span>
          </button>

          {usuarioLogado && tipoUsuario === "Consumidor" && (
            <button className="icon-btn" onClick={goToFavoritos}>
              <Heart size={24} />
              <span>Favoritos</span>
            </button>
          )}

          <button className="icon-btn" onClick={returnHome}>
            <LogOut size={24} />
            <span>{usuarioLogado ? "Sair" : "Voltar"}</span>
          </button>

          {usuarioLogado && tipoUsuario === "Proprietario" && (
            <button className="icon-btn" onClick={() => goEstabelecimentos()}>
              <SquarePlus size={24} />
              <span>Meus Estabelecimentos</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default HeaderEstabelecimento;
