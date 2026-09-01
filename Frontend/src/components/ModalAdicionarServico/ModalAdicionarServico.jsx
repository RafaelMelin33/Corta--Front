import React, { useState } from "react";
import { X, Plus, Scissors } from "lucide-react";
import styles from "./ModalAdicionarServico.module.css";

const DURACOES = ["15 min", "30 min", "45 min", "1 h", "1 h 30", "2 h"];

/**
 * Modal para cadastro de um novo serviço.
 *
 * @param {boolean} open
 * @param {() => void} onClose
 * @param {(servico: {nome: string, preco: string, duracao: string, descricao: string}) => void} onAdd
 */
export default function ModalAdicionarServico({ open, onClose, onAdd }) {
    const [nome, setNome] = useState("");
    const [preco, setPreco] = useState("");
    const [duracao, setDuracao] = useState("30 min");
    const [descricao, setDescricao] = useState("");

    if (!open) return null;

    const podeAdicionar = nome.trim().length > 0;

    const handleAdd = () => {
        if (!podeAdicionar) return;
        onAdd({ nome: nome.trim(), preco, duracao, descricao });
        setNome("");
        setPreco("");
        setDuracao("30 min");
        setDescricao("");
    };

    return (
        <div role="dialog" aria-modal="true" className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.fechar} onClick={onClose} aria-label="Fechar">
                    <X size={20} />
                </button>

                <h2 className={styles.titulo}>Adicionar Serviço</h2>
                <div className={styles.regua} />

                <label className={styles.label} htmlFor="nome-servico">
                    Nome do Serviço
                </label>
                <input
                    id="nome-servico"
                    className={`${styles.input} ${styles.campoNome}`}
                    placeholder="Ex: Corte Degradê"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />

                <div className={styles.linhaDupla}>
                    <div>
                        <label className={styles.label} htmlFor="preco-servico">
                            Preço (R$)
                        </label>
                        <input
                            id="preco-servico"
                            className={styles.input}
                            placeholder="00,00"
                            inputMode="decimal"
                            value={preco}
                            onChange={(e) => setPreco(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className={styles.label} htmlFor="duracao-servico">
                            Duração
                        </label>
                        <select
                            id="duracao-servico"
                            className={styles.select}
                            value={duracao}
                            onChange={(e) => setDuracao(e.target.value)}
                        >
                            {DURACOES.map((d) => (
                                <option key={d} value={d}>
                                    {d}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <label className={styles.label} htmlFor="descricao-servico">
                    Descrição Breve
                </label>
                <textarea
                    id="descricao-servico"
                    className={styles.textarea}
                    placeholder="Descreva os detalhes do serviço..."
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    style={{ marginBottom: 14 }}
                />

                <div className={styles.dica}>
                    <Scissors size={16} color="var(--cor-destaque)" />
                    Personalize os detalhes para seus clientes.
                </div>

                <button className={styles.botaoPrimario} onClick={handleAdd} disabled={!podeAdicionar}>
                    <Plus size={16} /> ADICIONAR
                </button>
                <button className={styles.botaoCancelar} onClick={onClose}>
                    CANCELAR
                </button>
            </div>
        </div>
    );
}