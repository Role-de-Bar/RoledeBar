const ChatComentarios = () => {
  const comentarios = [
    {
      id: 1,
      usuario: 'Maria Silva',
      avatar: '👩',
      comentario: 'Lugar incrível! Atendimento excelente e ambiente muito agradável.',
      tempo: '2 horas atrás',
      curtidas: 12
    },
    {
      id: 2,
      usuario: 'João Pedro',
      avatar: '👨',
      comentario: 'Recomendo demais! A comida estava perfeita e o preço justo.',
      tempo: '5 horas atrás',
      curtidas: 8
    },
    {
      id: 3,
      usuario: 'Ana Costa',
      avatar: '👩‍🦰',
      comentario: 'Voltarei com certeza! Adorei a experiência.',
      tempo: '1 dia atrás',
      curtidas: 15
    },
    {
      id: 4,
      usuario: 'Carlos Mendes',
      avatar: '👨‍🦱',
      comentario: 'Melhor lugar da região! Super indico para todos.',
      tempo: '2 dias atrás',
      curtidas: 20
    },
    {
      id: 5,
      usuario: 'Juliana Souza',
      avatar: '👱‍♀️',
      comentario: 'Atendimento impecável e ambiente aconchegante!',
      tempo: '3 dias atrás',
      curtidas: 6
    }
  ];

  return (
    <div className="chat-container">
      <div className="chat-header">
        <MessageCircle className="icone" />
        <h2>Comentários dos Clientes</h2>
        <span className="chat-badge">{comentarios.length}</span>
      </div>

      <div className="chat-lista">
        {comentarios.map((item) => (
          <div key={item.id} className="comentario-card">
            <div className="comentario-header">
              <div className="usuario-info">
                <span className="avatar">{item.avatar}</span>
                <div className="usuario-detalhes">
                  <span className="usuario-nome">{item.usuario}</span>
                  <span className="comentario-tempo">{item.tempo}</span>
                </div>
              </div>
              <div className="curtidas">
                <Heart className="icone-small" />
                <span>{item.curtidas}</span>
              </div>
            </div>
            <p className="comentario-texto">{item.comentario}</p>
          </div>
        ))}
      </div>

      <div className="chat-input-area">
        <input 
          type="text" 
          placeholder="Adicione um comentário..."
          className="chat-input"
        />
        <button className="chat-button">Enviar</button>
      </div>
    </div>
  );
};

export default ChatComentarios;