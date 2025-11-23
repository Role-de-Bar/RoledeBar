import { useState } from 'react';
import './CadastroProprietario.css';
import { User, Mail, Lock, Key } from "lucide-react";
import FundolLogin from "../../../assets/img/loginfundo.png"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
function CadastroProprietario({ setIsLogged }) {
  const navigate = useNavigate();
  localStorage.setItem("isLogged", "false");
  setIsLogged(false);

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");

  const adicionarProprietario = async(e) => {
    e.preventDefault();
    if (senha === confirmacao) {
      const proprietariosSalvos = JSON.parse(localStorage.getItem("proprietarios")) || [];
      const novoProprietario = {
        id: Date.now(),
        nome,
        cpf,
        email,
        senha
      };

       const response = await axios.post('http://localhost:3000/auth/register', {
                    nome,
                    email,
                    senha,
                    tipo,
                });

      proprietariosSalvos.push(novoProprietario);
      localStorage.setItem("proprietarios", JSON.stringify(proprietariosSalvos));
      setNome("");
      setCpf("");
      setEmail("");
      setSenha("");
      setConfirmacao("");
      alert("Cadastro realizado com sucesso!");
    } else {
      alert("A confirmação de senha está diferente da senha.");
    }
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/auth/register', {
                nome,
                email,
                senha,
                tipo: "PROPRIETARIO"
            });
            
            alert("Cadastro realizado com sucesso!");
            navigate('/estabelecimentos/');
        } catch (error) {
            alert(error.response?.data?.message || "Erro ao cadastrar");
        }
    };
  return (
    <div className="estabelecimento-container">
      <div className="estabelecimento-img-side">
        <img src={FundolLogin} alt="Bar" />
      </div>
      <div className="estabelecimento-form-side">
        <h2>Cadastro do Proprietário</h2>
        <p>Adicione novos bares e faça a cidade ganhar ainda mais vida e movimento.</p>
        <form onSubmit={adicionarProprietario}>
          <div className="estabelecimento-row">
            <div className="estabelecimento-inputTopo">
              <label>Nome do Titular:</label>
              <input
                type="text"
                placeholder="Ex: Maria"
                value={nome}
                onChange={e => setNome(e.target.value)}
              />
              <User size={18} />
            </div>
            <div className="estabelecimento-inputTopo">
              <label>CPF do Titular:</label>
              <input
                type="text"
                placeholder="CPF"
                value={cpf}
                onChange={e => setCpf(e.target.value)}
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
                onChange={e => setEmail(e.target.value)}
              />
              <Mail size={18} />
            </div>
            <div className="estabelecimento-inputCentro">
              <label>Senha:</label>
              <input
                type="password"
                placeholder="Mínimo de 8 caracteres"
                value={senha}
                onChange={e => setSenha(e.target.value)}
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
              onChange={e => setConfirmacao(e.target.value)}
            />
            <Lock size={18} />
          </div>
          <div className="estabelecimento-actions">
            <a href="#">Esqueceu sua Senha?</a>
          </div>
          <button className="estabelecimento-btn" type="submit">Login</button>
        </form>
        <div className="estabelecimento-footer">
          <span>Já possuo Conta</span>
          <Link to={'/login'}>Login Aqui</Link>
          <span className='spaceEscolha'>||</span>
          <span>Voltar para a Home</span>
          <Link to={'/'}>Voltar Aqui</Link>
        </div>
      </div>
    </div>
  );
}

export default CadastroProprietario;