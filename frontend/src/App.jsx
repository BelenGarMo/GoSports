import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Inicio from "./pages/Inicio";
import LoginPage from "./pages/LoginPage";
import Registro from "./pages/Registro";
import Calendario from "./pages/Calendario";
import Resultados from "./pages/Resultados";
import Inscripciones from "./pages/Inscripciones";
import PanelCronometrista from "./pages/PanelCronometrista";
import PanelOrganizador from "./pages/PanelOrganizador";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/resultados" element={<Resultados />} />
          <Route path="/inscripciones" element={<Inscripciones />} />
          <Route path="/cronometrista" element={<PanelCronometrista />} />
          <Route path="/organizador" element={<PanelOrganizador />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;