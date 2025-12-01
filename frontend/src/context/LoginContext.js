import { createContext, useState, useContext, useEffect } from 'react';

const LoginContext = createContext();

export function LoginProvider({ children }) {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Verifica se o usuário está logado
    const logado = usuarioLogado && Object.keys(usuarioLogado).length > 0;
    setIsLoggedIn(logado);
  }, [usuarioLogado]);

  const logout = () => {
    setUsuarioLogado(null);
    setIsLoggedIn(false);
  };

  return (
    <LoginContext.Provider value={{ usuarioLogado, setUsuarioLogado, isLoggedIn, logout }}>
      {children}
    </LoginContext.Provider>
  );
}

export function useLogin() {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error('useLogin deve ser usado dentro de LoginProvider');
  }
  return context;
}
