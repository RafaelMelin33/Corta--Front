import { useState } from "react";
import styles from "./Agendamento.module.css";

const dias = [
    {
        semana: "SEG",
        numero: "27",
        mes: "JUL",
    },
    {
        semana: "TER",
        numero: "28",
        mes: "JUL",
    },
    {
        semana: "QUA",
        numero: "29",
        mes: "JUL",
    },
    {
        semana: "QUI",
        numero: "30",
        mes: "JUL",
    },
    {
        semana: "QUI",
        numero: "31",
        mes: "JUL",
    },
    {
        semana: "SEX",
        numero: "01",
        mes: "AGO",
    },
    {
        semana: "SAB",
        numero: "02",
        mes: "AGO",
    },
];

const horarios = [
    { horario: "08:00", disponivel: false },
    { horario: "08:30", disponivel: false },
    { horario: "09:00", disponivel: false },
    { horario: "09:30", disponivel: false },

    { horario: "10:00", disponivel: true },
    { horario: "10:30", disponivel: true },
    { horario: "11:00", disponivel: true },
    { horario: "11:30", disponivel: true },

    { horario: "12:00", disponivel: true },
    { horario: "12:30", disponivel: true },
    { horario: "14:30", disponivel: false },
    { horario: "15:00", disponivel: true },

    { horario: "15:30", disponivel: true },
    { horario: "16:00", disponivel: true },
    { horario: "16:30", disponivel: true },
    { horario: "17:00", disponivel: true },

    { horario: "17:30", disponivel: true },
    { horario: "18:00", disponivel: true },
];

function Agendamento() {
    const [diaSelecionado, setDiaSelecionado] = useState(4);
    const [horarioSelecionado, setHorarioSelecionado] = useState("17:30");

    const diaAtual = dias[diaSelecionado];

    const selecionarDia = (index) => {
        setDiaSelecionado(index);
        setHorarioSelecionado(null);
    };

    const selecionarHorario = (horario) => {
        if (!horario.disponivel) return;

        setHorarioSelecionado(horario.horario);
    };

    const voltarDia = () => {
        if (diaSelecionado > 0) {
            selecionarDia(diaSelecionado - 1);
        }
    };

    const avancarDia = () => {
        if (diaSelecionado < dias.length - 1) {
            selecionarDia(diaSelecionado + 1);
        }
    };

    const confirmarAgendamento = () => {
        if (!horarioSelecionado) {
            alert("Selecione um horário.");
            return;
        }

        alert(
            `Horário selecionado: ${horarioSelecionado}\n` +
            `Dia: ${diaAtual.numero}/${diaAtual.mes}`
        );
    };

    return (
        <main className={styles.agendamentoPage}>

            {/* TÍTULO */}
            <section className={styles.agendamentoHeader}>
                <h1>Julho/Agosto 2026</h1>
            </section>


            {/* DIAS */}
            <section className={styles.seletorDias}>

                <button
                    className={styles.navegacaoDia}
                    onClick={voltarDia}
                    aria-label="Dia anterior"
                >
                    ‹
                </button>


                <div className={styles.diasContainer}>

                    {dias.map((dia, index) => (
                        <button
                            key={`${dia.numero}-${dia.mes}`}
                            className={`${styles.diaCard} ${
                                diaSelecionado === index
                                    ? styles.diaAtivo
                                    : ""
                            }`}
                            onClick={() => selecionarDia(index)}
                        >
                            <span className={styles.diaSemana}>
                                {dia.semana}
                            </span>

                            <strong className={styles.diaNumero}>
                                {dia.numero}
                            </strong>

                            <span className={styles.diaMes}>
                                {dia.mes}
                            </span>
                        </button>
                    ))}

                </div>


                <button
                    className={styles.navegacaoDia}
                    onClick={avancarDia}
                    aria-label="Próximo dia"
                >
                    ›
                </button>

            </section>


            {/* HORÁRIOS */}
            <section className={styles.horariosSection}>

                <h2>
                    Horários Disponíveis para{" "}
                    <strong>
                        {diaAtual.semana === "QUI"
                            ? "Quinta"
                            : diaAtual.semana}
                        , {diaAtual.numero} {diaAtual.mes}
                    </strong>
                </h2>


                <div className={styles.horariosGrid}>

                    {horarios.map((item) => {

                        const ocupado = !item.disponivel;

                        const selecionado =
                            horarioSelecionado === item.horario;

                        return (
                            <button
                                key={item.horario}
                                disabled={ocupado}
                                onClick={() =>
                                    selecionarHorario(item)
                                }
                                className={`
                                    ${styles.horarioCard}
                                    ${ocupado ? styles.horarioOcupado : ""}
                                    ${selecionado ? styles.horarioSelecionado : ""}
                                `}
                            >

                                <span className={styles.horarioTexto}>
                                    {item.horario}
                                </span>


                                {ocupado ? (
                                    <span
                                        className={`${styles.horarioStatus} ${styles.ocupado}`}
                                    >
                                        <span className={styles.xOcupado}>
                                            ×
                                        </span>

                                        Ocupado
                                    </span>
                                ) : (
                                    <span className={styles.horarioStatus}>
                                        Disponível
                                    </span>
                                )}


                                {selecionado && (
                                    <span className={styles.checkHorario}>
                                        ✓
                                    </span>
                                )}

                            </button>
                        );
                    })}

                </div>


                {/* CONFIRMAR */}
                <button
                    className={styles.btnConfirmar}
                    onClick={confirmarAgendamento}
                >
                    CONFIRMAR SELEÇÃO
                </button>

            </section>

        </main>
    );
}

export default Agendamento;