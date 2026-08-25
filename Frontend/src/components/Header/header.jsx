import estilo from "./Header.module.css";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    useEffect,
    useState
} from "react";

import {
    FiUser,
    FiMenu,
    FiX
} from "react-icons/fi";

const API_URL = "http://localhost:5000";

export default function Header() {

    const navigate = useNavigate();

    // ==========================================================
    // ESTADOS
    // ==========================================================

    const [logado, setLogado] = useState(false);
    const [fotoPerfil, setFotoPerfil] = useState(null);
    const [nomeUsuario, setNomeUsuario] = useState("");
    const [menuAberto, setMenuAberto] = useState(false);


    // ==========================================================
    // URL DA FOTO
    // ==========================================================

    const obterUrlFoto = (
        foto,
        atualizarCache = false
    ) => {

        if (!foto) {
            return null;
        }


        if (foto.startsWith("blob:")) {
            return foto;
        }


        let url;


        if (
            foto.startsWith("http://") ||
            foto.startsWith("https://")
        ) {

            url = foto;

        } else if (
            foto.startsWith("/")
        ) {

            url = `${API_URL}${foto}`;

        } else {

            url =
                `${API_URL}/uploads/perfil/${foto}`;

        }


        // ==================================================
        // CACHE BUSTING
        // ==================================================
        // Mesmo se a imagem nova tiver o mesmo nome,
        // o navegador será obrigado a buscar novamente.

        if (atualizarCache) {

            url +=
                `${url.includes("?") ? "&" : "?"}t=${Date.now()}`;

        }


        return url;
    };


    // ==========================================================
    // VERIFICAR LOGIN
    // ==========================================================

    const verificarLogin = () => {

        try {

            const usuarioSalvo =
                localStorage.getItem("usuario");


            if (!usuarioSalvo) {

                setLogado(false);
                setFotoPerfil(null);
                setNomeUsuario("");

                return;
            }


            const usuario =
                JSON.parse(usuarioSalvo);


            const id =
                usuario?.id_usuario ??
                usuario?.id;


            if (!id) {

                setLogado(false);
                setFotoPerfil(null);
                setNomeUsuario("");

                return;
            }


            // ==================================================
            // USUÁRIO LOGADO
            // ==================================================

            setLogado(true);

            setNomeUsuario(
                usuario?.nome || ""
            );


            // ==================================================
            // FOTO
            // ==================================================

            if (
                usuario?.foto_perfil
            ) {

                setFotoPerfil(
                    obterUrlFoto(
                        usuario.foto_perfil,
                        true
                    )
                );

            } else {

                setFotoPerfil(null);

            }


        } catch (erro) {

            console.error(
                "ERRO AO VERIFICAR LOGIN:",
                erro
            );

            setLogado(false);
            setFotoPerfil(null);
            setNomeUsuario("");

        }

    };


    // ==========================================================
    // INICIALIZAÇÃO
    // ==========================================================

    useEffect(() => {

        verificarLogin();


        // ==================================================
        // ATUALIZAR HEADER
        // ==================================================

        const atualizarLogin = () => {

            verificarLogin();

        };


        // ==================================================
        // LOGIN / USUÁRIO ALTERADO
        // ==================================================

        window.addEventListener(
            "loginAlterado",
            atualizarLogin
        );


        // ==================================================
        // FOTO ALTERADA
        // ==================================================

        window.addEventListener(
            "fotoPerfilAlterada",
            atualizarLogin
        );


        // ==================================================
        // STORAGE
        // ==================================================

        window.addEventListener(
            "storage",
            atualizarLogin
        );


        // ==================================================
        // LIMPEZA
        // ==================================================

        return () => {

            window.removeEventListener(
                "loginAlterado",
                atualizarLogin
            );


            window.removeEventListener(
                "fotoPerfilAlterada",
                atualizarLogin
            );


            window.removeEventListener(
                "storage",
                atualizarLogin
            );

        };

    }, []);


    // ==========================================================
    // MENU
    // ==========================================================

    const alternarMenu = () => {

        setMenuAberto(
            atual => !atual
        );

    };


    const fecharMenu = () => {

        setMenuAberto(false);

    };


    // ==========================================================
    // PERFIL
    // ==========================================================

    const abrirPerfil = () => {

        fecharMenu();

        navigate("/EditarUsuario");

    };


    // ==========================================================
    // SAIR
    // ==========================================================

    const sair = () => {

        localStorage.removeItem("usuario");

        localStorage.removeItem("access_token");

        localStorage.removeItem("token");


        setLogado(false);

        setFotoPerfil(null);

        setNomeUsuario("");

        setMenuAberto(false);


        window.dispatchEvent(
            new Event("loginAlterado")
        );


        navigate("/login");

    };


    // ==========================================================
    // ERRO NA FOTO
    // ==========================================================

    const erroFoto = () => {

        console.warn(
            "Não foi possível carregar a foto de perfil."
        );

        setFotoPerfil(null);

    };


    // ==========================================================
    // RENDER
    // ==========================================================

    return (

        <header className={estilo.header}>

            <div className={estilo.container}>

                {/* ==================================================
                    LOGO
                ================================================== */}

                <Link
                    to="/"
                    className={estilo.logo}
                    onClick={fecharMenu}
                >

                    <img
                        src="/logopreta.png"
                        alt="Cortaê"
                    />

                </Link>


                {/* ==================================================
                    BOTÃO HAMBÚRGUER
                ================================================== */}

                <button
                    type="button"
                    className={estilo.menuMobile}
                    onClick={alternarMenu}
                    aria-label={
                        menuAberto
                            ? "Fechar menu"
                            : "Abrir menu"
                    }
                    aria-expanded={menuAberto}
                >

                    {menuAberto ? (
                        <FiX />
                    ) : (
                        <FiMenu />
                    )}

                </button>


                {/* ==================================================
                    MENU
                ================================================== */}

                <nav
                    className={`${estilo.menu} ${
                        menuAberto
                            ? estilo.menuAberto
                            : ""
                    }`}
                >

                    {/* ==================================================
                        DESLOGADO
                    ================================================== */}

                    {!logado && (

                        <>

                            <Link
                                to="/cadastro"
                                className={estilo.cadastro}
                                onClick={fecharMenu}
                            >
                                CADASTRAR
                            </Link>


                            <Link
                                to="/login"
                                className={estilo.login}
                                onClick={fecharMenu}
                            >
                                LOGIN
                            </Link>

                        </>

                    )}


                    {/* ==================================================
                        LOGADO
                    ================================================== */}

                    {logado && (

                        <>

                            <Link
                                to="/historico"
                                className={estilo.historico}
                                onClick={fecharMenu}
                            >
                                HISTÓRICO
                            </Link>


                            <button
                                type="button"
                                className={estilo.sair}
                                onClick={sair}
                            >
                                SAIR
                            </button>


                            {/* ==================================================
                                FOTO DO USUÁRIO
                            ================================================== */}

                            <button
                                type="button"
                                className={estilo.usuario}
                                onClick={abrirPerfil}
                                aria-label="Editar usuário"
                            >

                                {fotoPerfil ? (

                                    <img
                                        src={fotoPerfil}
                                        alt={
                                            nomeUsuario ||
                                            "Foto de perfil"
                                        }
                                        className={estilo.fotoPerfil}
                                        onError={erroFoto}
                                    />

                                ) : (

                                    <FiUser />

                                )}

                            </button>

                        </>

                    )}

                </nav>

            </div>

        </header>

    );

}