import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Favoritos.css';

const Favoritos = ({ usuarioLogado }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarFavoritos();
  }, []);

  // Carrega os favoritos do usuário via API
  const carregarFavoritos = async () => {
    if (!usuarioLogado) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/favoritos', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erro ao carregar favoritos');

      const data = await response.json();
      setFavoritos(data);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      alert('Erro ao carregar favoritos');
    } finally {
      setLoading(false);
    }
  };

  // Remove um favorito
  const removerFavorito = async (estabelecimentoId) => {
    if (!window.confirm('Deseja remover este estabelecimento dos favoritos?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/favoritos/${estabelecimentoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Erro ao remover favorito');

      // Atualiza a lista localmente
      setFavoritos(favoritos.filter(f => f.estabelecimentoId !== estabelecimentoId));
      alert('Removido dos favoritos!');
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      alert('Erro ao remover favorito');
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="favoritos-container">
      <h1>❤️ Meus Favoritos</h1>

      {favoritos.length === 0 ? (
        <div className="vazio">
          <p>Você ainda não tem favoritos</p>
          <Link to="/estabelecimentos">Ver Estabelecimentos</Link>
        </div>
      ) : (
        <div className="lista-favoritos">
          {favoritos.map((favorito) => (
            <div key={favorito.id} className="card-favorito">
              <h3>{favorito.estabelecimento.nome}</h3>
              <p>📍 {favorito.estabelecimento.endereco}</p>
              <p>🏷️ {favorito.estabelecimento.tipo}</p>

              <div className="acoes">
                <Link to={`/infosEstabelecimento/${favorito.estabelecimento.id}`}>
                  Ver Detalhes
                </Link>
                <button onClick={() => removerFavorito(favorito.estabelecimentoId)}>
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favoritos;
