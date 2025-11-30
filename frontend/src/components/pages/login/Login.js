import "./Login.css";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  StepConnector,
  setRef,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import InputTexto from "../../form/InputTexto";
import LabelTexto from "../../form/LabelTexto";
import FundolLogin from "../../../assets/img/loginfundo.png";
import FundolLoginMobile from "../../../assets/img/MobileFundo.png";
import { User, Store, Mail, LockKeyhole, LogOut } from "lucide-react";

function Login({ setIsLogged, setUsuarioLogado }) {
  useEffect(() => {
    localStorage.setItem("isLogged", "false");
    setIsLogged(false);
  }, []);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [open, setOpen] = useState(false);
  const [cadDialog, setCadDialog] = useState(false);

  const handleCadOpen = () => setCadDialog(true);
  const handleCadClose = () => setCadDialog(false);

  const [inputValue, setInputValue] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = (event) => setInputValue(event.target.value);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    alert("Foram enviadas instruções para o e-mail informado.");
    event.preventDefault();
    console.log("Email:", inputValue);
    handleClose();
  };

  const useRedirecionar = () => {
    handleCadClose();
    if (inputValue === "consumidor") {
      navigate("/cadastroConsumidor", { state: { inputValue } });
    } else if (inputValue === "proprietario") {
      navigate("/cadastroProprietario", { state: { inputValue } });
    }
  };

  const verificaDadosLogin = (email, senha) => {
    const consumidores = JSON.parse(localStorage.getItem("consumidores")) || [];
    const proprietarios =
      JSON.parse(localStorage.getItem("proprietarios")) || [];

    const consumidor = consumidores.find(
      (user) => user.email === email && user.senha === senha
    );
    if (consumidor) return { tipo: "consumidor", usuario: consumidor };

    const proprietario = proprietarios.find(
      (user) => user.email === email && user.senha === senha
    );
    if (proprietario) return { tipo: "proprietario", usuario: proprietario };

    return null;
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8081/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        return alert(data.erro || "Email ou senha inválidos");
      }

      // Salva token e o usuário no armazenamento
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuarioLogado", JSON.stringify(data.usuario));

      const user = data.usuario;
      
      setIsLogged(true);
      localStorage.setItem("isLogged", "true");

      // Dispara evento customizado para notificar header e outros componentes
      window.dispatchEvent(new Event('usuarioLogadoAtualizado'));

      navigate("/estabelecimentos", { state: { usuario: user } });
    } catch (error) {
      alert(error.response?.data?.message || "Email ou senha inválidos");
    }
  };

  return (
    <main className="main_login">
      <section className="section_login">
        <div className="imgLoginfundo">
          <img src={FundolLogin} alt="fundo de login" />
        </div>

        <article className="artigo_form">
          <div className="imgLoginfundoMobile">
            <img src={FundolLoginMobile} alt="fundo de login mobile" />
          </div>

          <article className="artigo_loginText">
            <h2>Seja bem-vindo(a)!</h2>
            <p>Bora descobrir novos bares?</p>
          </article>
          <form className="form_login" onSubmit={login}>
            <div className="div-email">
              <LabelTexto for="email" textoLabel="E-mail:" />
              <br />

              <div>
                <Mail className="iconeInput" size={20} />
                <InputTexto
                  type="email"
                  id="email"
                  placeholder="@example.com"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="div-senha">
              <LabelTexto for="senha" textoLabel="Senha" />
              <br />
              <div>
                <LockKeyhole className="iconeInput" size={20} />
                <InputTexto
                  type="password"
                  id="senha"
                  name="senha"
                  placeholder="Minimo de 8 caracteres"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit">Entrar</button>
            <div className="div-logout">
              <a href="/" onClick={() => {}}>
                <LogOut className="iconeLogout" size={25} />
              </a>
            </div>
          </form>
          <div className="links_cadastro_recuperacao">
            <div id="recuperar_senha">
              {/* <a href="#" onClick={handleOpen}>
                Esqueceu sua senha ?
              </a> */}
            </div>
            <div id="fazer_cadastro">
              <a href="#" onClick={handleCadOpen}>
                Não tem uma conta ?
              </a>
            </div>
          </div>

          <Dialog id="cadastre" open={cadDialog} onClose={handleCadClose}>
            <DialogTitle className="titulo-escolha">
              Selecione o tipo de usuário:
            </DialogTitle>
            <DialogContent className="tipo-usuario-container">
              <div className="botoes-escolha">
                <button
                  className={`btn-tipo ${
                    inputValue === "consumidor" ? "ativo" : ""
                  }`}
                  onClick={() => setInputValue("consumidor")}
                >
                  <User className="iconeUser" size={32} />
                  <span>Consumidor</span>
                </button>
                <button
                  className={`btn-tipo ${
                    inputValue === "proprietario" ? "ativo" : ""
                  }`}
                  onClick={() => setInputValue("proprietario")}
                >
                  <Store className="iconeUser" size={32} />
                  <span>Proprietário</span>
                </button>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCadClose}>Cancelar</Button>
              <Button onClick={useRedirecionar} disabled={!inputValue}>
                Prosseguir
              </Button>
            </DialogActions>
          </Dialog>
        </article>
      </section>
    </main>
  );
}

export default Login;
