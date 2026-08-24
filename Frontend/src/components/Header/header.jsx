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


export default function Header() {

    const navigate = useNavigate();


    // ==========================================================
    // ESTADOS
    // ==========================================================

    const [logado, setLogado] = useState(false);

    const [menuAberto, setMenuAberto] = useState(false);


    // ==========================================================
    // VERIFICAR LOGIN
    // ==========================================================

    const verificarLogin = () => {

        try {

            const usuarioSalvo =
                localStorage.getItem("usuario");


            // ------------------------------------------
            // NÃO ESTÁ LOGADO
            // ------------------------------------------

            if (!usuarioSalvo) {

                setLogado(false);

                return;

            }


            // ------------------------------------------
            // CONVERTER USUÁRIO
            // ------------------------------------------

            const usuario =
                JSON.parse(usuarioSalvo);


            // ------------------------------------------
            // PEGAR ID
            // ------------------------------------------

            const id =
                usuario?.id_usuario ??
                usuario?.id;


            // ------------------------------------------
            // USUÁRIO INVÁLIDO
            // ------------------------------------------

            if (!id) {

                setLogado(false);

                return;

            }


            // ------------------------------------------
            // USUÁRIO LOGADO
            // ------------------------------------------

            setLogado(true);


        } catch (erro) {

            console.error(
                "ERRO AO VERIFICAR LOGIN:",
                erro
            );

            setLogado(false);

        }

    };


    // ==========================================================
    // INICIALIZAÇÃO
    // ==========================================================

    useEffect(() => {

        verificarLogin();


        // ------------------------------------------
        // ATUALIZAR LOGIN
        // ------------------------------------------

        const atualizarLogin = () => {

            verificarLogin();

        };


        window.addEventListener(
            "loginAlterado",
            atualizarLogin
        );


        window.addEventListener(
            "storage",
            atualizarLogin
        );


        // ------------------------------------------
        // LIMPEZA
        // ------------------------------------------

        return () => {

            window.removeEventListener(
                "loginAlterado",
                atualizarLogin
            );


            window.removeEventListener(
                "storage",
                atualizarLogin
            );

        };

    }, []);


    // ==========================================================
    // ABRIR / FECHAR MENU
    // ==========================================================

    const alternarMenu = () => {

        setMenuAberto(
            atual => !atual
        );

    };


    // ==========================================================
    // FECHAR MENU
    // ==========================================================

    const fecharMenu = () => {

        setMenuAberto(false);

    };


    // ==========================================================
    // ABRIR PERFIL
    // ==========================================================

    const abrirPerfil = () => {

        fecharMenu();

        navigate("/EditarUsuario");

    };


    // ==========================================================
    // SAIR
    // ==========================================================

    const sair = () => {

        // ------------------------------------------
        // REMOVER USUÁRIO
        // ------------------------------------------

        localStorage.removeItem(
            "usuario"
        );


        // ------------------------------------------
        // REMOVER TOKEN
        // ------------------------------------------

        localStorage.removeItem(
            "access_token"
        );


        localStorage.removeItem(
            "token"
        );


        // ------------------------------------------
        // ATUALIZAR ESTADO
        // ------------------------------------------

        setLogado(false);


        // ------------------------------------------
        // FECHAR MENU
        // ------------------------------------------

        setMenuAberto(false);


        // ------------------------------------------
        // AVISAR O SISTEMA
        // ------------------------------------------

        window.dispatchEvent(
            new Event("loginAlterado")
        );


        // ------------------------------------------
        // IR PARA LOGIN
        // ------------------------------------------

        navigate("/login");

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
                    className={`
                        ${estilo.menu}
                        ${menuAberto ? estilo.menuAberto : ""}
                    `}
                >


                    {/* ==================================================
                        USUÁRIO DESLOGADO
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
                        USUÁRIO LOGADO
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
                                PERFIL
                            ================================================== */}

                            <button
                                type="button"
                                className={estilo.usuario}
                                onClick={abrirPerfil}
                                aria-label="Editar usuário"
                            >

                                <FiUser />

                            </button>

                        </>

                    )}

                </nav>

            </div>

        </header>

    );

}