import { useState } from 'react';

import EtapaImagem from './EtapaImagem/EtapaImagem';
import EtapaResultado from './EtapaResultado/EtapaResultado';

import styles from './Visagismo.module.css';

function Visagismo() {
    const [etapa, setEtapa] = useState(1);
    const [imagem, setImagem] = useState(null);
    const [corteSelecionado, setCorteSelecionado] = useState(null);

    const avancarEtapa = () => {
        if (!imagem) return;

        setEtapa(2);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const voltarEtapa = () => {
        setEtapa(1);

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const selecionarCorte = (corte) => {
        setCorteSelecionado(corte);
    };

    const confirmarSelecao = () => {
        if (!corteSelecionado) return;

        console.log('Corte selecionado:', corteSelecionado);

        // Aqui você poderá enviar a escolha para o backend
    };

    return (
        <div className={styles.pagina}>

            <main className={styles.conteudo}>
                <div className={styles.indicadorEtapas}>
                    <span className={etapa === 1 ? styles.ativa : ''}></span>
                    <span className={etapa === 2 ? styles.ativa : ''}></span>
                </div>

                {etapa === 1 && (
                    <EtapaImagem
                        imagem={imagem}
                        setImagem={setImagem}
                        avancarEtapa={avancarEtapa}
                    />
                )}

                {etapa === 2 && (
                    <EtapaResultado
                        imagem={imagem}
                        corteSelecionado={corteSelecionado}
                        selecionarCorte={selecionarCorte}
                        voltarEtapa={voltarEtapa}
                        confirmarSelecao={confirmarSelecao}
                    />
                )}
            </main>

        </div>
    );
}

export default Visagismo;