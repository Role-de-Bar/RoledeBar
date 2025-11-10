import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { User, ArrowLeft, Eye, EyeOff } from "lucide-react";
import "./Perfil.css";
import React from "react";
function Perfil({ setIsLogged, usuarioLogado }) {
  const navigate = useNavigate();
  const usuario = usuarioLogado;
  const fileInputRef = React.useRef(null);

  const [nome, setNome] = useState(usuario?.nome || "");
  const [cpf, setCpf] = useState(usuario?.cpf || "");
  const [email, setEmail] = useState(usuario?.email || "");
  const [senha, setSenha] = useState(usuario?.senha || "");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [avatar, setAvatar] = useState(usuario?.avatar || null);

  useEffect(() => {
    if (!usuario) {
      setIsLogged(false);
      localStorage.setItem("isLogged", "false");
      navigate("/");
    }
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        // Atualiza o usuário no localStorage com a nova imagem
        const updatedUser = { ...usuario, avatar: reader.result };
        localStorage.setItem("usuarioLogado", JSON.stringify(updatedUser));
      };
      reader.readAsDataURL(file);
    }
  };

  // Add this function before the return statement
const excluirConta = () => {
  if (window.confirm("Tem certeza que deseja excluir sua conta?")) {
    const chave = usuario.tipo === "PROPRIETARIO" ? "proprietarios" : "consumidores";
    const lista = JSON.parse(localStorage.getItem(chave)) || [];
    
    // Remove o usuário da lista
    const novaLista = lista.filter(u => u.email !== usuario.email);
    
    // Atualiza o localStorage
    localStorage.setItem(chave, JSON.stringify(novaLista));
    localStorage.removeItem("usuarioLogado");
    localStorage.setItem("isLogged", "false");
    
    // Atualiza o estado e redireciona
    setIsLogged(false);
    navigate("/");
  }
};

  const salvarAlteracoes = (e) => {
    e.preventDefault();
    const chave = usuario.tipo === "PROPRIETARIO" ? "proprietarios" : "consumidores";
    const lista = JSON.parse(localStorage.getItem(chave)) || [];

    const usuarioAtualizado = {
      ...usuario,
      nome,
      cpf: usuario.tipo === "PROPRIETARIO" ? cpf : undefined,
      email,
      senha,
      avatar
    };

    const novaLista = lista.map(u => 
      u.email === usuario.email ? usuarioAtualizado : u
    );

    localStorage.setItem(chave, JSON.stringify(novaLista));
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioAtualizado));

    alert("Dados atualizados com sucesso!");
  };

  return (
    <main className="perfil-container">
      <header className="perfil-header">
        <button className="btn-voltar" onClick={() => navigate("/estabelecimentos")}>
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>
        <h1>Meu Perfil</h1>
      </header>

      <form className="perfil-form" onSubmit={salvarAlteracoes}>
        <div className="avatar-section">
          <div className="avatar-wrapper">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="avatar-img" />
            ) : (
              <User size={40} className="avatar-placeholder" />
            )}
            <input
              ref={fileInputRef}
              type="file"
              id="avatar-upload"
              accept="image/*"
              onChange={handleImageUpload}
              className="avatar-input"
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="avatar-label"
            >
              Alterar foto
            </button>
          </div>
        </div>

        <div className="form-section">
          <div className="input-group">
            <label>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
            />
          </div>

          {/* {usuario?.tipo === "PROPRIETARIO" && (
            <div className="input-group">
              <label>CPF</label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="Seu CPF"
              />
            </div>
          )} */}

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu email"
            />
          </div>

          <div className="input-group">
            <label>Senha</label>
            <div className="password-input">
              <input
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Sua senha"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setMostrarSenha(!mostrarSenha)}
              >
                {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        
            <div className="button-group">
                <button type="button" className="btn-excluir" onClick={excluirConta}>
            Excluir conta
          </button>
          <button type="submit" className="btn-salvar">
            Salvar alterações
          </button>
            </div>
        </div>

      </form>
    </main>
  );
}

export default Perfil;