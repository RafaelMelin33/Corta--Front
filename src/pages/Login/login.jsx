import styles from './Login.module.css';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IMaskInput } from "react-imask";

import {
    apiFetch,
    mensagemDaApi
} from "../../services/api";

import MensagemCard from "../../components/MensagemCard/MensagemCard";


export default function Login() {

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const [carregando, setCarregando] = useState(false);

    const [mensagem, setMensagem] = useState(null);

    const navigate = useNavigate();


    // ==================================================
    // LOGIN
    // ==================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMensagem(null);
        setCarregando(true);

        try {

            // ==========================================
            // FAZER LOGIN
            // ==========================================

            const dados = await apiFetch(
                '/login',
                {
                    method: 'POST',

                    body: JSON.stringify({

                        email:
                            email
                                .trim()
                                .replace(/\s/g, ''),

                        senha

                    })
                }
            );


            // ==========================================
            // VERIFICAR USUÁRIO RETORNADO
            // ==========================================

            if (!dados?.usuario) {

                throw new Error(
                    'O servidor não retornou os dados do usuário.'
                );
            }


            // ==========================================
            // MONTAR USUÁRIO
            // ==========================================

            const usuario = {

                id:
                    dados.usuario.id_usuario ??
                    dados.usuario.id,

                id_usuario:
                    dados.usuario.id_usuario ??
                    dados.usuario.id,

                nome:
                    dados.usuario.nome || '',

                email:
                    dados.usuario.email || '',

                telefone:
                    dados.usuario.telefone || '',

                tipo:
                dados.usuario.tipo,

                foto_perfil:
                    dados.usuario.foto_perfil || null

            };


            // ==========================================
            // SALVAR USUÁRIO
            // ==========================================

            localStorage.setItem(
                'usuario',
                JSON.stringify(usuario)
            );


            // ==========================================
            // AVISAR O HEADER
            // ==========================================

            window.dispatchEvent(
                new Event('loginAlterado')
            );


            console.log(
                'LOGIN REALIZADO:',
                usuario
            );


            // ==========================================
            // MENSAGEM
            // ==========================================

            setMensagem(
                dados?.mensagem || {

                    informacao:
                        'Login realizado com sucesso.',

                    tipo:
                        'sucesso'

                }
            );


            const tipo = Number(usuario.tipo);
            let destino = '/barbearias-disponiveis';

            // A barbearia precisa configurar sua vitrine somente uma vez.
            if (tipo === 2) {
                try {
                    const personalizacao = await apiFetch('/barbearia/personalizacao');
                    destino = personalizacao.personalizado
                        ? '/estabelecimento'
                        : '/personalizacaobarbearia';
                } catch (erroPersonalizacao) {
                    // Se existir uma inconsistência de personalização, a
                    // barbearia ainda consegue abrir a tela para corrigir.
                    console.warn('Personalização indisponível:', erroPersonalizacao);
                    destino = '/personalizacaobarbearia';
                }
            } else if (tipo === 0) {
                destino = '/admin/usuarios';
            }

            setTimeout(() => navigate(destino), 800);


        } catch (error) {

            console.error(
                'ERRO NO LOGIN:',
                error
            );


            // ==========================================
            // EMAIL NÃO CONFIRMADO
            // ==========================================

            if (
                error.status === 403 &&
                error.dados?.email_confirmacao
            ) {

                localStorage.setItem(
                    'email_verificacao',
                    email
                        .trim()
                        .replace(/\s/g, '')
                );


                setMensagem(
                    error.dados?.mensagem || {

                        informacao:
                            'Seu e-mail ainda não foi confirmado.',

                        tipo:
                            'aviso'

                    }
                );


                setTimeout(() => {

                    navigate(
                        '/verificar-codigo'
                    );

                }, 1000);


                return;
            }


            // ==========================================
            // ERRO
            // ==========================================

            setMensagem({

                informacao:
                    mensagemDaApi(error),

                tipo:
                    'erro'

            });

        } finally {

            setCarregando(false);
        }
    };


    // ==================================================
    // JSX
    // ==================================================

    return (

        <div className={styles.container}>

            <MensagemCard
                mensagem={mensagem}
                fechar={() =>
                    setMensagem(null)
                }
            />


            {/* ==========================================
                IMAGEM
            ========================================== */}

            <div
                className={styles.imageSection}
            />


            {/* ==========================================
                FORMULÁRIO
            ========================================== */}

            <div
                className={styles.formSection}
            >

                <div
                    className={styles.loginCard}
                >

                    <h1
                        className={styles.title}
                        id='title'
                    >
                        REALIZE O LOGIN
                    </h1>


                    <form
                        onSubmit={handleSubmit}
                        className={styles.form}
                    >

                        {/* ==========================================
                            EMAIL
                        ========================================== */}

                        <div
                            className={styles.inputGroup}
                        >

                            <label
                                htmlFor="email"
                                className={styles.label}
                            >
                                Email
                            </label>

                            <IMaskInput
                                mask={
                                    /^[\w.+-@]*$/
                                }
                                type="email"
                                id="email"
                                value={email}
                                onAccept={(value) =>
                                    setEmail(value)
                                }
                                className={
                                    styles.input
                                }
                                required
                            />

                        </div>


                        {/* ==========================================
                            SENHA
                        ========================================== */}

                        <div
                            className={styles.inputGroup}
                        >

                            <label
                                htmlFor="senha"
                                className={styles.label}
                            >
                                Senha
                            </label>

                            <IMaskInput
                                mask={
                                    /^[\s\S]*$/
                                }
                                type="password"
                                id="senha"
                                value={senha}
                                onAccept={(value) =>
                                    setSenha(value)
                                }
                                className={
                                    styles.input
                                }
                                required
                            />

                        </div>


                        {/* ==========================================
                            ESQUECI SENHA
                        ========================================== */}

                        <div
                            className={
                                styles.forgotPasswordWrapper
                            }
                        >

                            <Link
                                id="btn-esqueci-senha"
                                to="/redefinirsenha"
                                className={
                                    styles.forgotPasswordLink
                                }
                            >
                                Esqueci minha Senha? Redefinir
                            </Link>

                        </div>


                        {/* ==========================================
                            ENTRAR
                        ========================================== */}

                        <button
                            id="btn-entrar"
                            type="submit"
                            className={
                                styles.btnEntrar
                            }
                            disabled={carregando}
                        >

                            {carregando
                                ? 'ENTRANDO...'
                                : 'ENTRAR'
                            }

                        </button>

                    </form>


                    {/* ==========================================
                        CADASTRO
                    ========================================== */}

                    <div
                        className={
                            styles.signupContainer
                        }
                    >

                        <p
                            className={
                                styles.signupText
                            }
                        >
                            Ainda não possui Cadastro?
                        </p>

                        <Link
                            id="btn-cadastre-se"
                            to="/cadastro"
                            className={
                                styles.btnCadastreSe
                            }
                        >
                            CADASTRE-SE
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}
