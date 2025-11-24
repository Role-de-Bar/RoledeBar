import { useState, useCallback, useMemo } from 'react';
import './CardEstabelecimentos.css';
import { useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

function CardEstabelecimentos({ 
  estabelecimentos, 
  usuario, 
  isFavoritosPage = false, 
  onAtualizarFavoritos 
}) {
  const navigate = useNavigate();
  const [favoritosLocais, setFavoritosLocais] = useState(() => {
    if (!usuario) return new Set();
    const favoritos = JSON.parse(localStorage.getItem("favoritos")) || {};
    return new Set(favoritos[usuario.id] || []);
  });

  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Mostra feedback temporário
  const showFeedback = useCallback((message, duration = 2500) => {
    setFeedbackMessage(message);
    setTimeout(() => setFeedbackMessage(null), duration);
  }, []);

  const getFavoritos = useCallback(() => {
    if (!usuario) return {};
    return JSON.parse(localStorage.getItem("favoritos")) || {};
  }, [usuario]);

  const isFavorito = useCallback((idEstabelecimento) => {
    return favoritosLocais.has(idEstabelecimento);
  }, [favoritosLocais]);

  const handleVerMais = useCallback((index) => {
    if (!usuario) {
      showFeedback("⚠️ Para visualizar informações completas, faça login ou cadastre-se!");
      return;
    }
    navigate(`/infosEstabelecimento/${index}`);
  }, [usuario, navigate, showFeedback]);

  const handleToggleFavorito = useCallback((idEstabelecimento, nomeEstabelecimento) => {
    if (!usuario) {
      showFeedback("⚠️ Para favoritar estabelecimentos, faça login ou cadastre-se!");
      return;
    }

    const favoritos = getFavoritos();
    const idUsuario = usuario.id;

    if (!favoritos[idUsuario]) {
      favoritos[idUsuario] = [];
    }

    const jaFavoritado = favoritos[idUsuario].includes(idEstabelecimento);

    if (jaFavoritado) {
      favoritos[idUsuario] = favoritos[idUsuario].filter(id => id !== idEstabelecimento);
      setFavoritosLocais(prev => {
        const novo = new Set(prev);
        novo.delete(idEstabelecimento);
        return novo;
      });
      
      const mensagem = isFavoritosPage 
        ? `💔 ${nomeEstabelecimento} removido dos favoritos`
        : `💔 ${nomeEstabelecimento} desfavoritado`;
      
      showFeedback(mensagem);

      if (isFavoritosPage && onAtualizarFavoritos) {
        onAtualizarFavoritos();
      }
    } else {
      favoritos[idUsuario].push(idEstabelecimento);
      setFavoritosLocais(prev => new Set(prev).add(idEstabelecimento));
      showFeedback(`💖 ${nomeEstabelecimento} adicionado aos favoritos!`);
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }, [usuario, getFavoritos, isFavoritosPage, onAtualizarFavoritos, showFeedback]);

  const formatarEndereco = useCallback((estab) => {
    const rua = estab.endereco?.rua || estab.rua || '';
    const numero = estab.endereco?.numero || estab.numero || '';
    const bairro = estab.endereco?.bairro || estab.bairro || '';
    
    const partes = [
      rua && numero ? `${rua}, ${numero}` : rua || numero,
      bairro
    ].filter(Boolean);

    return partes.join(' • ') || 'Endereço não informado';
  }, []);

  const mensagemVazia = useMemo(() => (
    <p className="mensagem-vazia">
      {isFavoritosPage 
        ? "Você ainda não favoritou nenhum estabelecimento." 
        : "Nenhum estabelecimento cadastrado no momento."}
    </p>
  ), [isFavoritosPage]);

  if (estabelecimentos.length === 0) {
    return <section className={`lista-estabelecimentos ${usuario ? 'logado' : ''}`}>{mensagemVazia}</section>;
  }

  return (
    <>
      {feedbackMessage && (
        <div className="feedback-toast">
          {feedbackMessage}
        </div>
      )}

      <section className={`lista-estabelecimentos ${usuario ? 'logado' : ''}`}>
        {estabelecimentos.map((estab, index) => {
          const idEstabelecimento = estab.id || index;
          const ehFavorito = isFavorito(idEstabelecimento);
          const imagemUrl = estab.foto || '/img/default-bar.jpg';
          const estiloMusical = estab.estiloMusical || estab.tipoMusica || 'Estilo variado';

          return (
            <article
              className="card-banner"
              key={idEstabelecimento}
              style={{ backgroundImage: `url(${imagemUrl})` }}
              aria-label={`${estab.nome} - ${formatarEndereco(estab)}`}
            >
              <button
                className={`favorite-btn ${ehFavorito ? 'is-favorite' : ''}`}
                title={ehFavorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavorito(idEstabelecimento, estab.nome);
                }}
                aria-pressed={ehFavorito}
                aria-label={ehFavorito ? "Desfavoritar" : "Favoritar"}
              >
                {ehFavorito ? (
                  <FavoriteIcon fontSize="small" sx={{ color: '#ff4757' }} />
                ) : (
                  <FavoriteBorderIcon fontSize="small" />
                )}
              </button>

              <div className="card-gradient" aria-hidden="true" />

              <div className="card-content">
                <div className="card-text">
                  <h2 className="card-title">{estab.nome}</h2>
                  <p className="card-sub">{formatarEndereco(estab)}</p>
                  <span className="card-tag">
                    <span>🎵</span>
                    <span>{estiloMusical}</span>
                  </span>
                </div>

                <div className="card-actions">
                  <button 
                    className="btn-pill" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVerMais(idEstabelecimento);
                    }}
                    aria-label={`Ver mais sobre ${estab.nome}`}
                  >
                    <VisibilityIcon fontSize="small" />
                    Ver Mais
                  </button>
                  
                  {!isFavoritosPage && (
                    <button 
                      className={`btn-pill ghost ${ehFavorito ? 'is-favorite' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorito(idEstabelecimento, estab.nome);
                      }}
                      aria-label={ehFavorito ? "Desfavoritar" : "Favoritar"}
                    >
                      {ehFavorito ? (
                        <>
                          <FavoriteIcon fontSize="small" />
                          Favoritado
                        </>
                      ) : (
                        <>
                          <FavoriteBorderIcon fontSize="small" />
                          Favoritar
                        </>
                      )}
                    </button>
                  )}
                  
                  {isFavoritosPage && (
                    <button 
                      className="btn-pill ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorito(idEstabelecimento, estab.nome);
                      }}
                      aria-label="Remover dos favoritos"
                    >
                      <DeleteIcon fontSize="small" />
                      Remover
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}

export default CardEstabelecimentos;