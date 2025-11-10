import { useState } from 'react';
import './CadastroProprietario.css'; // Use o mesmo CSS para manter o padrão visual
import { User, Mail, Lock } from "lucide-react";
import FundolLogin from "../../../assets/img/loginfundo.png";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function CadastroConsumidor({ setIsLogged }) {
  const navigate = useNavigate();
  localStorage.setItem("isLogged", "false");
  setIsLogged(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");

  const adicionarConsumidor = (e) => {
    e.preventDefault();
    if (senha === confirmacao) {
      const consumidoresSalvos = JSON.parse(localStorage.getItem("consumidores")) || [];
      const novoConsumidor = {
        id: Date.now(),
        nome,
        email,
        senha
      };
      consumidoresSalvos.push(novoConsumidor);
      localStorage.setItem("consumidores", JSON.stringify(consumidoresSalvos));
      setNome("");
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
                tipo: "CONSUMIDOR"
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
        <h2>Cadastro do Consumidor</h2>
        <p>Bora descobrir novos bares e deixar a diversão te guiar!</p>
        <form onSubmit={adicionarConsumidor}>
          <div className="estabelecimento-inputCentro">
            <label>Nome:</label>
            <input
              type="text"
              placeholder="Ex: Maria"
              value={nome}
              onChange={e => setNome(e.target.value)}
            />
            <User size={18} />
          </div>
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

export default CadastroConsumidor;