import { useState } from "react";
import { X, Plus, Scissors } from "lucide-react";
import styles from "./ModalAdicionarServico.module.css";

const DURACOES = [
    { label: "15 min", value: 15 }, { label: "30 min", value: 30 },
    { label: "45 min", value: 45 }, { label: "1 h", value: 60 },
    { label: "1 h 30", value: 90 }, { label: "2 h", value: 120 },
];

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
    const [duracao, setDuracao] = useState(30);
    const [descricao, setDescricao] = useState("");

    if (!open) return null;

    const podeAdicionar = nome.trim().length > 0 && Number(preco.replace(',', '.')) >= 0;

    const handleAdd = async () => {
        if (!podeAdicionar) return;
        try {
            await onAdd({ nome: nome.trim(), preco, duracao, descricao: descricao.trim() });
        } catch {
            return;
        }
        setNome("");
        setPreco("");
        setDuracao(30);
        setDescricao("");
    };

    return (
        <div role="dialog" aria-modal="true" className={styles.overlay} onClick={onClose}>
            <form className={styles.modal} onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); handleAdd(); }}>
                <button type="button" className={styles.fechar} onClick={onClose} aria-label="Fechar">
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
                    onChange={(e) => setPreco(e.target.value.replace(/[^0-9,.]/g, ''))}
                    required
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
                                <option key={d.value} value={d.value}>
                                    {d.label}
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

                <button type="submit" className={styles.botaoPrimario} disabled={""}>
                    <Plus size={16} /> ADICIONAR
                </button>
                <button type="button" className={styles.botaoCancelar} onClick={onClose}>
                    CANCELAR
                </button>
            </form>
        </div>
    );
}
