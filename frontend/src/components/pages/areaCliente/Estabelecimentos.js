import "./Estabelecimentos.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Comodidades from "../../form/Comodidades";
import SelectEstiloMusical from "../../form/SelectEstiloMusical";
import SelectTipoEstabelecimento from "../../form/SelectTipoEstabelecimento";
import CardEstabelecimentos from "../../estabelecimentos/CardEstabelecimento";
import Cardapio from "../../form/Cardapio";
import HeaderEstabelecimento from "../../estabelecimentos/headerEstabelecimento";
import LabelTexto from "../../form/LabelTexto";
import SelectInternoBairros from "../../form/SelectInternoBairros";
import SelectTipoMusica from "../../form/SelectTipoMusica";
import ComodidadesFilter from "../../form/ComodidadesFiler";
import { useLogin } from "../../../contexts/LoginContext";
import { motion, AnimatePresence } from "framer-motion";

function Estabelecimentos({ setIsLogged, usuarioLogado }) {
  const { isLoggedIn } = useLogin();
  const [tipoSelecionado, setTipoSelecionado] = useState("");
  const [tipoMusicaSelecionado, setTipoMusicaSelecionado] = useState("");
  const [estiloSelecionado, setEstiloSelecionado] = useState("");
  const [comodidadesSelecionadas, setComodidadesSelecionadas] = useState([]);
  const [bairroSelecionado, setBairroSelecionado] = useState("");
  const [estabelecimentos, setEstabelecimentos] = useState([]);

  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  useEffect(() => {
    const carregarEstabelecimentos = async () => {
      // Carrega os estabelecimentos
      try {
        const resp = await fetch("http://localhost:8081/estabelecimentos/all");
        const dados = await resp.json();

        setEstabelecimentos(dados);
      } catch (error) {
        console.error("Erro ao buscar estabelecimentos:", error);
      }
    };

    carregarEstabelecimentos();
  }, []);

  const aplicarFiltros = async () => {
    try {
      const params = new URLSearchParams();

      if (tipoSelecionado)
        params.append("tipoEstabelecimento", tipoSelecionado);
      if (tipoMusicaSelecionado)
        params.append("tipoMusica", tipoMusicaSelecionado);
      if (estiloSelecionado) params.append("estiloMusical", estiloSelecionado);
      if (bairroSelecionado) params.append("bairro", bairroSelecionado);

      comodidadesSelecionadas.forEach((c) => params.append("comodidades", c));

      const resp = await fetch(
        `http://localhost:8081/estabelecimentos/filtrar?${params.toString()}`
      );

      const dados = await resp.json();

      setEstabelecimentos(Array.isArray(dados) ? dados : []);
      setFiltrosAbertos(false);
    } catch (error) {
      console.error("Erro ao aplicar filtros:", error);
    }
  };

  const limparFiltros = async () => {
    setTipoSelecionado("");
    setTipoMusicaSelecionado("");
    setEstiloSelecionado("");
    setComodidadesSelecionadas([]);
    setBairroSelecionado("");

    const resp = await fetch("http://localhost:8081/estabelecimentos/all");
    const dados = await resp.json();
    setEstabelecimentos(dados);
  };

  const toggleFiltros = () => setFiltrosAbertos((prev) => !prev);

  return (
    <main className="main_estabelecimentos">
      <HeaderEstabelecimento onToggleFiltros={toggleFiltros} />

      <div className="alingn-conteudo">
        <AnimatePresence>
          {filtrosAbertos && (
            <motion.aside
              className={`filtros${isLoggedIn ? " logado" : ""}`}
              style={{
                marginTop: isLoggedIn ? "0vh" : "10vh",
              }}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              layout
            >
              <button
                className="fechar-filtro"
                onClick={() => setFiltrosAbertos(false)}
              >
                <X size={32} />
              </button>
              <h2>Filtros</h2>
              <LabelTexto
                htmlFor="tipo"
                className="filtro-label"
                textoLabel="Tipo de bar:"
              />
              <SelectTipoEstabelecimento
                value={tipoSelecionado}
                onChange={setTipoSelecionado}
                className="filtro-input"
              />
              <LabelTexto
                htmlFor="tipoMusica"
                className="filtro-label"
                textoLabel="Tipo de som:"
              />
              <SelectTipoMusica
                value={tipoMusicaSelecionado}
                onChange={setTipoMusicaSelecionado}
                className="filtro-input"
              />
              <LabelTexto
                htmlFor="estilo"
                className="filtro-label"
                textoLabel="Estilo musical:"
              />
              <SelectEstiloMusical
                value={estiloSelecionado}
                onChange={setEstiloSelecionado}
                className="filtro-input"
              />
              <LabelTexto
                htmlFor="bairro"
                className="filtro-label"
                textoLabel="Bairro:"
              />
              <SelectInternoBairros
                value={bairroSelecionado}
                onChange={setBairroSelecionado}
                className="filtro-input"
              />
              <ComodidadesFilter
                value={comodidadesSelecionadas}
                onChange={setComodidadesSelecionadas}
              />
              <div className="botoes-filtros">
                <button className="btn-aplicar" onClick={aplicarFiltros}>
                  Aplicar filtros
                </button>
                <button className="btn-limpeza" onClick={limparFiltros}>
                  Limpar filtros
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <section id="estabelecimentos" className="lista-estabelecimentos">
          {estabelecimentos.length === 0 ? (
            <div
              className={`mensagem-vazia${
                !filtrosAbertos ? " centralizada" : ""
              }`}
            >
              Nenhum estabelecimento registrado.
            </div>
          ) : (
            <CardEstabelecimentos
              estabelecimentos={estabelecimentos}
              usuario={usuarioLogado}
            />
          )}
        </section>
      </div>
    </main>
  );
}

export default Estabelecimentos;
