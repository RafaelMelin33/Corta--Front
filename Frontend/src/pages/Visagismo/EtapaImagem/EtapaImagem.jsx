import { useRef, useState } from 'react';

import {
    FiCamera,
    FiSun,
    FiGlasses,
    FiUploadCloud,
    FiArrowLeft,
    FiImage
} from 'react-icons/fi';

import styles from './EtapaImagem.module.css';

function EtapaImagem({
                         imagem,
                         setImagem,
                         avancarEtapa
                     }) {
    const inputRef = useRef(null);
    const [arrastando, setArrastando] = useState(false);

    const selecionarImagem = (arquivo) => {
        if (!arquivo) return;

        if (!arquivo.type.startsWith('image/')) {
            return;
        }

        const url = URL.createObjectURL(arquivo);
        setImagem(url);
    };

    const handleInput = (event) => {
        selecionarImagem(event.target.files[0]);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setArrastando(false);

        const arquivo = event.dataTransfer.files[0];
        selecionarImagem(arquivo);
    };

    const abrirSeletor = () => {
        inputRef.current.click();
    };

    return (
        <section className={styles.etapa}>
            <div className={styles.topo}>
                <button className={styles.botaoVoltar}>
                    <FiArrowLeft />
                    VOLTAR
                </button>

                <button className={styles.botaoPular}>
                    PULAR
                </button>
            </div>

            <div className={styles.areaPrincipal}>
                <div className={styles.tituloArea}>
                    <h1>
                        Coloque uma imagem para
                        <br />
                        ser feito o visagismo.
                    </h1>

                    <p>
                        Envie uma foto para nossa inteligência artificial
                        analisar o formato do seu rosto.
                    </p>
                </div>

                <input
                    ref={inputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleInput}
                    className={styles.inputArquivo}
                />

                <div
                    className={`${styles.areaUpload} ${
                        arrastando ? styles.arrastando : ''
                    } ${imagem ? styles.comImagem : ''}`}
                    onDragOver={(event) => {
                        event.preventDefault();
                        setArrastando(true);
                    }}
                    onDragLeave={() => setArrastando(false)}
                    onDrop={handleDrop}
                    onClick={abrirSeletor}
                >
                    {imagem ? (
                        <div className={styles.preview}>
                            <img src={imagem} alt="Pré-visualização" />

                            <div className={styles.overlayImagem}>
                                <FiImage />
                                <span>Clique para trocar a imagem</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={styles.iconeUpload}>
                                <FiCamera />
                            </div>

                            <strong>
                                Arraste e solte a sua foto aqui ou clique para navegar
                            </strong>

                            <span>
                                (Formatos suportados: PNG, JPG)
                            </span>
                        </>
                    )}
                </div>

                <div className={styles.dicas}>
                    <div className={styles.dica}>
                        <div className={styles.iconeDica}>
                            <FiCamera />
                        </div>

                        <strong>Olhe Para Frente</strong>
                    </div>

                    <div className={styles.dica}>
                        <div className={styles.iconeDica}>
                            <FiSun />
                        </div>

                        <strong>Boa Iluminação</strong>
                    </div>

                    <div className={styles.dica}>
                        <div className={styles.iconeDica}>
                            <FiGlasses />
                        </div>

                        <strong>Sem Acessórios</strong>
                    </div>
                </div>

                <button
                    className={styles.botaoAnalise}
                    onClick={avancarEtapa}
                    disabled={!imagem}
                >
                    Analisar Meu Rosto com IA
                </button>
            </div>
        </section>
    );
}

export default EtapaImagem;