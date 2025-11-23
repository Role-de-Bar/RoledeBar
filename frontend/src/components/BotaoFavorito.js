import React, { useState, useEffect } from 'react';
import './BotaoFavorito.css';

const BotaoFavorito = ({ estabelecimentoId, usuarioLogado }) => {
    const [isFavorito, setIsFavorito] = useState(false);
    const [loading, setLoading] = useState(false);

    // Verifica se já está favoritado ao carregar
    useEffect(() => {
        if (usuarioLogado) {
            verificarFavorito();
        }
    }, [estabelecimentoId, usuarioLogado]);

    const verificarFavorito = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/favoritos/check/${estabelecimentoId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setIsFavorito(data.isFavorito);
        } catch (error) {
            console.error('Erro ao verificar favorito:', error);
        }
    };

    const toggleFavorito = async () => {
        if (!usuarioLogado) {
            alert('Você precisa estar logado para favoritar!');
            return;
        }

        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            if (isFavorito) {
                // Remover dos favoritos
                const response = await fetch(`http://localhost:3000/favoritos/${estabelecimentoId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    setIsFavorito(false);
                    alert('Removido dos favoritos!');
                }
            } else {
                // Adicionar aos favoritos
                const response = await fetch(`http://localhost:3000/favoritos/${estabelecimentoId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    setIsFavorito(true);
                    alert('Adicionado aos favoritos!');
                }
            }
        } catch (error) {
            console.error('Erro ao favoritar:', error);
            alert('Erro ao favoritar estabelecimento');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className={`botao-favorito ${isFavorito ? 'favoritado' : ''}`}
            onClick={toggleFavorito}
            disabled={loading}
        >
            {loading ? '...' : isFavorito ? '❤️ Favoritado' : '🤍 Favoritar'}
        </button>
    );
};

export default BotaoFavorito;