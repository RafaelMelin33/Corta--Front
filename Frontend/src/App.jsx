import { Routes, Route } from 'react-router-dom';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Cadastro from './pages/Cadastro/Cadastro';
import RedefinirSenha from './pages/RedefinacaoSenha/RedefinacaoSenha';
import EditarUsuario from './pages/EditarUsuario/EditarUsuario';
import VerificarCodigo from './pages/VerificarCodigo/VerificarCodigo';
import Estabelecimento from './pages/Estabelecimento/Estabelecimento';
import BarbeariasDisponiveis from './pages/BarbeariasDisponiveis/BarbeariasDisponiveis';
import Erro from "./pages/Erro/Erro";

export default function App() {
    return (
        <>
            <Header />

            <Routes>
                <Route
                    path="/*"
                    element={<Erro />}
                />
                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/cadastro"
                    element={<Cadastro />}
                />

                <Route
                    path="/redefinirsenha"
                    element={<RedefinirSenha />}
                />

                <Route
                    path="/editarusuario"
                    element={<EditarUsuario />}
                />

                <Route
                    path="/verificar-codigo"
                    element={<VerificarCodigo />}
                />

                <Route
                    path="/estabelecimento"
                    element={<Estabelecimento />}
                />

                <Route
                    path="/barbearias-disponiveis"
                    element={<BarbeariasDisponiveis />}
                />
            </Routes>

            <Footer />
        </>
    );
}