import React, { useState } from 'react';
import './Avaliacoes.css';
import { Heart, MessageCircle, User } from 'lucide-react';

const Avaliacoes = () => {
  const [avaliacoes, setAvaliacoes] = useState([
    {
      id: 1,
      usuario: 'Maria Silva',
      avatar: '👩',
      estrelas: 5,
      titulo: 'Experiência Incrível!',
      comentario: 'Lugar incrível! Atendimento excelente e ambiente muito agradável. Voltaria mil vezes.',
      tempo: '2 horas atrás',
      curtidas: 12,
      curtido: false
    },
    {
      id: 2,
      usuario: 'João Pedro',
      avatar: '👨',
      estrelas: 4,
      titulo: 'Recomendo Demais',
      comentario: 'Recomendo demais! A comida estava perfeita e o preço justo.',
      tempo: '5 horas atrás',
      curtidas: 8,
      curtido: false
    },
    {
      id: 3,
      usuario: 'Ana Costa',
      avatar: '👩‍🦰',
      estrelas: 5,
      titulo: 'Voltarei com Certeza',
      comentario: 'Voltarei com certeza! Adorei a experiência e o atendimento foi ótimo.',
      tempo: '1 dia atrás',
      curtidas: 15,
      curtido: false
    },
    {
      id: 4,
      usuario: 'Carlos Mendes',
      avatar: '👨‍🦱',
      estrelas: 5,
      titulo: 'Melhor da Região',
      comentario: 'Melhor lugar da região! Super indico para todos os amigos.',
      tempo: '2 dias atrás',
      curtidas: 20,
      curtido: false
    },
    {
      id: 5,
      usuario: 'Juliana Souza',
      avatar: '👱‍♀️',
      estrelas: 4,
      titulo: 'Ambiente Aconchegante',
      comentario: 'Atendimento impecável e ambiente aconchegante!',
      tempo: '3 dias atrás',
      curtidas: 6,
      curtido: false
    }
  ]);

  const [novaAvaliacao, setNovaAvaliacao] = useState({
    titulo: '',
    comentario: '',
    estrelas: 5
  });

  const handleCurtir = (id) => {
    setAvaliacoes(avaliacoes.map(av => 
      av.id === id ? {
        ...av,
        curtido: !av.curtido,
        curtidas: av.curtido ? av.curtidas - 1 : av.curtidas + 1
      } : av
    ));
  };

  const handleAdicionarAvaliacao = () => {
    if (novaAvaliacao.titulo.trim() && novaAvaliacao.comentario.trim()) {
      const novaAv = {
        id: Math.max(...avaliacoes.map(a => a.id), 0) + 1,
        usuario: 'Você',
        avatar: '😊',
        estrelas: novaAvaliacao.estrelas,
        titulo: novaAvaliacao.titulo,
        comentario: novaAvaliacao.comentario,
        tempo: 'Agora',
        curtidas: 0,
        curtido: false
      };
      setAvaliacoes([novaAv, ...avaliacoes]);
      setNovaAvaliacao({ titulo: '', comentario: '', estrelas: 5 });
    }
  };

  const mediaEstrelas = (avaliacoes.reduce((acc, av) => acc + av.estrelas, 0) / avaliacoes.length).toFixed(1);
  const totalAvaliacoes = avaliacoes.length;

  return (
    <div className="avaliacoes-container">
      {/* Cabeçalho com resumo */}
      <div className="avaliacoes-header">
        <div className="avaliacoes-resumo">
          <div className="media-estrelas">
            <span className="numero-media">{mediaEstrelas}</span>
            <div className="estrelas-display">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`estrela ${i < Math.round(mediaEstrelas) ? 'preenchida' : ''}`}>
                  ⭐
                </span>
              ))}
            </div>
            <span className="total-avaliacoes">({totalAvaliacoes} avaliações)</span>
          </div>
        </div>
      </div>

      {/* Formulário para adicionar avaliação */}
      <div className="novo-avaliacao-card">
        <h3>Deixe sua Avaliação</h3>
        
        <div className="formulario-avaliacao">
          <div className="seletor-estrelas">
            <label>Sua Avaliação:</label>
            <div className="estrelas-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`estrela-btn ${novaAvaliacao.estrelas >= star ? 'selecionada' : ''}`}
                  onClick={() => setNovaAvaliacao({...novaAvaliacao, estrelas: star})}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          <input
            type="text"
            placeholder="Título da avaliação..."
            value={novaAvaliacao.titulo}
            onChange={(e) => setNovaAvaliacao({...novaAvaliacao, titulo: e.target.value})}
            className="input-titulo-avaliacao"
            maxLength={60}
          />

          <textarea
            placeholder="Compartilhe sua experiência neste estabelecimento..."
            value={novaAvaliacao.comentario}
            onChange={(e) => setNovaAvaliacao({...novaAvaliacao, comentario: e.target.value})}
            className="textarea-avaliacao"
            maxLength={500}
            rows="4"
          />

          <div className="acao-avaliacao">
            <span className="contador-caracteres">
              {novaAvaliacao.comentario.length}/500
            </span>
            <button 
              className="btn-enviar-avaliacao"
              onClick={handleAdicionarAvaliacao}
              disabled={!novaAvaliacao.titulo.trim() || !novaAvaliacao.comentario.trim()}
            >
              Publicar Avaliação
            </button>
          </div>
        </div>
      </div>

      {/* Lista de avaliações */}
      <div className="lista-avaliacoes">
        {avaliacoes.length === 0 ? (
          <div className="sem-avaliacoes">
            <MessageCircle size={48} />
            <p>Nenhuma avaliação ainda. Seja o primeiro a avaliar!</p>
          </div>
        ) : (
          avaliacoes.map((avaliacao) => (
            <div key={avaliacao.id} className="avaliacao-card">
              <div className="avaliacao-header">
                <div className="usuario-info-av">
                  <span className="avatar-av">{avaliacao.avatar}</span>
                  <div className="detalhes-usuario-av">
                    <span className="nome-usuario-av">{avaliacao.usuario}</span>
                    <span className="tempo-av">{avaliacao.tempo}</span>
                  </div>
                </div>
                <div className="estrelas-av">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`estrela-av ${i < avaliacao.estrelas ? 'preenchida' : ''}`}>
                      ⭐
                    </span>
                  ))}
                </div>
              </div>

              <div className="conteudo-avaliacao">
                <h4 className="titulo-avaliacao">{avaliacao.titulo}</h4>
                <p className="texto-avaliacao">{avaliacao.comentario}</p>
              </div>

              <div className="acoes-avaliacao">
                <button 
                  className={`btn-curtida ${avaliacao.curtido ? 'curtida' : ''}`}
                  onClick={() => handleCurtir(avaliacao.id)}
                >
                  <Heart 
                    size={18} 
                    fill={avaliacao.curtido ? 'currentColor' : 'none'} 
                  />
                  <span>{avaliacao.curtidas}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Avaliacoes;
