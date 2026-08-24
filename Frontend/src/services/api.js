export const API_URL =
    import.meta.env.VITE_API_URL || 'http://10.92.11.50:5000';


export async function apiFetch(endpoint, options = {}) {

    const headers = {
        ...(options.headers || {})
    };

    // ======================================================
    // SE NÃO FOR FormData, ENVIA JSON
    // ======================================================

    if (!(options.body instanceof FormData)) {

        headers['Content-Type'] =
            'application/json';
    }

    const resposta = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,

            credentials: 'include',

            headers
        }
    );

    const texto =
        await resposta.text();

    let dados = {};

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


export function mensagemDaApi(erro) {

    return (

        erro?.dados?.mensagem?.informacao ||

        erro?.dados?.erro?.informacao ||

        erro?.dados?.erro ||

        erro?.message ||

        'Ocorreu um erro ao comunicar com o servidor.'
    );
}