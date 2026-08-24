import { useEffect, useState } from 'react';

import {
    FiEdit2,
    FiTrash2,
    FiImage
} from 'react-icons/fi';

import { IMaskInput } from 'react-imask';
import { useNavigate } from 'react-router-dom';

import styles from './EditarUsuario.module.css';

import {
    apiFetch,
    mensagemDaApi
} from '../../services/api';

import MensagemCard from '../../components/MensagemCard/MensagemCard';


const API_URL = 'http://localhost:5000';


export default function EditarUsuario() {

    const navigate = useNavigate();

    // ==============================
    // USUÁRIO
    // ==============================

    const [idUsuario, setIdUsuario] = useState(null);

    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');

    // ==============================
    // SENHA
    // ==============================

    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    // ==============================
    // FOTO
    // ==============================

    const [arquivoImagem, setArquivoImagem] = useState(null);
    const [imagem, setImagem] = useState(null);

    // ==============================
    // CONTROLE
    // ==============================

    const [carregando, setCarregando] = useState(false);
    const [verificandoLogin, setVerificandoLogin] = useState(true);

    // ==============================
    // MENSAGEM
    // ==============================

    const [mensagem, setMensagem] = useState(null);


    // ==============================
    // URL DA FOTO
    // ==============================

    const obterUrlFoto = (foto, atualizarCache = false) => {

        if (!foto) {
            return null;
        }

        if (foto.startsWith('blob:')) {
            return foto;
        }

        let url;

        if (
            foto.startsWith('http://') ||
            foto.startsWith('https://')
        ) {
            url = foto;
        }

        else if (foto.startsWith('/')) {
            url = `${API_URL}${foto}`;
        }

        else {
            url = `${API_URL}/uploads/perfil/${foto}`;
        }

        if (atualizarCache) {
            url += `${url.includes('?') ? '&' : '?'}t=${Date.now()}`;
        }

        return url;
    };


    // ==============================
    // CARREGAR USUÁRIO
    // ==============================

    useEffect(() => {

        let ativo = true;

        const carregarUsuario = async () => {

            const usuarioSalvo =
                localStorage.getItem('usuario');

            if (!usuarioSalvo) {

                navigate('/login', {
                    replace: true
                });

                return;
            }

            try {

                const usuario =
                    JSON.parse(usuarioSalvo);

                const id =
                    usuario.id_usuario ??
                    usuario.id ??
                    null;

                if (!id) {

                    localStorage.removeItem('usuario');

                    navigate('/login', {
                        replace: true
                    });

                    return;
                }

                if (!ativo) {
                    return;
                }

                setIdUsuario(id);

                setNome(usuario.nome || '');
                setEmail(usuario.email || '');

                setTelefone(
                    String(usuario.telefone || '')
                        .replace(/\D/g, '')
                );

                if (usuario.foto_perfil) {

                    setImagem(
                        obterUrlFoto(
                            usuario.foto_perfil,
                            true
                        )
                    );

                } else {

                    setImagem(null);
                }


                // ==============================
                // BUSCAR DADOS ATUALIZADOS
                // ==============================

                try {

                    const dados =
                        await apiFetch(
                            `/dados-perfil/${id}`,
                            {
                                method: 'GET'
                            }
                        );

                    if (
                        dados &&
                        dados.usuario &&
                        ativo
                    ) {

                        const usuarioAtualizado =
                            dados.usuario;

                        setNome(
                            usuarioAtualizado.nome || ''
                        );

                        setEmail(
                            usuarioAtualizado.email || ''
                        );

                        setTelefone(
                            String(
                                usuarioAtualizado.telefone || ''
                            ).replace(/\D/g, '')
                        );

                        if (
                            usuarioAtualizado.foto_perfil
                        ) {

                            setImagem(
                                obterUrlFoto(
                                    usuarioAtualizado.foto_perfil,
                                    true
                                )
                            );

                        } else {

                            setImagem(null);
                        }


                        // ==============================
                        // ATUALIZAR LOCALSTORAGE
                        // ==============================

                        const usuarioFinal = {
                            ...usuario,
                            ...usuarioAtualizado,

                            id:
                                usuarioAtualizado.id_usuario ??
                                id,

                            id_usuario:
                                usuarioAtualizado.id_usuario ??
                                id
                        };

                        localStorage.setItem(
                            'usuario',
                            JSON.stringify(usuarioFinal)
                        );
                    }

                } catch (error) {

                    console.error(
                        'ERRO AO BUSCAR PERFIL:',
                        error
                    );

                    if (error.status === 401) {

                        localStorage.removeItem('usuario');

                        navigate('/login', {
                            replace: true
                        });

                        return;
                    }

                    if (error.status !== 404) {

                        setMensagem({
                            informacao:
                                'Não foi possível carregar os dados do perfil.',
                            tipo: 'erro'
                        });
                    }
                }

            } catch (error) {

                console.error(
                    'LOCALSTORAGE INVÁLIDO:',
                    error
                );

                localStorage.removeItem('usuario');

                navigate('/login', {
                    replace: true
                });

            } finally {

                if (ativo) {
                    setVerificandoLogin(false);
                }
            }
        };

        carregarUsuario();

        return () => {
            ativo = false;
        };

    }, [navigate]);


    // ==============================
    // ALTERAR FOTO
    // ==============================

    const alterarImagem = (e) => {

        const arquivo =
            e.target.files?.[0];

        if (!arquivo) {
            return;
        }

        const tiposPermitidos = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ];

        if (!tiposPermitidos.includes(arquivo.type)) {

            setMensagem({
                informacao:
                    'Formato inválido. Use JPG, PNG ou WEBP.',
                tipo: 'erro'
            });

            e.target.value = '';

            return;
        }

        const tamanhoMaximo =
            5 * 1024 * 1024;

        if (arquivo.size > tamanhoMaximo) {

            setMensagem({
                informacao:
                    'A imagem deve ter no máximo 5 MB.',
                tipo: 'erro'
            });

            e.target.value = '';

            return;
        }

        setArquivoImagem(arquivo);

        const url =
            URL.createObjectURL(arquivo);

        setImagem(url);
    };


    // ==============================
    // EXCLUIR FOTO
    // ==============================

    const excluirImagem = async () => {

        if (!idUsuario) {

            setMensagem({
                informacao:
                    'Usuário não identificado.',
                tipo: 'erro'
            });

            return;
        }

        if (!imagem && !arquivoImagem) {

            setMensagem({
                informacao:
                    'Você não possui uma foto de perfil.',
                tipo: 'erro'
            });

            return;
        }

        try {

            const dados =
                await apiFetch(
                    `/excluir-foto-perfil/${idUsuario}`,
                    {
                        method: 'DELETE'
                    }
                );

            setArquivoImagem(null);
            setImagem(null);


            // ==============================
            // ATUALIZAR LOCALSTORAGE
            // ==============================

            const usuarioAtual =
                JSON.parse(
                    localStorage.getItem('usuario')
                ) || {};

            const usuarioAtualizado = {
                ...usuarioAtual,
                foto_perfil: null
            };

            localStorage.setItem(
                'usuario',
                JSON.stringify(usuarioAtualizado)
            );


            setMensagem(
                dados?.mensagem || {
                    informacao:
                        'Foto de perfil excluída com sucesso!',
                    tipo: 'sucesso'
                }
            );

        } catch (error) {

            console.error(
                'ERRO AO EXCLUIR FOTO:',
                error
            );

            if (error.status === 401) {

                localStorage.removeItem('usuario');

                navigate('/login', {
                    replace: true
                });

                return;
            }

            if (error.status === 404) {

                setImagem(null);
                setArquivoImagem(null);

                setMensagem({
                    informacao:
                        'A foto já não existe no servidor.',
                    tipo: 'sucesso'
                });

                return;
            }

            setMensagem({
                informacao:
                    mensagemDaApi(error),
                tipo: 'erro'
            });
        }
    };


    // ==============================
    // VOLTAR
    // ==============================

    const voltar = () => {
        navigate('/');
    };


    // ==============================
    // SALVAR
    // ==============================

    const salvar = async (e) => {

        e.preventDefault();

        setMensagem(null);

        if (!idUsuario) {

            localStorage.removeItem('usuario');

            navigate('/login', {
                replace: true
            });

            return;
        }


        // ==============================
        // VALIDAR SENHA
        // ==============================

        if (
            senha.trim() &&
            senha !== confirmarSenha
        ) {

            setMensagem({
                informacao:
                    'As senhas não coincidem.',
                tipo: 'erro'
            });

            return;
        }


        // ==============================
        // VALIDAR CAMPOS
        // ==============================

        if (!nome.trim()) {

            setMensagem({
                informacao:
                    'Informe seu nome.',
                tipo: 'erro'
            });

            return;
        }

        if (!email.trim()) {

            setMensagem({
                informacao:
                    'Informe seu e-mail.',
                tipo: 'erro'
            });

            return;
        }


        setCarregando(true);

        try {

            const formData =
                new FormData();


            // ==============================
            // DADOS
            // ==============================

            formData.append(
                'nome',
                nome.trim()
            );

            const telefoneNumeros =
                String(telefone || '')
                    .replace(/\D/g, '');

            formData.append(
                'telefone',
                telefoneNumeros
            );

            formData.append(
                'email',
                email.trim().replace(/\s/g, '')
            );


            // ==============================
            // SENHA
            // ==============================

            if (senha.trim()) {

                formData.append(
                    'senha',
                    senha
                );
            }


            // ==============================
            // FOTO
            // ==============================

            if (arquivoImagem) {

                formData.append(
                    'foto',
                    arquivoImagem
                );
            }


            // ==============================
            // BACKEND
            // ==============================

            const dados =
                await apiFetch(
                    `/editar-usuario/${idUsuario}`,
                    {
                        method: 'PUT',
                        body: formData
                    }
                );


            // ==============================
            // ATUALIZAR USUÁRIO
            // ==============================

            if (
                dados &&
                dados.usuario
            ) {

                const usuarioAntigo =
                    JSON.parse(
                        localStorage.getItem('usuario')
                    ) || {};

                const usuarioAtualizado = {

                    ...usuarioAntigo,

                    ...dados.usuario,

                    id:
                        dados.usuario.id_usuario ??
                        usuarioAntigo.id,

                    id_usuario:
                        dados.usuario.id_usuario ??
                        usuarioAntigo.id_usuario,

                    nome:
                        dados.usuario.nome ??
                        '',

                    email:
                        dados.usuario.email ??
                        '',

                    telefone:
                        dados.usuario.telefone ??
                        '',

                    foto_perfil:
                        dados.usuario.foto_perfil ??
                        usuarioAntigo.foto_perfil ??
                        null
                };


                localStorage.setItem(
                    'usuario',
                    JSON.stringify(usuarioAtualizado)
                );


                setNome(
                    usuarioAtualizado.nome
                );

                setEmail(
                    usuarioAtualizado.email
                );

                setTelefone(
                    String(
                        usuarioAtualizado.telefone || ''
                    ).replace(/\D/g, '')
                );


                if (
                    usuarioAtualizado.foto_perfil
                ) {

                    setImagem(
                        obterUrlFoto(
                            usuarioAtualizado.foto_perfil,
                            true
                        )
                    );

                } else {

                    setImagem(null);
                }
            }


            // ==============================
            // LIMPAR
            // ==============================

            setSenha('');
            setConfirmarSenha('');
            setArquivoImagem(null);


            // ==============================
            // MENSAGEM
            // ==============================

            setMensagem(
                dados?.mensagem || {
                    informacao:
                        'Usuário editado com sucesso!',
                    tipo: 'sucesso'
                }
            );

        } catch (error) {

            console.error(
                'ERRO AO EDITAR USUÁRIO:',
                error
            );

            if (error.status === 401) {

                localStorage.removeItem('usuario');

                navigate('/login', {
                    replace: true
                });

                return;
            }

            setMensagem({
                informacao:
                    mensagemDaApi(error),
                tipo: 'erro'
            });

        } finally {

            setCarregando(false);
        }
    };


    // ==============================
    // CARREGANDO
    // ==============================

    if (verificandoLogin) {
        return null;
    }


    // ==============================
    // TELA
    // ==============================

    return (

        <main className={styles.container}>

            <MensagemCard
                mensagem={mensagem}
                fechar={() => setMensagem(null)}
            />


            {/* ==========================
                FOTO
            ========================== */}

            <section className={styles.areaEdicao}>

                <div className={styles.areaFoto}>

                    <div className={styles.foto}>

                        {imagem ? (

                            <img
                                src={imagem}
                            />

                        ) : (

                            <FiImage
                                className={styles.iconeImagem}
                            />

                        )}

                    </div>


                    <div className={styles.acoesFoto}>

                        <label
                            className={styles.botaoFoto}
                            title="Alterar foto"
                        >

                            <FiEdit2 />

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={alterarImagem}
                            />

                        </label>


                        <button
                            type="button"
                            className={styles.botaoFoto}
                            onClick={excluirImagem}
                            title="Remover foto"
                        >

                            <FiTrash2 />

                        </button>

                    </div>

                </div>


                {/* ==========================
                    FORMULÁRIO
                ========================== */}

                <div className={styles.areaFormulario}>

                    <h1>
                        EDITAR SUAS INFORMAÇÕES
                    </h1>


                    <form onSubmit={salvar}>

                        {/* NOME */}

                        <div className={styles.grupoEntrada}>

                            <label htmlFor="nome">
                                Nome
                            </label>

                            <input
                                id="nome"
                                type="text"
                                value={nome}
                                onChange={(e) =>
                                    setNome(e.target.value)
                                }
                                required
                            />

                        </div>


                        {/* TELEFONE */}

                        <div className={styles.grupoEntrada}>

                            <label htmlFor="telefone">
                                Telefone
                            </label>

                            <IMaskInput
                                id="telefone"
                                type="tel"
                                mask="(00) 0000[0]-0000"
                                value={telefone}
                                unmask={true}
                                onAccept={(value) =>
                                    setTelefone(value)
                                }
                            />

                        </div>


                        {/* EMAIL */}

                        <div className={styles.grupoEntrada}>

                            <label htmlFor="email">
                                E-mail
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />

                        </div>


                        {/* SENHA */}

                        <div className={styles.grupoEntrada}>

                            <label htmlFor="senha">
                                Nova senha
                            </label>

                            <input
                                id="senha"
                                type="password"
                                placeholder="Digite uma nova senha"
                                value={senha}
                                onChange={(e) =>
                                    setSenha(e.target.value)
                                }
                            />

                        </div>


                        {/* CONFIRMAR SENHA */}

                        <div className={styles.grupoEntrada}>

                            <label htmlFor="confirmarSenha">
                                Confirmar nova senha
                            </label>

                            <input
                                id="confirmarSenha"
                                type="password"
                                placeholder="Digite a nova senha novamente"
                                value={confirmarSenha}
                                onChange={(e) =>
                                    setConfirmarSenha(e.target.value)
                                }
                            />

                        </div>


                        {/* BOTÕES */}

                        <div className={styles.botoes}>

                            <button
                                type="button"
                                className={styles.botaoVoltar}
                                onClick={voltar}
                            >
                                Voltar
                            </button>

                            <button
                                type="submit"
                                className={styles.botaoSalvar}
                                disabled={carregando}
                            >

                                {carregando
                                    ? 'Salvando...'
                                    : 'Salvar'
                                }

                            </button>

                        </div>

                    </form>

                </div>

            </section>

        </main>
    );
}