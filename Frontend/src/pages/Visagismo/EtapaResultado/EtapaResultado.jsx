import {
    FiArrowLeft,
    FiCheck,
    FiUser
} from 'react-icons/fi';

import styles from './EtapaResultado.module.css';

const cortes = [
    {
        id: 1,
        nome: 'High Fade com Topete Texturizado',
        descricao:
            'Cria altura no topo, desviando a atenção da mandíbula e deixando o rosto visualmente mais alongado.',
        imagem:
            'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 2,
        nome: 'Social com Franja',
        descricao:
            'Suaviza os ângulos da mandíbula com volume lateral assimétrico e textura.',
        imagem:
            'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=500&q=80'
    },
    {
        id: 3,
        nome: 'Undercut/High Fade com Topete',
        descricao:
            'Cria uma linha vertical forte no topo, quebrando a forma quadrada e proporcionando uma aparência mais limpa.',
        imagem:
            'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=500&q=80'
    }
];

function EtapaResultado({
                            imagem,
                            corteSelecionado,
                            selecionarCorte,
                            voltarEtapa,
                            confirmarSelecao
                        }) {
    return (
        <section className={styles.etapa}>
            <div className={styles.topo}>
                <button
                    className={styles.botaoVoltar}
                    onClick={voltarEtapa}
                >
                    <FiArrowLeft />
                    VOLTAR
                </button>
            </div>

            <div className={styles.cabecalho}>
                <h1>
                    Nossa Análise de Visagismo Recomendada
                </h1>

                <p>
                    3 Opções de Cortes de Cabelo Ideal para seu Formato de Rosto
                </p>
            </div>

            <div className={styles.resultado}>
                <div className={styles.rostoOriginal}>
                    {imagem ? (
                        <img
                            src={imagem}
                            alt="Rosto analisado"
                        />
                    ) : (
                        <div className={styles.semImagem}>
                            <FiUser />
                        </div>
                    )}

                    <span>
                        Formato
                        <br />
                        Quadrado
                    </span>
                </div>

                <div className={styles.cortes}>
                    {cortes.map((corte) => {
                        const selecionado =
                            corteSelecionado?.id === corte.id;

                        return (
                            <button
                                key={corte.id}
                                className={`${styles.cardCorte} ${
                                    selecionado
                                        ? styles.selecionado
                                        : ''
                                }`}
                                onClick={() => selecionarCorte(corte)}
                            >
                                <div className={styles.imagemCorte}>
                                    <img
                                        src={corte.imagem}
                                        alt={corte.nome}
                                    />

                                    {selecionado && (
                                        <div className={styles.check}>
                                            <FiCheck />
                                        </div>
                                    )}
                                </div>

                                <div className={styles.infoCorte}>
                                    <h2>{corte.nome}</h2>

                                    <p>{corte.descricao}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className={styles.acoes}>
                <button
                    className={styles.botaoVoltarAnalise}
                    onClick={voltarEtapa}
                >
                    Voltar para Análise
                </button>

                <button
                    className={styles.botaoConfirmar}
                    disabled={!corteSelecionado}
                    onClick={confirmarSelecao}
                >
                    Confirmar Seleção
                </button>
            </div>
        </section>
    );
}

export default EtapaResultado;