import { useState } from "react";
import "./CadastroProprietario.css";
import { User, Mail, Lock, Phone } from "lucide-react";
import FundolLogin from "../../../assets/img/loginfundo.png";
import { Link } from "react-router-dom";

function isMaiorDeIdade(data_nascimento) {
  const hoje = new Date();
  const nascimento = new Date(data_nascimento);

  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();

  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }

  return idade >= 18;
}

function isCEPValido(cep) {
  cep = cep.replace(/\D/g, "");
  return /^[0-9]{8}$/.test(cep); 
}

function CadastroConsumidor({ setIsLogged }) {
  localStorage.setItem("isLogged", "false");
  setIsLogged(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [data_nascimento, setData_nascimento] = useState("");
  const [cep, setCep] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (senha !== confirmacao) {
      alert("A senha e a confirmação de senha devem ser iguais.");
      return;
    }

    if (!isMaiorDeIdade(data_nascimento)) {
      alert("É necessário ter 18 anos ou mais para cadastrar-se no sistema.");
      return;
    }

    if (!isCEPValido(cep)) {
      alert("CEP inválido. Digite um CEP com 8 números.");
      return;
    }

    await fetch("http://localhost:8081/cadastroConsumidor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        email,
        senha,
        telefone,
        data_nascimento,
        cep,
      }),
    });

    setNome("");
    setEmail("");
    setTelefone("");
    setData_nascimento("");
    setCep("");
    setSenha("");
    setConfirmacao("");
    alert("Cadastro realizado com sucesso!");
  };

  return (
    <div className="estabelecimento-container">
      <div className="estabelecimento-img-side">
        <img src={FundolLogin} alt="Bar" />
      </div>
      <div className="estabelecimento-form-side">
        <h2>Cadastro do Consumidor</h2>
        <p>Bora descobrir novos bares e deixar a diversão te guiar!</p>
        <form onSubmit={handleSubmit}>
          <div className="estabelecimento-inputCentro">
            <label>Nome:</label>
            <input
              type="text"
              placeholder="Ex: Maria"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <User size={18} />
          </div>
          <div className="estabelecimento-inputCentro">
            <label>E-mail:</label>
            <input
              type="email"
              placeholder="@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Mail size={18} />
          </div>
          <div className="estabelecimento-inputCentro">
            <label>Telefone:</label>
            <input
              type="text"
              placeholder="DDD + número de telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
            <Phone size={18} />
          </div>
          <div className="estabelecimento-inputCentro">
            <label>Data de nascimento:</label>
            <input
              type="date"
              value={data_nascimento}
              onChange={(e) => setData_nascimento(e.target.value)}
            />
          </div>
          <div className="estabelecimento-inputCentro">
            <label>CEP do seu endereço:</label>
            <input
              type="text"
              placeholder="Digite um cep válido"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
            />
            <Mail size={18} />
          </div>
          <div className="estabelecimento-inputCentro">
            <label>Senha:</label>
            <input
              type="password"
              placeholder="Mínimo de 8 caracteres"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <Lock size={18} />
          </div>
          <div className="estabelecimento-inputFooter">
            <label>Confirmação da Senha:</label>
            <input
              type="password"
              placeholder="Confirme sua Senha"
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
            />
            <Lock size={18} />
          </div>
          <button className="estabelecimento-btn" type="submit">
            Cadastrar
          </button>
        </form>
        <div className="estabelecimento-footer">
          <span>Já possuo Conta</span>
          <Link to={"/login"}>Login Aqui</Link>
          <span className="spaceEscolha">||</span>
          <span>Voltar para a Home</span>
          <Link to={"/"}>Voltar Aqui</Link>
        </div>
      </div>
    </div>
  );
}

export default CadastroConsumidor;
