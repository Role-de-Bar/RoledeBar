// Favoritos.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Heart, ArrowLeft, Search } from "lucide-react";
import "./Favoritos.css";

function CardEstabelecimento({ favorito, onRemover }) {
  const { estabelecimento } = favorito;

  const formatarEndereco = (endereco) => {
    if (typeof endereco === "string") return endereco;

    if (typeof endereco === "object" && endereco !== null) {
      const { rua, numero, bairro, cidade, estado } = endereco;
      const linha1 = [rua, numero].filter(Boolean).join(", ");
      const linha2 = [bairro, cidade, estado].filter(Boolean).join(", ");
      return [linha1, linha2].filter(Boolean).join(" - ");
    }

    return "Endereço não disponível";
  };

  return (
    <div className="card-estabelecimento">
      <div className="card-image">
        <img
          src={`http://localhost:8081/uploads/${estabelecimento.foto}`}
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
        <p className="card-address">
          {formatarEndereco(estabelecimento.endereco)}
        </p>
      </div>
    </div>
  );
}

function Favoritos({ setIsLogged, usuarioLogado }) {
  const usuario = usuarioLogado;
  const navigate = useNavigate();

  // Agora salva: { favorito_id, estabelecimento }
  const [favoritos, setFavoritos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const carregarFavoritos = async () => {
    try {
      const res = await fetch(`http://localhost:8081/favoritos/${usuario.id}`, {
        cache: "no-store",
      });

      const dados = await res.json();

      // Agora salva tudo: favorito + estabelecimento
      const lista = dados.map((fav) => ({
        favorito_id: fav.id,
        estabelecimento: fav.estabelecimento,
      }));

      setFavoritos(lista);
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    }
  };

  useEffect(() => {
    if (!usuario) {
      setIsLogged(false);
      localStorage.setItem("isLogged", "false");
      navigate("/");
    } else {
      setIsLogged(true);
      localStorage.setItem("isLogged", "true");
      carregarFavoritos();
    }
  }, [usuario]);

  const voltar = () => {
    navigate("/estabelecimentos");
  };

  const removerFavorito = async (fav) => {
    try {
      await fetch("http://localhost:8081/favoritos/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          favorito_id: fav.favorito_id,                   // CORRETO!
          consumidor_id: usuario.id,
          estabelecimento_id: fav.estabelecimento.id,
        }),
      });

      carregarFavoritos();
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
    }
  };

  const favoritosFiltrados = favoritos.filter((fav) => {
    const est = fav.estabelecimento;
    const searchLower = searchTerm.toLowerCase();

    const nomeMatch = est.nome?.toLowerCase().includes(searchLower);

    let enderecoMatch = false;

    if (typeof est.endereco === "string") {
      enderecoMatch = est.endereco.toLowerCase().includes(searchLower);
    } else if (typeof est.endereco === "object" && est.endereco !== null) {
      enderecoMatch = JSON.stringify(est.endereco)
        .toLowerCase()
        .includes(searchLower);
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
                <Heart size={28} fill="currentColor" /> Favoritos
              </h1>
              {favoritos.length > 0 && (
                <span className="favoritos-count">{favoritos.length}</span>
              )}
            </div>
          </div>

          {favoritos.length > 0 && (
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
                <button
                  className="btn-explorar"
                  onClick={() => navigate("/estabelecimentos")}
                >
                  Explorar Bares
                </button>
              )}
            </div>
          ) : (
            <div className="grid-favoritos">
              {favoritosFiltrados.map((fav) => (
                <CardEstabelecimento
                  key={fav.favorito_id}
                  favorito={fav}
                  onRemover={() => removerFavorito(fav)}
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
