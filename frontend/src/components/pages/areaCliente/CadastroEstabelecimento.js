// CadastroEstabelecimento.jsx - Versão Modal Horizontal
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  X,
  Upload,
  MapPin,
  Building2,
  Music,
  Star,
  Image as ImageIcon,
} from "lucide-react";
import "./CadastroEstabelecimento.css";
import CardEstabelecimentos from "../../estabelecimentos/CardEstabelecimento";
import Comodidades from "../../form/Comodidades";
import SelectTipoEstabelecimento from "../../form/SelectTipoEstabelecimento";
import SelectTipoMusica from "../../form/SelectTipoMusica";
import SelectEstiloMusical from "../../form/SelectEstiloMusical";

function CadastroEstabelecimento({ setIsLogged, usuarioLogado }) {
  const usuario = usuarioLogado;
  const navigate = useNavigate();
  const [meusEstabelecimentos, setMeusEstabelecimentos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Estados do formulário
  const [nome, setNome] = useState("");
  const [tipoEstabelecimento, setTipoEstabelecimento] = useState("");
  const [tipoMusica, setTipoMusica] = useState("");
  const [estiloMusical, setEstiloMusical] = useState("");
  const [comodidades, setComodidades] = useState([]);
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [descricao, setDescricao] = useState("");
  const [foto, setFoto] = useState("");

  useEffect(() => {
    if (!usuario) {
      setIsLogged(false);
      localStorage.setItem("isLogged", "false");
      navigate("/");
    } else {
      setIsLogged(true);
      localStorage.setItem("isLogged", "true");
      carregarMeusEstabelecimentos();
    }
  }, [usuario, navigate, setIsLogged]);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFoto(reader.result);
    reader.readAsDataURL(file);
  };

  const carregarMeusEstabelecimentos = () => {
    const estabelecimentos =
      JSON.parse(localStorage.getItem("estabelecimentos")) || [];
    const meus = estabelecimentos.filter(
      (estab) => estab.idProprietario === usuario?.id
    );
    setMeusEstabelecimentos(meus);
  };

  const voltar = () => {
    navigate("/estabelecimentos");
  };

  const buscarCep = async (cepDigitado) => {
    const cepLimpo = cepDigitado.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      try {
        const resposta = await fetch(
          `https://viacep.com.br/ws/${cepLimpo}/json/`
        );
        const dados = await resposta.json();
        if (!dados.erro) {
          setRua(dados.logradouro || "");
          setBairro(dados.bairro || "");
          setCidade(dados.localidade || "");
          setEstado(dados.uf || "");
        } else {
          alert("O CEP não foi encontrado.");
        }
      } catch (error) {
        alert("Erro ao buscar o CEP.");
      }
    } else if (cepLimpo.length > 0) {
      alert("O CEP deve ter 8 dígitos");
    }
  };

  const limparFormulario = () => {
    setNome("");
    setTipoEstabelecimento("");
    setTipoMusica("");
    setEstiloMusical("");
    setComodidades([]);
    setCep("");
    setRua("");
    setNumero("");
    setComplemento("");
    setBairro("");
    setCidade("");
    setEstado("");
    setDescricao("");
    setFoto("");
  };

  const cadastrarBar = (e) => {
    e.preventDefault();

    const novoEstabelecimento = {
      nome,
      tipo: tipoEstabelecimento,
      tipoMusica,
      estiloMusical,
      comodidades,
      endereco: {
        cep,
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
      },
      descricao,
      foto,
      idProprietario: usuario.id,
    };

    const estabelecimentosSalvos =
      JSON.parse(localStorage.getItem("estabelecimentos")) || [];
    estabelecimentosSalvos.push(novoEstabelecimento);
    localStorage.setItem(
      "estabelecimentos",
      JSON.stringify(estabelecimentosSalvos)
    );

    alert("Estabelecimento cadastrado com sucesso!");
    setMostrarModal(false);
    limparFormulario();
    carregarMeusEstabelecimentos();
  };

  const cancelarCadastro = () => {
    setMostrarModal(false);
    limparFormulario();
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-wrapper">
        {/* Header */}
        <div className="cadastro-header">
          <button onClick={voltar} className="btn-voltar-cadastro">
            <ArrowLeft size={20} />
            Voltar
          </button>
          <button
            className="btn-adicionar"
            onClick={() => setMostrarModal(true)}
          >
            <Plus size={20} />
            Adicionar Estabelecimento
          </button>
        </div>

        {/* Lista de Estabelecimentos */}
        <div className="estabelecimentos-section">
          <h1>Meus Estabelecimentos</h1>
          <p className="estabelecimentos-count">
            Total de estabelecimentos:{" "}
            <strong>{meusEstabelecimentos.length}</strong>
          </p>

          {meusEstabelecimentos.length === 0 ? (
            <div className="empty-estabelecimentos">
              <div className="empty-icon">🏪</div>
              <h3>Nenhum estabelecimento cadastrado</h3>
              <p>Comece adicionando seu primeiro estabelecimento</p>
            </div>
          ) : (
            <CardEstabelecimentos
              estabelecimentos={meusEstabelecimentos}
              usuario={usuario}
            />
          )}
        </div>

        {/* Modal de Cadastro - Layout Horizontal */}
        {mostrarModal && (
          <div
            className="modal-overlay"
            onClick={(e) => {
              if (e.target.className === "modal-overlay") {
                cancelarCadastro();
              }
            }}
          >
            <div className="modal-content">
              {/* Sidebar com Preview */}
              <div className="modal-sidebar">
                <div className="sidebar-content">
                  <div className="sidebar-header">
                    <h2>Preview</h2>
                    <p>Veja como ficará seu estabelecimento</p>
                  </div>

                  <div className="preview-card">
                    <h3>Pré-visualização</h3>
                    
                    {/* Imagem Preview */}
                    <div className="preview-image-container">
                      {foto ? (
                        <>
                          <img
                            src={foto}
                            alt="Preview"
                            className="preview-image"
                          />
                          <button
                            type="button"
                            className="btn-remove-image"
                            onClick={() => setFoto("")}
                            title="Remover imagem"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <div className="preview-image-placeholder">
                          <ImageIcon size={40} />
                          <span style={{ fontSize: '0.75rem' }}>Sem imagem</span>
                        </div>
                      )}
                    </div>

                    {/* Informações do Preview */}
                    <div className="preview-info">
                      <div className="preview-item">
                        <Building2 size={16} />
                        <div>
                          <strong>{nome || "Nome do estabelecimento"}</strong>
                          {tipoEstabelecimento && (
                            <div style={{ fontSize: '0.75rem', color: '#999' }}>
                              {tipoEstabelecimento}
                            </div>
                          )}
                        </div>
                      </div>

                      {(cidade || estado) && (
                        <div className="preview-item">
                          <MapPin size={16} />
                          <span>
                            {cidade && estado
                              ? `${cidade}, ${estado}`
                              : cidade || estado || "Localização"}
                          </span>
                        </div>
                      )}

                      {estiloMusical && (
                        <div className="preview-item">
                          <Music size={16} />
                          <span>{estiloMusical}</span>
                        </div>
                      )}

                      {comodidades.length > 0 && (
                        <div className="preview-item">
                          <Star size={16} />
                          <span>{comodidades.length} comodidades</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção do Formulário */}
              <div className="modal-form-section">
                {/* Header do Modal */}
                <div className="modal-header">
                  <h2>Cadastro de Estabelecimento</h2>
                  <button
                    type="button"
                    className="btn-fechar-modal"
                    onClick={cancelarCadastro}
                    title="Fechar"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Formulário */}
                <form className="form-cadastro" onSubmit={cadastrarBar}>
                  {/* Informações Básicas */}
                  <div className="form-section">
                    <h3 className="form-section-title">
                      <Building2 size={18} />
                      Informações Básicas
                    </h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">
                          Nome do Estabelecimento{" "}
                          <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          placeholder="Digite o nome do bar"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Tipo de Estabelecimento{" "}
                          <span className="required">*</span>
                        </label>
                        <SelectTipoEstabelecimento
                          value={tipoEstabelecimento}
                          onChange={setTipoEstabelecimento}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Música */}
                  <div className="form-section">
                    <h3 className="form-section-title">
                      <Music size={18} />
                      Música e Entretenimento
                    </h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Tipo de Música</label>
                        <SelectTipoMusica
                          value={tipoMusica}
                          onChange={setTipoMusica}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Estilo Musical <span className="required">*</span>
                        </label>
                        <SelectEstiloMusical
                          value={estiloMusical}
                          onChange={setEstiloMusical}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Comodidades */}
                  <div className="form-section">
                    <h3 className="form-section-title">
                      <Star size={18} />
                      Comodidades
                    </h3>
                    <Comodidades value={comodidades} onChange={setComodidades} />
                  </div>

                  {/* Endereço */}
                  <div className="form-section">
                    <h3 className="form-section-title">
                      <MapPin size={18} />
                      Endereço
                    </h3>
                    <div className="form-grid">
                      <div className="form-grid-2">
                        <div className="form-group">
                          <label className="form-label">
                            CEP <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            value={cep}
                            onChange={(e) => setCep(e.target.value)}
                            onBlur={() => buscarCep(cep)}
                            placeholder="00000-000"
                            maxLength="9"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">
                            Número <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            value={numero}
                            onChange={(e) => setNumero(e.target.value)}
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Rua <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          value={rua}
                          onChange={(e) => setRua(e.target.value)}
                          placeholder="Digite a rua"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Complemento</label>
                        <input
                          type="text"
                          className="form-input"
                          value={complemento}
                          onChange={(e) => setComplemento(e.target.value)}
                          placeholder="Apto, Sala, etc"
                        />
                      </div>

                      <div className="form-grid-2">
                        <div className="form-group">
                          <label className="form-label">
                            Bairro <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            value={bairro}
                            onChange={(e) => setBairro(e.target.value)}
                            placeholder="Digite o bairro"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">
                            Cidade <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            value={cidade}
                            onChange={(e) => setCidade(e.target.value)}
                            placeholder="Digite a cidade"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Estado <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          value={estado}
                          onChange={(e) => setEstado(e.target.value)}
                          placeholder="UF"
                          maxLength="2"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Descrição */}
                  <div className="form-section">
                    <div className="form-group">
                      <label className="form-label">
                        Descrição <span className="required">*</span>
                      </label>
                      <textarea
                        className="form-textarea"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        placeholder="Descreva seu estabelecimento..."
                        required
                      />
                    </div>
                  </div>

                  {/* Upload de Imagem */}
                  <div className="form-section">
                    <div className="form-group">
                      <label className="form-label">
                        Foto do Estabelecimento{" "}
                        <span className="required">*</span>
                      </label>
                      <div className="upload-area">
                        <Upload className="upload-icon" size={48} />
                        <p className="upload-text">
                          Arraste e solte a imagem aqui ou
                        </p>
                        <button
                          type="button"
                          className="btn-browse"
                          onClick={() =>
                            fileInputRef.current && fileInputRef.current.click()
                          }
                        >
                          Buscar Arquivo
                        </button>
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          style={{ display: "none" }}
                          onChange={handleFileChange}
                        />
                        <p className="upload-hint">
                          Formato: JPG, PNG - Até 5MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-cancelar"
                      onClick={cancelarCadastro}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn-submit">
                      Cadastrar Estabelecimento
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CadastroEstabelecimento;