import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Leemos del localStorage o dejamos null si no existe
  const [usuario, setUsuario] = useState(() => {
    const stored = localStorage.getItem('gosports_usuario');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('gosports_token') || null;
  });

  // Cuando cambie “usuario” o “token”, los sincronizamos con localStorage
  useEffect(() => {
    if (usuario && token) {
      localStorage.setItem('gosports_usuario', JSON.stringify(usuario));
      localStorage.setItem('gosports_token', token);
    }
  }, [usuario, token]);

  const login = (datosUsuario, tokenRecibido) => {
    setUsuario(datosUsuario);
    setToken(tokenRecibido);
  };

  const logout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem('gosports_usuario');
    localStorage.removeItem('gosports_token');
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
