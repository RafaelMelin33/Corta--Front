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


// ==========================================================
// ENDEREÇO DO BACKEND
// ==========================================================

const API_URL = 'http://localhost:5000';


// ==========================================================
// COMPONENTE
// ==========================================================

export default function EditarUsuario() {

    const navigate = useNavigate();


    // ==========================================================
    // DADOS DO USUÁRIO
    // ==========================================================

    const [idUsuario, setIdUsuario] = useState(null);

    const [nome, setNome] = useState('');

    const [telefone, setTelefone] = useState('');

    const [email, setEmail] = useState('');


    // ==========================================================
    // SENHA
    // ==========================================================

    const [senha, setSenha] = useState('');

    const [confirmarSenha, setConfirmarSenha] = useState('');


    // ==========================================================
    // FOTO
    // ==========================================================

    const [arquivoImagem, setArquivoImagem] = useState(null);

    const [imagem, setImagem] = useState(null);


    // ==========================================================
    // CONTROLE
    // ==========================================================

    const [carregando, setCarregando] = useState(false);

    const [verificandoLogin, setVerificandoLogin] = useState(true);


    // ==========================================================
    // MENSAGEM
    // ==========================================================

    const [mensagem, setMensagem] = useState(null);


    // ==========================================================
    // TRANSFORMAR URL DA FOTO
    // ==========================================================

    const obterUrlFoto = (
        foto,
        atualizarCache = false
    ) => {

        if (!foto) {
            return null;
        }


        // ======================================================
        // BLOB
        // ======================================================

        if (
            foto.startsWith('blob:')
        ) {

            return foto;
        }


        let url;


        // ======================================================
        // URL COMPLETA
        // ======================================================

        if (
            foto.startsWith('http://') ||
            foto.startsWith('https://')
        ) {

            url = foto;
        }


            // ======================================================
            // URL RELATIVA
        // ======================================================

        else if (
            foto.startsWith('/')
        ) {

            url = `${API_URL}${foto}`;
        }


            // ======================================================
            // SOMENTE NOME DO ARQUIVO
        // ======================================================

        else {

            url =
                `${API_URL}/uploads/perfil/${foto}`;
        }


        // ======================================================
        // EVITAR CACHE
        // ======================================================

        if (
            atualizarCache
        ) {

            url +=
                `${url.includes('?') ? '&' : '?'}t=${Date.now()}`;
        }


        return url;
    };


    // ==========================================================
    // VERIFICAR LOGIN E BUSCAR PERFIL
    // ==========================================================

    useEffect(() => {

        let ativo = true;


        const verificarUsuario = async () => {

            // ==================================================
            // BUSCAR USUÁRIO DO LOCALSTORAGE
            // ==================================================

            const usuarioSalvo =
                localStorage.getItem(
                    'usuario'
                );


            // ==================================================
            // NÃO EXISTE USUÁRIO
            // ==================================================

            if (!usuarioSalvo) {

                navigate(
                    '/login',
                    {
                        replace: true
                    }
                );

                return;
            }


            try {

                // ==================================================
                // CONVERTER JSON
                // ==================================================

                const usuario =
                    JSON.parse(
                        usuarioSalvo
                    );


                // ==================================================
                // PEGAR ID
                // ==================================================

                const id =
                    usuario.id_usuario ??
                    usuario.id ??
                    null;


                // ==================================================
                // ID INVÁLIDO
                // ==================================================

                if (!id) {

                    localStorage.removeItem(
                        'usuario'
                    );

                    navigate(
                        '/login',
                        {
                            replace: true
                        }
                    );

                    return;
                }


                if (!ativo) {
                    return;
                }


                // ==================================================
                // SALVAR ID
                // ==================================================

                setIdUsuario(id);


                // ==================================================
                // DADOS DO LOCALSTORAGE
                // ==================================================

                setNome(
                    usuario.nome || ''
                );


                setEmail(
                    usuario.email || ''
                );


                // ==================================================
                // TELEFONE
                // ==================================================

                const telefoneUsuario =
                    String(
                        usuario.telefone || ''
                    ).replace(
                        /\D/g,
                        ''
                    );


                setTelefone(
                    telefoneUsuario
                );


                // ==================================================
                // FOTO DO LOCALSTORAGE
                // ==================================================

                if (
                    usuario.foto_perfil
                ) {

                    setImagem(
                        obterUrlFoto(
                            usuario.foto_perfil,
                            true
                        )
                    );

                } else {

                    setImagem(null);
                }


                // ==================================================
                // BUSCAR PERFIL ATUALIZADO NO BACKEND
                // ==================================================

                try {

                    const dados =
                        await apiFetch(
                            `/dados-perfil/${id}`,
                            {
                                method: 'GET'
                            }
                        );


                    // ==================================================
                    // PERFIL ENCONTRADO
                    // ==================================================

                    if (
                        dados &&
                        dados.usuario
                    ) {

                        const usuarioAtualizado =
                            dados.usuario;


                        // ==================================================
                        // NOME
                        // ==================================================

                        setNome(
                            usuarioAtualizado.nome || ''
                        );


                        // ==================================================
                        // EMAIL
                        // ==================================================

                        setEmail(
                            usuarioAtualizado.email || ''
                        );


                        // ==================================================
                        // TELEFONE
                        // ==================================================

                        setTelefone(
                            String(
                                usuarioAtualizado.telefone || ''
                            ).replace(
                                /\D/g,
                                ''
                            )
                        );


                        // ==================================================
                        // FOTO
                        // ==================================================

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


                        // ==================================================
                        // ATUALIZAR LOCALSTORAGE
                        // ==================================================

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
                            JSON.stringify(
                                usuarioFinal
                            )
                        );
                    }

                } catch (error) {

                    console.error(
                        'ERRO AO BUSCAR PERFIL:',
                        error
                    );


                    // ==================================================
                    // TOKEN EXPIRADO
                    // ==================================================

                    if (
                        error.status === 401
                    ) {

                        localStorage.removeItem(
                            'usuario'
                        );

                        navigate(
                            '/login',
                            {
                                replace: true
                            }
                        );

                        return;
                    }


                    // ==================================================
                    // OUTROS ERROS
                    // ==================================================

                    if (
                        error.status !== 404
                    ) {

                        setMensagem({

                            informacao:
                                'Não foi possível atualizar os dados do perfil.',

                            tipo:
                                'erro'
                        });
                    }
                }

            } catch (error) {

                console.error(
                    'LOCALSTORAGE INVÁLIDO:',
                    error
                );


                localStorage.removeItem(
                    'usuario'
                );


                navigate(
                    '/login',
                    {
                        replace: true
                    }
                );

                return;

            } finally {

                if (ativo) {

                    setVerificandoLogin(
                        false
                    );
                }
            }
        };


        verificarUsuario();


        return () => {

            ativo = false;

        };

    }, [navigate]);


    // ==========================================================
    // ALTERAR FOTO
    // ==========================================================

    const alterarImagem = (e) => {

        const arquivo =
            e.target.files?.[0];


        if (!arquivo) {
            return;
        }


        // ======================================================
        // FORMATOS PERMITIDOS
        // ======================================================

        const tiposPermitidos = [

            'image/jpeg',

            'image/png',

            'image/webp'

        ];


        if (
            !tiposPermitidos.includes(
                arquivo.type
            )
        ) {

            setMensagem({

                informacao:
                    'Formato inválido. Use JPG, PNG ou WEBP.',

                tipo:
                    'erro'

            });

            return;
        }


        // ======================================================
        // TAMANHO
        // ======================================================

        const tamanhoMaximo =
            5 * 1024 * 1024;


        if (
            arquivo.size >
            tamanhoMaximo
        ) {

            setMensagem({

                informacao:
                    'A imagem deve ter no máximo 5 MB.',

                tipo:
                    'erro'

            });

            return;
        }


        // ======================================================
        // SALVAR ARQUIVO
        // ======================================================

        setArquivoImagem(
            arquivo
        );


        // ======================================================
        // PREVIEW
        // ======================================================

        const url =
            URL.createObjectURL(
                arquivo
            );


        setImagem(
            url
        );
    };


    // ==========================================================
    // EXCLUIR FOTO
    // ==========================================================

    const excluirImagem = async () => {

        if (!idUsuario) {

            setMensagem({

                informacao:
                    'Usuário não identificado.',

                tipo:
                    'erro'

            });

            return;
        }


        // ======================================================
        // VERIFICAR SE EXISTE FOTO
        // ======================================================

        if (
            !imagem &&
            !arquivoImagem
        ) {

            setMensagem({

                informacao:
                    'Você não possui uma foto de perfil.',

                tipo:
                    'erro'

            });

            return;
        }


        try {

            // ==================================================
            // EXCLUIR NO BACKEND
            // ==================================================

            const dados =
                await apiFetch(
                    `/excluir-foto-perfil/${idUsuario}`,
                    {
                        method: 'DELETE'
                    }
                );


            // ==================================================
            // LIMPAR ESTADOS
            // ==================================================

            setArquivoImagem(
                null
            );

            setImagem(
                null
            );


            // ==================================================
            // ATUALIZAR LOCALSTORAGE
            // ==================================================

            const usuarioAtual =
                JSON.parse(
                    localStorage.getItem(
                        'usuario'
                    )
                ) || {};


            const usuarioAtualizado = {

                ...usuarioAtual,

                foto_perfil: null

            };


            localStorage.setItem(
                'usuario',
                JSON.stringify(
                    usuarioAtualizado
                )
            );


            // ==================================================
            // MENSAGEM
            // ==================================================

            setMensagem(
                dados?.mensagem || {

                    informacao:
                        'Foto de perfil excluída com sucesso!',

                    tipo:
                        'sucesso'

                }
            );

        } catch (error) {

            console.error(
                'ERRO AO EXCLUIR FOTO:',
                error
            );


            // ==================================================
            // TOKEN EXPIRADO
            // ==================================================

            if (
                error.status === 401
            ) {

                localStorage.removeItem(
                    'usuario'
                );


                navigate(
                    '/login',
                    {
                        replace: true
                    }
                );

                return;
            }


            // ==================================================
            // FOTO NÃO ENCONTRADA
            // ==================================================

            if (
                error.status === 404
            ) {

                setImagem(null);

                setArquivoImagem(null);

                setMensagem({

                    informacao:
                        'A foto já não existe no servidor.',

                    tipo:
                        'sucesso'

                });

                return;
            }


            // ==================================================
            // ERRO
            // ==================================================

            setMensagem({

                informacao:
                    mensagemDaApi(error),

                tipo:
                    'erro'

            });
        }
    };


    // ==========================================================
    // VOLTAR
    // ==========================================================

    const voltar = () => {

        navigate('/');
    };


    // ==========================================================
    // SALVAR
    // ==========================================================

    const salvar = async (e) => {

        e.preventDefault();


        setMensagem(null);


        // ======================================================
        // VALIDAR ID
        // ======================================================

        if (!idUsuario) {

            localStorage.removeItem(
                'usuario'
            );


            navigate(
                '/login',
                {
                    replace: true
                }
            );


            return;
        }


        // ======================================================
        // VALIDAR SENHA
        // ======================================================

        if (
            senha.trim() &&
            senha !== confirmarSenha
        ) {

            setMensagem({

                informacao:
                    'As senhas não coincidem.',

                tipo:
                    'erro'

            });

            return;
        }


        setCarregando(true);


        try {

            // ==================================================
            // FORMDATA
            // ==================================================

            const formData =
                new FormData();


            // ==================================================
            // NOME
            // ==================================================

            formData.append(
                'nome',
                nome
            );


            // ==================================================
            // TELEFONE
            // ==================================================
            //
            // IMPORTANTE:
            // Remove máscara antes de enviar.
            //
            // Exemplo:
            // (18) 99999-9999
            //
            // vira:
            // 18999999999
            //
            // ==================================================

            const telefoneNumeros =
                String(
                    telefone || ''
                ).replace(
                    /\D/g,
                    ''
                );


            formData.append(
                'telefone',
                telefoneNumeros
            );


            // ==================================================
            // EMAIL
            // ==================================================

            formData.append(
                'email',
                email
                    .trim()
                    .replace(
                        /\s/g,
                        ''
                    )
            );


            // ==================================================
            // SENHA
            // ==================================================

            if (
                senha.trim()
            ) {

                formData.append(
                    'senha',
                    senha
                );
            }


            // ==================================================
            // FOTO
            // ==================================================

            if (
                arquivoImagem
            ) {

                formData.append(
                    'foto',
                    arquivoImagem
                );
            }


            // ==================================================
            // ENVIAR AO FLASK
            // ==================================================

            const dados =
                await apiFetch(
                    `/editar-usuario/${idUsuario}`,
                    {
                        method: 'PUT',
                        body: formData
                    }
                );


            // ==================================================
            // ATUALIZAR USUÁRIO
            // ==================================================

            if (
                dados &&
                dados.usuario
            ) {

                const usuarioAntigo =
                    JSON.parse(
                        localStorage.getItem(
                            'usuario'
                        )
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


                // ==================================================
                // LOCALSTORAGE
                // ==================================================

                localStorage.setItem(
                    'usuario',
                    JSON.stringify(
                        usuarioAtualizado
                    )
                );


                // ==================================================
                // CAMPOS
                // ==================================================

                setNome(
                    usuarioAtualizado.nome
                );


                setEmail(
                    usuarioAtualizado.email
                );


                setTelefone(
                    String(
                        usuarioAtualizado.telefone || ''
                    ).replace(
                        /\D/g,
                        ''
                    )
                );


                // ==================================================
                // FOTO
                // ==================================================

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


            // ==================================================
            // LIMPAR SENHA
            // ==================================================

            setSenha('');

            setConfirmarSenha('');


            // ==================================================
            // LIMPAR ARQUIVO
            // ==================================================

            setArquivoImagem(null);


            // ==================================================
            // MENSAGEM
            // ==================================================

            setMensagem(
                dados?.mensagem || {

                    informacao:
                        'Usuário editado com sucesso!',

                    tipo:
                        'sucesso'
                }
            );

        } catch (error) {

            console.error(
                'ERRO AO EDITAR USUÁRIO:',
                error
            );


            // ==================================================
            // TOKEN
            // ==================================================

            if (
                error.status === 401
            ) {

                localStorage.removeItem(
                    'usuario'
                );


                navigate(
                    '/login',
                    {
                        replace: true
                    }
                );


                return;
            }


            // ==================================================
            // ERRO
            // ==================================================

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


    // ==========================================================
    // CARREGANDO
    // ==========================================================

    if (
        verificandoLogin
    ) {

        return null;
    }


    // ==========================================================
    // TELA
    // ==========================================================

    return (

        <main
            className={
                styles.container
            }
        >

            <MensagemCard
                mensagem={
                    mensagem
                }
                fechar={() =>
                    setMensagem(null)
                }
            />


            <section
                className={
                    styles.areaEdicao
                }
            >

                {/* ==================================================
                    FOTO
                ================================================== */}

                <div
                    className={
                        styles.areaFoto
                    }
                >

                    <div
                        className={
                            styles.foto
                        }
                    >

                        {imagem ? (

                            <img
                                src={imagem}
                                alt="Foto do usuário"
                            />

                        ) : (

                            <FiImage
                                className={
                                    styles.iconeImagem
                                }
                            />

                        )}

                    </div>


                    <div
                        className={
                            styles.acoesFoto
                        }
                    >

                        {/* ==================================================
                            ALTERAR FOTO
                        ================================================== */}

                        <label
                            className={
                                styles.botaoFoto
                            }
                            title="Alterar foto"
                        >

                            <FiEdit2 />

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={
                                    alterarImagem
                                }
                            />

                        </label>


                        {/* ==================================================
                            REMOVER FOTO
                        ================================================== */}

                        <button
                            type="button"
                            className={
                                styles.botaoFoto
                            }
                            onClick={
                                excluirImagem
                            }
                            title="Remover foto"
                        >

                            <FiTrash2 />

                        </button>

                    </div>

                </div>


                {/* ==================================================
                    FORMULÁRIO
                ================================================== */}

                <div
                    className={
                        styles.areaFormulario
                    }
                >

                    <h1>
                        EDITAR SUAS INFORMAÇÕES
                    </h1>


                    <form
                        onSubmit={
                            salvar
                        }
                    >

                        {/* ==================================================
                            NOME
                        ================================================== */}

                        <div
                            className={
                                styles.grupoEntrada
                            }
                        >

                            <label htmlFor="nome">
                                Nome
                            </label>


                            <IMaskInput
                                id="nome"
                                type="text"
                                mask={
                                    /^[A-Za-zÀ-ÿ ]*$/
                                }
                                value={
                                    nome
                                }
                                onAccept={
                                    (value) =>
                                        setNome(value)
                                }
                            />

                        </div>


                        {/* ==================================================
                            TELEFONE
                        ================================================== */}

                        <div
                            className={
                                styles.grupoEntrada
                            }
                        >

                            <label htmlFor="telefone">
                                Telefone
                            </label>


                            <IMaskInput
                                id="telefone"
                                type="tel"
                                mask="(00) 0000[0]-0000"
                                value={
                                    telefone
                                }
                                onAccept={
                                    (value) =>
                                        setTelefone(
                                            value.replace(
                                                /\D/g,
                                                ''
                                            )
                                        )
                                }
                            />

                        </div>


                        {/* ==================================================
                            EMAIL
                        ================================================== */}

                        <div
                            className={
                                styles.grupoEntrada
                            }
                        >

                            <label htmlFor="email">
                                E-mail
                            </label>


                            <IMaskInput
                                id="email"
                                type="email"
                                mask={
                                    /^[\w.+-@]*$/
                                }
                                value={
                                    email
                                }
                                onAccept={
                                    (value) =>
                                        setEmail(value)
                                }
                            />

                        </div>


                        {/* ==================================================
                            SENHA
                        ================================================== */}

                        <div
                            className={
                                styles.grupoEntrada
                            }
                        >

                            <label htmlFor="senha">
                                Nova senha
                            </label>


                            <IMaskInput
                                id="senha"
                                type="password"
                                mask={
                                    /^[\s\S]*$/
                                }
                                placeholder="Digite uma nova senha"
                                value={
                                    senha
                                }
                                onAccept={
                                    (value) =>
                                        setSenha(value)
                                }
                            />

                        </div>


                        {/* ==================================================
                            CONFIRMAR SENHA
                        ================================================== */}

                        <div
                            className={
                                styles.grupoEntrada
                            }
                        >

                            <label htmlFor="confirmarSenha">
                                Confirmar nova senha
                            </label>


                            <IMaskInput
                                id="confirmarSenha"
                                type="password"
                                mask={
                                    /^[\s\S]*$/
                                }
                                placeholder="Digite a nova senha novamente"
                                value={
                                    confirmarSenha
                                }
                                onAccept={
                                    (value) =>
                                        setConfirmarSenha(value)
                                }
                            />

                        </div>


                        {/* ==================================================
                            BOTÕES
                        ================================================== */}

                        <div
                            className={
                                styles.botoes
                            }
                        >

                            <button
                                type="button"
                                className={
                                    styles.botaoVoltar
                                }
                                onClick={
                                    voltar
                                }
                            >
                                Voltar
                            </button>


                            <button
                                type="submit"
                                className={
                                    styles.botaoSalvar
                                }
                                disabled={
                                    carregando
                                }
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