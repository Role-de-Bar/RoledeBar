import { useState } from "react";
import "./CadastroProprietario.css";
import { User, Mail, Lock, Key, Phone } from "lucide-react";
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

function isCPFValido(cpf) {
  cpf = cpf.replace(/\D/g, ""); // remove tudo que não é número

  if (cpf.length !== 11) return false;

  // impede cpfs repetidos
  if (/^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  let resto;

  // primeiro dígito
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf[i - 1]) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  // segundo dígito
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf[i - 1]) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[10])) return false;

  return true;
}

function CadastroProprietario({ setIsLogged }) {
  localStorage.setItem("isLogged", "false");
  setIsLogged(false);

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
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

    if (!isCPFValido(cpf)) {
      alert("CPF inválido. Verifique e tente novamente.");
      return;
    }

    const response = await fetch("http://localhost:8081/proprietarios/cadastro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        cpf,
        email,
        senha,
        telefone,
        data_nascimento,
        cep,
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => null);
      alert("Erro ao cadastrar: " + (text || response.statusText));
      return;
    }
    setNome("");
    setCpf("");
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
        <h2>Cadastro do Proprietário</h2>
        <p>
          Adicione novos bares e faça a cidade ganhar ainda mais vida e
          movimento.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="estabelecimento-row">
            <div className="estabelecimento-inputTopo">
              <label>Nome do Titular:</label>
              <input
                type="text"
                placeholder="Ex: Maria"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <User size={18} />
            </div>
            <div className="estabelecimento-inputTopo">
              <label>CPF do Titular:</label>
              <input
                type="text"
                placeholder="CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
              <Key size={18} />
            </div>
          </div>
          {/* <div className='estabelecimento-row'> */}
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
          {/* </div> */}
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

export default CadastroProprietario;
