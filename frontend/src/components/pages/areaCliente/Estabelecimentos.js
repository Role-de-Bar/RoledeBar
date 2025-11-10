import './Estabelecimentos.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { X } from "lucide-react";
import Comodidades from '../../form/Comodidades';
import SelectEstiloMusical from '../../form/SelectEstiloMusical';
import SelectTipoEstabelecimento from '../../form/SelectTipoEstabelecimento';
import CardEstabelecimentos from '../../estabelecimentos/CardEstabelecimento';
import Cardapio from '../../form/Cardapio';
import HeaderEstabelecimento from '../../estabelecimentos/headerEstabelecimento';
import LabelTexto from '../../form/LabelTexto';
import SelectInternoBairros from '../../form/SelectInternoBairros';
import SelectTipoMusica from '../../form/SelectTipoMusica';
import { AnimatePresence, motion } from "framer-motion";

function Estabelecimentos({ setIsLogged, usuarioLogado }) {
  const navigate = useNavigate();
  const usuario = usuarioLogado;

  const [tipoSelecionado, setTipoSelecionado] = useState("");
  const [tipoMusicaSelecionado, setTipoMusicaSelecionado] = useState("");
  const [estiloSelecionado, setEstiloSelecionado] = useState("");
  const [comodidadesSelecionadas, setComodidadesSelecionadas] = useState([]);
  const [bairroSelecionado, setBairroSelecionado] = useState("");
  const [estabelecimentos, setEstabelecimentos] = useState([]);

  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("estabelecimentos")) || [];
    setEstabelecimentos(dados);
  }, []);

  const aplicarFiltros = () => {
    const todos = JSON.parse(localStorage.getItem("estabelecimentos")) || [];
    const filtrados = todos.filter(estab => {
      const tipo = tipoSelecionado ? estab.tipo === tipoSelecionado : true;
      const tipoMusicaOk = tipoMusicaSelecionado ? estab.tipoMusica === tipoMusicaSelecionado : true;
      const estilo = estiloSelecionado ? estab.estiloMusical === estiloSelecionado : true;
      const comodidades = comodidadesSelecionadas.length > 0
        ? comodidadesSelecionadas.every(comod => estab.comodidades.includes(comod))
        : true;
      const bairro = bairroSelecionado ? estab.bairro === bairroSelecionado : true;
      return tipo && tipoMusicaOk && estilo && comodidades && bairro;
    });
    setEstabelecimentos(filtrados);
    setFiltrosAbertos(false);
  };

  const limparFiltros = () => {
    setTipoSelecionado("");
    setEstiloSelecionado("");
    setComodidadesSelecionadas([]);
    setBairroSelecionado("");
    const todos = JSON.parse(localStorage.getItem("estabelecimentos")) || [];
    setEstabelecimentos(todos);
  }

  const toggleFiltros = () => setFiltrosAbertos(prev => !prev);

  return (
    <main className="main_estabelecimentos">
      <HeaderEstabelecimento onToggleFiltros={toggleFiltros} />

      <div
        className='alingn-conteudo'
    
      >
        <AnimatePresence>
          {filtrosAbertos && (
            <motion.aside
              className="filtros"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <button className="fechar-filtro" onClick={() => setFiltrosAbertos(false)}>
        <X size={32} />
      </button>
              <h2>Filtros</h2>
              <LabelTexto htmlFor="tipo" className="filtro-label" textoLabel="Tipo de bar:" />
              <SelectTipoEstabelecimento value={tipoSelecionado} onChange={setTipoSelecionado} className="filtro-input" />
              <LabelTexto htmlFor="tipoMusica" className="filtro-label" textoLabel="Tipo de som:" />
              <SelectTipoMusica value={tipoMusicaSelecionado} onChange={setTipoMusicaSelecionado} className="filtro-input" />
              <LabelTexto htmlFor="estilo" className="filtro-label" textoLabel="Estilo musical:" />
              <SelectEstiloMusical value={estiloSelecionado} onChange={setEstiloSelecionado} className="filtro-input" />
              <LabelTexto htmlFor="bairro" className="filtro-label" textoLabel="Bairro:" />
              <SelectInternoBairros value={bairroSelecionado} onChange={setBairroSelecionado} className="filtro-input" />
              <Comodidades value={comodidadesSelecionadas} onChange={setComodidadesSelecionadas} />
              <div className="botoes-filtros">
                <button className="btn-aplicar" onClick={aplicarFiltros}>Aplicar filtros</button>
                <button className="btn-limpeza" onClick={limparFiltros}>Limpar filtros</button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <section id="estabelecimentos" className="lista-estabelecimentos">
          {estabelecimentos.length === 0 ? (
       <div className={`mensagem-vazia${!filtrosAbertos ? " centralizada" : ""}`}>
  Nenhum estabelecimento registrado.
</div>
          ) : (
            <CardEstabelecimentos estabelecimentos={estabelecimentos} usuario={usuario} />
          )}
        </section>
      </div>
    </main>
  );
}

export default Estabelecimentos;