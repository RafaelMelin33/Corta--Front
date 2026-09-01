import React from "react";
import { Palette } from "lucide-react";
import styles from "./SeletorIdentidadeVisual.module.css";

/**
 * Seletor de cor da identidade visual da barbearia.
 *
 * @param {Array<{id: string, label: string, color: string}>} options
 * @param {string} value - id da cor selecionada
 * @param {(id: string) => void} onChange
 */
export default function SeletorIdentidadeVisual({ options, value, onChange }) {
    return (
        <div>
            <div className={styles.sectionHead}>
        <span className={styles.dot}>
          <Palette size={16} />
        </span>
                Identidade Visual
            </div>

            <div className={styles.opcoes}>
                {options.map((opt) => {
                    const selecionado = opt.id === value;
                    return (
                        <button
                            key={opt.id}
                            type="button"
                            className={styles.opcao}
                            aria-pressed={selecionado}
                            aria-label={opt.label}
                            onClick={() => onChange(opt.id)}
                        >
              <span className={`${styles.label} ${selecionado ? styles.labelAtivo : ""}`}>
                {opt.label}
              </span>
                            <span
                                className={`${styles.bolinha} ${opt.color === "#FFFFFF" ? styles.bolinhaBranca : ""} ${
                                    selecionado ? styles.bolinhaSelecionada : ""
                                }`}
                                style={{ background: opt.color }}
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}