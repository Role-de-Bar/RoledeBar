import { useState, useEffect, useCallback, useMemo } from 'react';
import './CadastroEstabelecimento.css';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import Comodidades from '../../form/Comodidades';
import SelectTipoEstabelecimento from '../../form/SelectTipoEstabelecimento';
import SelectTipoMusica from '../../form/SelectTipoMusica';
import SelectEstiloMusical from '../../form/SelectEstiloMusical';
import InputTexto from '../../form/InputTexto';
import CardEstabelecimentos from '../../estabelecimentos/CardEstabelecimento';

// Estado inicial do formulário
const FORM_INITIAL_STATE = {
  nome: '',
  tipoEstabelecimento: '',
  tipoMusica: '',
  estiloMusical: '',
  comodidades: [],
  cep: '',
  rua: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  descricao: '',
  foto: ''
};

function CadastroEstabelecimento({ setIsLogged, usuarioLogado }) {
  const navigate = useNavigate();

  // Estados
  const [meusEstabelecimentos, setMeusEstabelecimentos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [formData, setFormData] = useState(FORM_INITIAL_STATE);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [errors, setErrors] = useState({});

  // Carrega estabelecimentos do usuário
  useEffect(() => {
    if (!usuarioLogado) {
      setIsLogged(false);
      localStorage.setItem("isLogged", "false");
      navigate('/');
      return;
    }

    setIsLogged(true);
    localStorage.setItem("isLogged", "true");

    const estabelecimentos = JSON.parse(localStorage.getItem('estabelecimentos')) || [];
    const meus = estabelecimentos.filter(estab => estab.idProprietario === usuarioLogado.id);
    setMeusEstabelecimentos(meus);
  }, [usuarioLogado, navigate, setIsLogged]);

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
 
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  // Busca CEP com debounce e loading
  const buscarCep = useCallback(async (cepValue) => {
    const clean = (cepValue || '').replace(/\D/g, '');
    if (clean.length !== 8) return;

    setIsLoadingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      if (!res.ok) throw new Error('Falha ao buscar CEP');
      
      const data = await res.json();
      if (data.erro) {
        setErrors(prev => ({ ...prev, cep: 'CEP não encontrado' }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        rua: data.logradouro || prev.rua,
        bairro: data.bairro || prev.bairro,
        cidade: data.localidade || prev.cidade,
        estado: data.uf || prev.estado
      }));
      
      setErrors(prev => ({ ...prev, cep: null }));
    } catch (error) {
      setErrors(prev => ({ ...prev, cep: 'Erro ao buscar CEP' }));
    } finally {
      setIsLoadingCep(false);
    }
  }, []);

  // Valida formulário
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.tipoEstabelecimento) newErrors.tipoEstabelecimento = 'Selecione o tipo';
    if (!formData.cep) newErrors.cep = 'CEP é obrigatório';
    if (!formData.rua.trim()) newErrors.rua = 'Rua é obrigatória';
    if (!formData.numero.trim()) newErrors.numero = 'Número é obrigatório';
    if (!formData.bairro.trim()) newErrors.bairro = 'Bairro é obrigatório';
    if (!formData.cidade.trim()) newErrors.cidade = 'Cidade é obrigatória';
    if (!formData.estado.trim()) newErrors.estado = 'Estado é obrigatório';
    if (!formData.descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Cadastra estabelecimento
  const cadastrarBar = useCallback((e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newEst = {
      id: Date.now(),
      nome: formData.nome.trim(),
      tipoEstabelecimento: formData.tipoEstabelecimento,
      tipoMusica: formData.tipoMusica,
      estiloMusical: formData.estiloMusical,
      comodidades: formData.comodidades,
      endereco: {
        cep: formData.cep,
        rua: formData.rua.trim(),
        numero: formData.numero.trim(),
        complemento: formData.complemento.trim(),
        bairro: formData.bairro.trim(),
        cidade: formData.cidade.trim(),
        estado: formData.estado.trim()
      },
      descricao: formData.descricao.trim(),
      foto: formData.foto || '/img/default-bar.jpg',
      idProprietario: usuarioLogado?.id || null,
      criadoEm: new Date().toISOString()
    };

    const stored = JSON.parse(localStorage.getItem('estabelecimentos')) || [];
    stored.unshift(newEst);
    localStorage.setItem('estabelecimentos', JSON.stringify(stored));

    setMeusEstabelecimentos(prev => [newEst, ...prev]);
    setMostrarModal(false);
    setFormData(FORM_INITIAL_STATE);
    setErrors({});
  }, [formData, usuarioLogado, validateForm]);

  // Fecha modal e reseta formulário
  const fecharModal = useCallback(() => {
    setMostrarModal(false);
    setFormData(FORM_INITIAL_STATE);
    setErrors({});
  }, []);

  // Preview da imagem
  const previewSrc = formData.foto || '/img/default-bar.jpg';

  // Data do último cadastro
  const ultimoCadastro = useMemo(() => {
    if (!meusEstabelecimentos.length) return '—';
    const ultimo = meusEstabelecimentos[0];
    const data = new Date(ultimo.criadoEm);
    return `${ultimo.nome} (${data.toLocaleDateString('pt-BR')})`;
  }, [meusEstabelecimentos]);

  // Previne scroll do body quando modal está aberto
  useEffect(() => {
    if (mostrarModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mostrarModal]);

  return (
    <main className="cadastro_meus_estabelecimentos">
      <div className="cabecalho_meus_estabelecimentos">
        <div className="left">
          <button 
            onClick={() => navigate('/estabelecimentos')} 
            className="voltar_estabelecimentos"
            aria-label="Voltar para estabelecimentos"
          >
            ← Voltar
          </button>
          <h2>Meus Estabelecimentos</h2>
        </div>
        <button 
          className="btn-add" 
          onClick={() => setMostrarModal(true)}
          aria-label="Adicionar novo estabelecimento"
        >
          ➕ Adicionar
        </button>
      </div>

      <div className="main-grid">
        <section className="estabelecimentos_registrados">
          <h1>Estabelecimentos registrados</h1>
          <p>Total: <strong>{meusEstabelecimentos.length}</strong> {meusEstabelecimentos.length === 1 ? 'estabelecimento' : 'estabelecimentos'}</p>
          
          {meusEstabelecimentos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏪</div>
              <h3>Nenhum estabelecimento cadastrado</h3>
              <p>Clique em "Adicionar" para cadastrar seu primeiro estabelecimento</p>
            </div>
          ) : (
            <article className="article-estabelecimentos">
              <CardEstabelecimentos 
                estabelecimentos={meusEstabelecimentos} 
                usuario={usuarioLogado}
              />
            </article>
          )}
        </section>

        <aside className="side-panel" aria-hidden={!meusEstabelecimentos.length}>
          <div className="stat">
            <div className="label">Total cadastrado</div>
            <div className="value">{meusEstabelecimentos.length}</div>
          </div>
          <div className="stat">
            <div className="label">Último cadastro</div>
            <div className="value-small">{ultimoCadastro}</div>
          </div>
          <div className="divider" />
          <div className="tip">
            💡 <strong>Dica:</strong> Use imagens quadradas (800x800px) para melhor exibição nos cards.
          </div>
        </aside>
      </div>

      {mostrarModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="fechar-modal" 
              aria-label="Fechar modal" 
              onClick={fecharModal}
            >
              <CloseIcon />
            </button>

            <form className="form-panel" onSubmit={cadastrarBar}>
              <h3>Novo estabelecimento</h3>

              <div className="field-grid">
                {/* Linha 1: Nome completo */}
                <div className="field-full">
                  <label className="form-label" htmlFor="nome">Nome *</label>
                  <InputTexto
                    className={`form-input ${errors.nome ? 'error' : ''}`}
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => updateField('nome', e.target.value)}
                    placeholder="Ex: Bar do João"
                    autoComplete="off"
                  />
                  {errors.nome && <span className="error-message">{errors.nome}</span>}
                </div>

                {/* Linha 2: Tipo, Música, Estilo */}
                <div>
                  <label className="form-label" htmlFor="tipo">Tipo de estabelecimento *</label>
                  <SelectTipoEstabelecimento
                    value={formData.tipoEstabelecimento}
                    onChange={(val) => updateField('tipoEstabelecimento', val)}
                  />
                  {errors.tipoEstabelecimento && <span className="error-message">{errors.tipoEstabelecimento}</span>}
                </div>

                <div>
                  <label className="form-label" htmlFor="musica">Tipo de música</label>
                  <SelectTipoMusica
                    value={formData.tipoMusica}
                    onChange={(val) => updateField('tipoMusica', val)}
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="estilo">Estilo musical</label>
                  <SelectEstiloMusical
                    value={formData.estiloMusical}
                    onChange={(val) => updateField('estiloMusical', val)}
                  />
                </div>

                {/* Linha 3: Comodidades */}
                <div className="field-full">
                  <label className="form-label">Comodidades</label>
                  <Comodidades
                    value={formData.comodidades}
                    onChange={(val) => updateField('comodidades', val)}
                  />
                </div>

                {/* Linha 4: CEP, Rua, Número */}
                <div>
                  <label className="form-label" htmlFor="cep">CEP *</label>
                  <div className="input-with-loading">
                    <InputTexto
                      className={`form-input ${errors.cep ? 'error' : ''}`}
                      id="cep"
                      value={formData.cep}
                      onChange={(e) => updateField('cep', e.target.value)}
                      onBlur={() => buscarCep(formData.cep)}
                      placeholder="00000-000"
                      maxLength="9"
                    />
                    {isLoadingCep && <span className="loading-spinner">⏳</span>}
                  </div>
                  {errors.cep && <span className="error-message">{errors.cep}</span>}
                </div>

                <div>
                  <label className="form-label" htmlFor="rua">Rua *</label>
                  <InputTexto
                    className={`form-input ${errors.rua ? 'error' : ''}`}
                    id="rua"
                    value={formData.rua}
                    onChange={(e) => updateField('rua', e.target.value)}
                  />
                  {errors.rua && <span className="error-message">{errors.rua}</span>}
                </div>

                <div>
                  <label className="form-label" htmlFor="numero">Número *</label>
                  <InputTexto
                    className={`form-input ${errors.numero ? 'error' : ''}`}
                    id="numero"
                    value={formData.numero}
                    onChange={(e) => updateField('numero', e.target.value)}
                  />
                  {errors.numero && <span className="error-message">{errors.numero}</span>}
                </div>

                {/* Linha 5: Complemento, Bairro, Cidade */}
                <div>
                  <label className="form-label" htmlFor="complemento">Complemento</label>
                  <InputTexto
                    className="form-input"
                    id="complemento"
                    value={formData.complemento}
                    onChange={(e) => updateField('complemento', e.target.value)}
                    placeholder="Apto, sala, etc"
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="bairro">Bairro *</label>
                  <InputTexto
                    className={`form-input ${errors.bairro ? 'error' : ''}`}
                    id="bairro"
                    value={formData.bairro}
                    onChange={(e) => updateField('bairro', e.target.value)}
                  />
                  {errors.bairro && <span className="error-message">{errors.bairro}</span>}
                </div>

                <div>
                  <label className="form-label" htmlFor="cidade">Cidade *</label>
                  <InputTexto
                    className={`form-input ${errors.cidade ? 'error' : ''}`}
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => updateField('cidade', e.target.value)}
                  />
                  {errors.cidade && <span className="error-message">{errors.cidade}</span>}
                </div>

                {/* Linha 6: Estado e URL da imagem */}
                <div>
                  <label className="form-label" htmlFor="estado">Estado *</label>
                  <InputTexto
                    className={`form-input ${errors.estado ? 'error' : ''}`}
                    id="estado"
                    value={formData.estado}
                    onChange={(e) => updateField('estado', e.target.value)}
                    placeholder="RS"
                    maxLength="2"
                  />
                  {errors.estado && <span className="error-message">{errors.estado}</span>}
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label className="form-label" htmlFor="foto">URL da imagem</label>
                  <InputTexto
                    className="form-input"
                    id="foto"
                    value={formData.foto}
                    onChange={(e) => updateField('foto', e.target.value)}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>

                {/* Linha 7: Descrição */}
                <div className="field-full">
                  <label className="form-label" htmlFor="descricao">Descrição *</label>
                  <textarea
                    className={`form-input ${errors.descricao ? 'error' : ''}`}
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => updateField('descricao', e.target.value)}
                    placeholder="Descreva seu estabelecimento..."
                    rows="3"
                  />
                  {errors.descricao && <span className="error-message">{errors.descricao}</span>}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-ghost" onClick={fecharModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Cadastrar estabelecimento
                </button>
              </div>
            </form>

            <aside className="preview-panel">
              <div className="preview-label">Preview do card</div>
              <img 
                src={previewSrc} 
                alt="Preview do estabelecimento" 
                className="preview-image"
                onError={(e) => e.target.src = '/img/default-bar.jpg'}
              />
              <div className="preview-title">{formData.nome || 'Nome do estabelecimento'}</div>
              <div className="preview-meta">
                {formData.tipoEstabelecimento || 'Tipo'} 
                {formData.tipoMusica && ` • ${formData.tipoMusica}`}
              </div>
              <div className="divider" />
              <div className="preview-section">
                <div className="preview-label-small">Descrição:</div>
                <div className="preview-desc">
                  {formData.descricao 
                    ? (formData.descricao.length > 140 
                        ? formData.descricao.slice(0, 140) + '...' 
                        : formData.descricao)
                    : 'A descrição aparecerá aqui...'}
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}
    </main>
  );
}

export default CadastroEstabelecimento;