// ==========================================================
// URL DA API
// ==========================================================

const API_HOST = window.location.hostname;

export const API_URL =
    import.meta.env.VITE_API_URL ||
    `http://${API_HOST}:5000`;


// ==========================================================
// API FETCH
// ==========================================================

export async function apiFetch(endpoint, options = {}) {

    const headers = {
        ...(options.headers || {})
    };


    // ======================================================
    // JSON
    // ======================================================

    if (
        options.body &&
        !(options.body instanceof FormData)
    ) {

        headers['Content-Type'] =
            'application/json';
    }


    // ======================================================
    // REQUISIÇÃO
    // ======================================================

    const resposta = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,

            // IMPORTANTE:
            // permite o envio automático do cookie
            credentials: 'include',

            headers
        }
    );


    // ======================================================
    // LER RESPOSTA
    // ======================================================

    const texto =
        await resposta.text();

    let dados;


    try {

        dados =
            texto
                ? JSON.parse(texto)
                : {};

    } catch {

        dados = {

            mensagem: {

                informacao:
                    texto ||
                    'Resposta inválida do servidor.',

                tipo:
                    'erro'
            }
        };
    }


    // ======================================================
    // TRATAR ERRO HTTP
    // ======================================================

    if (!resposta.ok) {

        const erro =
            new Error(

                dados?.mensagem?.informacao ||

                dados?.erro?.informacao ||

                dados?.erro ||

                'Não foi possível concluir a operação.'
            );

        erro.status =
            resposta.status;

        erro.dados =
            dados;

        throw erro;
    }


    return dados;
}


// ==========================================================
// MENSAGEM DA API
// ==========================================================

export function mensagemDaApi(erro) {

    return (

        erro?.dados?.mensagem?.informacao ||

        erro?.dados?.erro?.informacao ||

        erro?.dados?.erro ||

        erro?.message ||

        'Ocorreu um erro ao comunicar com o servidor.'
    );
}
