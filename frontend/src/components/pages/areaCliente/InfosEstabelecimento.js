// Importações
import './InfosEstabelecimento.css';
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import GraficoFavoritos from '../../InforComponents/Graficos';
import Avaliacoes from '../../InforComponents/Avaliacoes';

function InfosEstabelecimento({ setIsLogged, usuarioLogado }) {
  const usuario = usuarioLogado;
  const navigate = useNavigate();
  const { id } = useParams();

  const estabelecimentos = JSON.parse(localStorage.getItem("estabelecimentos")) || [];
  const estabelecimento = estabelecimentos[id];

  // Estados dos campos
  const [nome, setNome] = useState(estabelecimento.nome || "");
  const [descricao, setDescricao] = useState(estabelecimento.descricao || "");
  const [tipo, setTipo] = useState(estabelecimento.tipo || "");
  const [tipoMusica, setTipoMusica] = useState(estabelecimento.tipoMusica || "");
  const [estiloMusical, setEstiloMusical] = useState(estabelecimento.estiloMusical || "");
  const [comodidades, setComodidades] = useState(estabelecimento.comodidades || []);
  const [cep, setCep] = useState(estabelecimento.cep || "");
  const [rua, setRua] = useState(estabelecimento.rua || "");
  const [numero, setNumero] = useState(estabelecimento.numero || "");
  const [complemento, setComplemento] = useState(estabelecimento.complemento || "");
  const [bairro, setBairro] = useState(estabelecimento.bairro || "");
  const [cidade, setCidade] = useState(estabelecimento.cidade || "");
  const [estado, setEstado] = useState(estabelecimento.estado || "");
  const [foto, setFoto] = useState(estabelecimento.foto || "");
  const [abaAtiva, setAbaAtiva] = useState('localizacao');

  useEffect(() => {
    if (!usuario) {
      setIsLogged(false);
      localStorage.setItem("isLogged", "false");
      navigate('/');
    } else {
      setIsLogged(true);
      localStorage.setItem("isLogged", "true");
    }
  }, []);

  const voltar = () => navigate("/estabelecimentos");

  const buscarCep = async (cepDigitado) => {
    const cepLimpo = cepDigitado.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const dados = await resposta.json();
        if (!dados.erro) {
          setRua(dados.logradouro || '');
          setBairro(dados.bairro || '');
          setCidade(dados.localidade || '');
          setEstado(dados.uf || '');
        } else {
          alert('CEP não encontrado.');
        }
      } catch (error) {
        alert('Erro ao buscar o CEP.');
      }
    }
  };

  // monta endereço formatado sem partes vazias
  const enderecoFormatado = [
    [rua, numero].filter(Boolean).join(', '),
    complemento,
    bairro,
    (cidade && estado) ? `${cidade}/${estado}` : (cidade || estado),
    cep ? `CEP: ${cep}` : null,
  ].filter(Boolean).join(' - ');

  // Renderizar conteúdo da aba ativa
  const renderConteudoAba = () => {
    switch(abaAtiva) {
      case 'localizacao':
        return (
          <div className="secao-endereco-info">
            <div className="endereco-card-info">
              <h2>📍 Localização</h2>
              <p className="endereco-texto-info">
                {enderecoFormatado || 'Endereço não disponível'}
              </p>
            </div>

            <div className="mapa-card-info">
              <iframe
                title="Mapa do Estabelecimento"
                width="100%"
                height="100%" 
                style={{ border: 0, borderRadius: '12px' }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${encodeURIComponent(enderecoFormatado || nome || '')}&output=embed`}
              ></iframe>
            </div>
          </div>
        );
      case 'avaliacoes':
        return (
          <div className="secao-avaliacoes-info">
            <Avaliacoes />
          </div>
        );
      case 'graficos':
        return (
          <div className="secao-graficos-info">
            <GraficoFavoritos />
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <main className='main-info-estabelecimento'>
      {/* <button className="btn-voltarInfo" onClick={voltar}>
        Voltar
      </button> */}

        <div className="container-visualizacao">
          {/* Seção Principal - Foto e Nome */}
          <div className="secao-hero-info">
            <div className="galeria-fotos-info">
              <img src={foto} alt={nome} className="foto-principal-info" />
            </div>

            <div className="info-principal-container">
              <h1 className="nome-estabelecimento-info">{nome}</h1>
              
              <div className="badge-tipo-info">
                <span className="badge-info">{tipo}</span>
              </div>

              <div className="info-rapida-grid">
                <div className="info-item-card">
                  <span className="label-info-text">Tipo de Música</span>
                  <span className="valor-info-text">{tipoMusica}</span>
                </div>
                <div className="info-item-card">
                  <span className="label-info-text">Estilo Musical</span>
                  <span className="valor-info-text">{estiloMusical}</span>
                </div>
              </div>

              <div className="descricao-box-info">
                <h3>Descrição</h3>
                <p>{descricao}</p>
              </div>

              {/* Comodidades em destaque */}
              <div className="comodidades-destaque-info">
                <h3>Comodidades</h3>
                <div className="grid-comodidades-info">
                  {comodidades.map((item, index) => (
                    <div key={index} className="comodidade-tag-info">
                      <span>✓</span> 
                      <h5 className='comodidadeTexto-info'>{item}</h5> 
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Seção de Navegação de Abas */}
          <div className="secao-tabs-info">
            <div className="tabs-container-info">
              <button 
                className={`tab-button-info ${abaAtiva === 'localizacao' ? 'ativo-info' : ''}`}
                onClick={() => setAbaAtiva('localizacao')}
              >
                <span className="tab-icone-info">📍</span>
                <span className="tab-label-info">Localização</span>
              </button>
              <button 
                className={`tab-button-info ${abaAtiva === 'avaliacoes' ? 'ativo-info' : ''}`}
                onClick={() => setAbaAtiva('avaliacoes')}
              >
                <span className="tab-icone-info">⭐</span>
                <span className="tab-label-info">Avaliações</span>
              </button>
              <button 
                className={`tab-button-info ${abaAtiva === 'graficos' ? 'ativo-info' : ''}`}
                onClick={() => setAbaAtiva('graficos')}
              >
                <span className="tab-icone-info">📊</span>
                <span className="tab-label-info">Estatísticas</span>
              </button>
            </div>
          </div>

          {/* Conteúdo da Aba Ativa */}
          <div className="conteudo-abas-info">
            {renderConteudoAba()}
          </div>
        </div>

    </main>
  );
}

export default InfosEstabelecimento;