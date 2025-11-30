// CadastroEstabelecimento.jsx - Com funcionalidade de exclusão integrada
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
  Trash2,
  Edit3,
  MoreVertical,
} from "lucide-react";
import "./CadastroEstabelecimento.css";
import Comodidades from "../../form/Comodidades";
import SelectTipoEstabelecimento from "../../form/SelectTipoEstabelecimento";
import SelectTipoMusica from "../../form/SelectTipoMusica";
import SelectEstiloMusical from "../../form/SelectEstiloMusical";

function CadastroEstabelecimento({ setIsLogged, usuarioLogado }) {
  const usuario = usuarioLogado;
  const navigate = useNavigate();
  const [meusEstabelecimentos, setMeusEstabelecimentos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [estabelecimentoEditando, setEstabelecimentoEditando] = useState(null);
  const [menuAberto, setMenuAberto] = useState(null);
  const [modalConfirmacao, setModalConfirmacao] = useState(null);

  // Estados do formulário
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
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

  const carregarMeusEstabelecimentos = async () => {
    try {
      const resposta = await fetch(
        `http://localhost:8081/estabelecimentos/${usuario.id}`
      );

      const dados = await resposta.json();
      setMeusEstabelecimentos(dados);
    } catch (erro) {
      console.error("Erro ao carregar estabelecimentos:", erro);
    }
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
    setCnpj("");
    setTelefone("");
    setEmail("");
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
    setEstabelecimentoEditando(null);
  };

  const enderecoPreview = [
    [rua, numero].filter(Boolean).join(", "),
    complemento,
    bairro,
    cidade && estado ? `${cidade}/${estado}` : cidade || estado,
    cep ? `CEP: ${cep}` : null,
  ]
    .filter(Boolean)
    .join(" - ");

  const abrirModalEdicao = (estab, index) => {
    setEstabelecimentoEditando(index);
    setNome(estab.nome);
    setTipoEstabelecimento(estab.tipo);
    setTipoMusica(estab.tipoMusica);
    setEstiloMusical(estab.estiloMusical);
    setComodidades(estab.comodidades);
    setCep(estab.endereco.cep);
    setRua(estab.endereco.rua);
    setNumero(estab.endereco.numero);
    setComplemento(estab.endereco.complemento);
    setBairro(estab.endereco.bairro);
    setCidade(estab.endereco.cidade);
    setEstado(estab.endereco.estado);
    setDescricao(estab.descricao);
    setFoto(estab.foto);
    setMostrarModal(true);
    setMenuAberto(null);
  };

  const cadastrarBar = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("cnpj", cnpj);
    formData.append("telefone", telefone);
    formData.append("email", email);
    formData.append("tipoEstabelecimento", tipoEstabelecimento);
    formData.append("tipoMusica", tipoMusica);
    formData.append("estiloMusical", estiloMusical);
    formData.append("comodidades", JSON.stringify(comodidades));
    formData.append("cep", cep);
    formData.append("rua", rua);
    formData.append("numero", numero);
    formData.append("complemento", complemento);
    formData.append("bairro", bairro);
    formData.append("cidade", cidade);
    formData.append("estado", estado);
    formData.append("descricao", descricao);
    formData.append("proprietario_id", usuario.id);

    // Foto real (binária)
    if (fileInputRef.current.files[0]) {
      formData.append("foto", fileInputRef.current.files[0]);
    }

    try {
      await fetch("http://localhost:8081/estabelecimentos/cadastro", {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      console.error(error);
    }

    alert("Estabelecimento cadastrado com sucesso!");
    setMostrarModal(false);
    limparFormulario();
    carregarMeusEstabelecimentos();
  };

  const cancelarCadastro = () => {
    setMostrarModal(false);
    limparFormulario();
  };

  const abrirModalConfirmacao = (index) => {
    setModalConfirmacao(index);
    setMenuAberto(null);
  };

  const confirmarExclusao = () => {
    if (modalConfirmacao === null) return;

    const todosEstabelecimentos =
      JSON.parse(localStorage.getItem("estabelecimentos")) || [];
    const meusIds = todosEstabelecimentos
      .map((estab, idx) =>
        estab.idProprietario === usuario?.id ? idx : null
      )
      .filter((id) => id !== null);

    const idParaRemover = meusIds[modalConfirmacao];
    todosEstabelecimentos.splice(idParaRemover, 1);

    localStorage.setItem(
      "estabelecimentos",
      JSON.stringify(todosEstabelecimentos)
    );

    setModalConfirmacao(null);
    carregarMeusEstabelecimentos();
    alert("Estabelecimento excluído com sucesso!");
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
            onClick={() => {
              limparFormulario();
              setMostrarModal(true);
            }}
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
            <div className="estabelecimentos-grid">
              {meusEstabelecimentos.map((estab, index) => (
                <div key={index} className="estabelecimento-card">
                  <div className="card-image-wrapper">
                    {estab.foto ? (
                      <img
                        src={estab.foto}
                        alt={estab.nome}
                        className="card-image"
                      />
                    ) : (
                      <div className="card-image-placeholder">
                        <Building2 size={48} />
                      </div>
                    )}
                    <div className="card-menu">
                      <button
                        className="btn-menu"
                        onClick={() =>
                          setMenuAberto(menuAberto === index ? null : index)
                        }
                      >
                        <MoreVertical size={20} />
                      </button>
                      {menuAberto === index && (
                        <div className="menu-dropdown">
                          <button
                            className="menu-item"
                            onClick={() => abrirModalEdicao(estab, index)}
                          >
                            <Edit3 size={16} />
                            Editar
                          </button>
                          <button
                            className="menu-item delete"
                            onClick={() => abrirModalConfirmacao(index)}
                          >
                            <Trash2 size={16} />
                            Excluir
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="card-body">
                    <h3 className="card-title">{estab.nome}</h3>
                    <p className="card-type">{estab.tipo}</p>

                    {estab.estiloMusical && (
                      <div className="card-detail">
                        <Music size={14} />
                        <span>{estab.estiloMusical}</span>
                      </div>
                    )}

                    <div className="card-detail">
                      <MapPin size={14} />
                      <span>
                        {estab.endereco.cidade}/{estab.endereco.estado}
                      </span>
                    </div>

                    {estab.comodidades?.length > 0 && (
                      <div className="card-detail">
                        <Star size={14} />
                        <span>{estab.comodidades.length} comodidades</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de Confirmação de Exclusão */}
        {modalConfirmacao !== null && (
          <div
            className="modal-overlay"
            onClick={(e) => {
              if (e.target.className === "modal-overlay") {
                setModalConfirmacao(null);
              }
            }}
          >
            <div className="modal-confirmacao">
              <div className="modal-confirmacao-header">
                <Trash2 size={24} className="icon-danger" />
                <h2>Confirmar Exclusão</h2>
              </div>
              <p>
                Tem certeza que deseja excluir o estabelecimento{" "}
                <strong>{meusEstabelecimentos[modalConfirmacao]?.nome}</strong>
                ?
              </p>
              <p className="text-warning">Esta ação não pode ser desfeita.</p>
              <div className="modal-confirmacao-actions">
                <button
                  className="btn-cancelar"
                  onClick={() => setModalConfirmacao(null)}
                >
                  Cancelar
                </button>
                <button className="btn-confirmar-delete" onClick={confirmarExclusao}>
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Cadastro/Edição */}
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
                          <span style={{ fontSize: "0.75rem" }}>
                            Sem imagem
                          </span>
                          <span style={{ fontSize: "0.75rem" }}>
                            Sem imagem
                          </span>
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
                            <div style={{ fontSize: "0.75rem", color: "#999" }}>
                              {tipoEstabelecimento}
                            </div>
                          )}
                        </div>
                      </div>

                      {(rua ||
                        numero ||
                        complemento ||
                        bairro ||
                        cidade ||
                        estado ||
                        cep) && (
                        <div className="preview-item">
                          <MapPin size={16} />
                          <span>{enderecoPreview}</span>
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
                  <h2>
                    {estabelecimentoEditando !== null
                      ? "Editar Estabelecimento"
                      : "Cadastro de Estabelecimento"}
                  </h2>
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
                          CNPJ <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          value={cnpj}
                          onChange={(e) => setCnpj(e.target.value)}
                          placeholder="Digite um CNPJ válido"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Email <span className="required">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-input"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="@example.com"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          Telefone <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          value={telefone}
                          onChange={(e) => setTelefone(e.target.value)}
                          placeholder="DDD + número de telefone"
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
                    <Comodidades
                      value={comodidades}
                      onChange={setComodidades}
                    />
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
                            fileInputRef.current &&
                            fileInputRef.current.click()
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
                      {estabelecimentoEditando !== null
                        ? "Atualizar Estabelecimento"
                        : "Cadastrar Estabelecimento"}
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
