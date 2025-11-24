// Favoritos.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Heart, ArrowLeft, Search } from "lucide-react";
import './Favoritos.css';

// Componente Card para exibir cada estabelecimento
function CardEstabelecimento({ estabelecimento, onRemover }) {
  // Função para formatar o endereço
  const formatarEndereco = (endereco) => {
    if (typeof endereco === 'string') {
      return endereco;
    }
    
    if (typeof endereco === 'object' && endereco !== null) {
      const { rua, numero, bairro, cidade, estado } = endereco;
      const partes = [];
      
      if (rua) partes.push(rua);
      if (numero) partes.push(numero);
      
      const linha1 = partes.join(', ');
      const linha2 = [bairro, cidade, estado].filter(Boolean).join(', ');
      
      return [linha1, linha2].filter(Boolean).join(' - ');
    }
    
    return 'Endereço não disponível';
  };

  return (
    <div className="card-estabelecimento">
      <div className="card-image">
        <img 
          src={estabelecimento.imagem || estabelecimento.foto || "https://via.placeholder.com/300x200"} 
          alt={estabelecimento.nome} 
        />
        <button 
          className="btn-favorite" 
          onClick={(e) => {
            e.stopPropagation();
            onRemover();
          }}
          title="Remover dos favoritos"
        >
          <Heart size={20} fill="currentColor" />
        </button>
      </div>
      <div className="card-contentf">
        <h3>{estabelecimento.nome}</h3>
        <p className="card-address">{formatarEndereco(estabelecimento.endereco)}</p>
      </div>
    </div>
  );
}

function Favoritos({ setIsLogged, usuarioLogado }) {
  const usuario = usuarioLogado;
  const navigate = useNavigate();
  const [estabelecimentosFavoritos, setEstabelecimentosFavoritos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  function carregarFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || {};
    const favoritosDoUsuario = favoritos[usuario?.id] || [];
    const estabelecimentos = JSON.parse(localStorage.getItem("estabelecimentos")) || [];

    const filtrados = favoritosDoUsuario
      .map(id => estabelecimentos.find(est => est.id === id))
      .filter(Boolean);
    
    setEstabelecimentosFavoritos(filtrados);
  }

  useEffect(() => {
    if (!usuario) {
      setIsLogged(false);
      localStorage.setItem("isLogged", "false");
      navigate('/');
    } else {
      setIsLogged(true);
      localStorage.setItem("isLogged", "true");
      carregarFavoritos();
    }
  }, [usuario, navigate, setIsLogged]);

  const voltar = () => {
    navigate("/estabelecimentos");
  };

  const removerFavorito = (estabelecimentoParaRemover) => {
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || {};
    const favoritosDoUsuario = favoritos[usuario?.id] || [];
    const estabelecimentos = JSON.parse(localStorage.getItem("estabelecimentos")) || [];

    // Encontrar o índice original do estabelecimento
    const indiceOriginal = estabelecimentos.findIndex(
      est => JSON.stringify(est) === JSON.stringify(estabelecimentoParaRemover)
    );

    if (indiceOriginal !== -1) {
      // Remover o índice da lista de favoritos
      const novosFavoritos = favoritosDoUsuario.filter(idx => idx !== indiceOriginal);
      favoritos[usuario.id] = novosFavoritos;
      localStorage.setItem("favoritos", JSON.stringify(favoritos));
    }

    // Recarregar favoritos
    carregarFavoritos();
  };

  // Filtrar favoritos baseado na busca
  const favoritosFiltrados = estabelecimentosFavoritos.filter(est => {
    if (!est) return false;
    
    const searchLower = searchTerm.toLowerCase();
    const nomeMatch = est.nome?.toLowerCase().includes(searchLower);
    
    // Busca no endereço (objeto ou string)
    let enderecoMatch = false;
    if (typeof est.endereco === 'string') {
      enderecoMatch = est.endereco.toLowerCase().includes(searchLower);
    } else if (typeof est.endereco === 'object' && est.endereco !== null) {
      const enderecoStr = JSON.stringify(est.endereco).toLowerCase();
      enderecoMatch = enderecoStr.includes(searchLower);
    }
    
    return nomeMatch || enderecoMatch;
  });

  return (
    <div className="favoritos-container">
      <div className="favoritos-wrapper">
        <header className="header-favoritos">
          <div className="header-top">
            <button className="btn-voltar" onClick={voltar}>
              <ArrowLeft size={20} />
              <span>Voltar</span>
            </button>
            <div className="header-title">
              <h1>
                <Heart size={28} fill="currentColor" />
                Favoritos
              </h1>
              {estabelecimentosFavoritos.length > 0 && (
                <span className="favoritos-count">
                  {estabelecimentosFavoritos.length}
                </span>
              )}
            </div>
          </div>
          
          {estabelecimentosFavoritos.length > 0 && (
            <div className="search-container">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                className="search-input"
                placeholder="Buscar nos favoritos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
        </header>

        <main className="content-favoritos">
          {favoritosFiltrados.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💔</div>
              <h2>
                {searchTerm
                  ? "Nenhum favorito encontrado"
                  : "Nenhum favorito ainda"}
              </h2>
              <p>
                {searchTerm
                  ? "Tente buscar com outros termos"
                  : "Comece a adicionar seus bares favoritos!"}
              </p>
              {!searchTerm && (
                <button className="btn-explorar" onClick={() => navigate("/estabelecimentos")}>
                  Explorar Bares
                </button>
              )}
            </div>
          ) : (
            <div className="grid-favoritos">
              {favoritosFiltrados.map((est, index) => (
                <CardEstabelecimento 
                  key={est.id || index} 
                  estabelecimento={est}
                  onRemover={() => removerFavorito(est)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Favoritos;