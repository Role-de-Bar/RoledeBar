import './CardEstabelecimentos.css';
import { useNavigate } from 'react-router-dom';
import BotaoFavorito from '../BotaoFavorito';

function CardEstabelecimentos({ estabelecimentos, usuario, isFavoritosPage = false, onAtualizarFavoritos }) {
  const navigate = useNavigate();

  function infos(index) {
    if (usuario) {
      navigate(`/infosEstabelecimento/${index}`);
    } else {
      alert("Somente usuários cadastrados podem visualizar as informações.\nFaça seu cadastro!");
    }
  }

  return (
    <section className="lista-estabelecimentos">
      {estabelecimentos.length === 0 ? (
        <p className="mensagem-vazia">Nenhum estabelecimento registrado.</p>
      ) : (
        estabelecimentos.map((estab, index) => (
          <div className="card-horizontal" key={index}>
            <img
              src={estab.foto}
              alt={`Foto do ${estab.nome}`}
              className="imagem-card"
            />
            <div className="info-card">
              <h2>{estab.nome}</h2>
              <p>{`${estab.rua}, ${estab.numero}, - ${estab.bairro}`}</p>
              <p className="tag-musica">🎵 {estab.estiloMusical}</p>
              <div className="botoes-card">
                <button onClick={() => infos(index)} className="botao-card">
                  Ver mais
                </button>

                {/* Botão de Favorito integrado */}
                <BotaoFavorito
                  estabelecimentoId={estab.id}
                  usuarioLogado={usuario}
                  onAtualizarFavoritos={onAtualizarFavoritos}
                />
              </div>
            </div>
          </div>
        ))
      )}
    </section>
  );
}

export default CardEstabelecimentos;
