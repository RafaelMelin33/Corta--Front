import React, { useState } from "react";
import { Users, Image as ImageIcon, Scissors, Plus, X, Upload } from "lucide-react";

import styles from "./PersonalizacaoBarbearia.module.css";
import SeletorIdentidadeVisual from "../../components/SeletorIdentidadeVisual/SeletorIdentidadeVisual.jsx";
import TabelaHorarios from "../../components/TabelaHorarios/TabelaHorarios.jsx";
import ModalAdicionarServico from "../../components/ModalAdicionarServico/ModalAdicionarServico.jsx";


const COR_OPTIONS = [
    { id: "preto", label: "Preto", color: "#000000" },
    { id: "ambar", label: "Âmbar", color: "#FF9C08" },
    { id: "branco", label: "Branco", color: "#FFFFFF" },
];

const DIAS_INICIAIS = [
    { nome: "Segunda", fechado: true, manhaInicio: "09:00", manhaFim: "12:00", tardeInicio: "14:00", tardeFim: "18:00" },
    { nome: "Terça", fechado: false, manhaInicio: "08:00", manhaFim: "12:00", tardeInicio: "14:00", tardeFim: "20:00" },
    { nome: "Quarta", fechado: false, manhaInicio: "08:00", manhaFim: "12:00", tardeInicio: "14:00", tardeFim: "20:00" },
    { nome: "Quinta", fechado: false, manhaInicio: "08:00", manhaFim: "12:00", tardeInicio: "14:00", tardeFim: "20:00" },
    { nome: "Sexta", fechado: false, manhaInicio: "08:00", manhaFim: "12:00", tardeInicio: "14:00", tardeFim: "20:00" },
    { nome: "Sábado", fechado: false, manhaInicio: "09:00", manhaFim: "12:00", tardeInicio: "14:00", tardeFim: "18:00" },
    { nome: "Domingo", fechado: true, manhaInicio: "09:00", manhaFim: "12:00", tardeInicio: "14:00", tardeFim: "18:00" },
];

export default function PersonalizacaoBarbearia() {
    const [funcionarios, setFuncionarios] = useState(["Thiago", "Rogério"]);
    const [historia, setHistoria] = useState(
        "Desde 2015, transformamos vidas visão inovadora, o empreendedor e barbeiro Diego. Compomos entusiasmo, na missão de dar um novo conceito em barbearias na cidade de Birigui SP. Movido pelo desejo de homenagear seu falecido avô materno, Seu Alfredo, batizou o estabelecimento como Barbearia Sir Alfred. Desde então, o Sir Alfred se destaca na região, proporcionando aos clientes uma experiência encapsulada em barbearia, encantando os com uma atenção especial nos detalhes."
    );
    const [corSelecionada, setCorSelecionada] = useState("ambar");
    const [dias, setDias] = useState(DIAS_INICIAIS);
    const [servicos, setServicos] = useState([
        { nome: "Corte" },
        { nome: "Barba" },
        { nome: "Combo (Corte + Barba)" },
        { nome: "Sobrancelha" },
    ]);
    const [modalAberto, setModalAberto] = useState(false);

    const toggleDia = (nomeDia) => {
        setDias((prev) => prev.map((d) => (d.nome === nomeDia ? { ...d, fechado: !d.fechado } : d)));
    };

    const alterarHorario = (nomeDia, campo, valor) => {
        setDias((prev) => prev.map((d) => (d.nome === nomeDia ? { ...d, [campo]: valor } : d)));
    };

    const removerServico = (index) => {
        setServicos((prev) => prev.filter((_, i) => i !== index));
    };

    const adicionarServico = (novoServico) => {
        setServicos((prev) => [...prev, { nome: novoServico.nome }]);
        setModalAberto(false);
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.span2}>
                    <h1 className={styles.titulo}>PERSONALIZAÇÃO</h1>
                    <div className={styles.tituloRegua} />
                </div>

                {/* Equipe */}
                <section className={styles.section}>
                    <div className={styles.sectionHead}>
            <span className={styles.dot}>
              <Users size={16} />
            </span>
                        Equipe
                    </div>
                    <label className={styles.label} htmlFor="qtd-funcionarios">
                        Quantidade de Funcionários
                    </label>
                    <input
                        id="qtd-funcionarios"
                        className={styles.input}
                        type="number"
                        min={1}
                        value={funcionarios.length}
                        onChange={(e) => {
                            const qtd = Math.max(1, Number(e.target.value) || 1);
                            setFuncionarios((prev) => {
                                const novo = [...prev];
                                while (novo.length < qtd) novo.push("");
                                return novo.slice(0, qtd);
                            });
                        }}
                        style={{ marginBottom: 16 }}
                    />
                    <div className={styles.row2}>
                        {funcionarios.map((nome, i) => (
                            <div key={i}>
                                <label className={styles.label}>Funcionário {i + 1}</label>
                                <input
                                    className={styles.input}
                                    value={nome}
                                    onChange={(e) => {
                                        const novo = [...funcionarios];
                                        novo[i] = e.target.value;
                                        setFuncionarios(novo);
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* História da Empresa */}
                <section className={styles.section}>
                    <div className={styles.sectionHead}>
            <span className={styles.dot}>
              <Scissors size={16} />
            </span>
                        História da Empresa
                    </div>
                    <textarea
                        className={styles.textarea}
                        value={historia}
                        onChange={(e) => setHistoria(e.target.value)}
                        style={{ minHeight: 140, fontStyle: "italic", fontSize: 13 }}
                    />
                </section>

                {/* Imagens */}
                <section className={`${styles.section} ${styles.span2}`}>
                    <div className={styles.sectionHead}>
            <span className={styles.dot}>
              <ImageIcon size={16} />
            </span>
                        Imagens da Empresa
                    </div>
                    <div className={styles.row2}>
                        <label className={styles.upload}>
                            <Upload size={18} />
                            Arraste fotos aqui
                        </label>
                        <label className={styles.upload}>
                            <Upload size={18} />
                            Upload do logo
                        </label>
                    </div>
                </section>

                {/* Componente: Seletor de Identidade Visual */}
                <section className={`${styles.section} ${styles.span2}`}>
                    <SeletorIdentidadeVisual options={COR_OPTIONS} value={corSelecionada} onChange={setCorSelecionada} />
                </section>

                {/* Componente: Tabela de Horários */}
                <section className={`${styles.section} ${styles.span2}`}>
                    <TabelaHorarios dias={dias} onToggleDia={toggleDia} onChangeHorario={alterarHorario} />
                </section>

                {/* Serviços */}
                <section className={`${styles.section} ${styles.span2}`}>
                    <div className={styles.sectionHead}>
            <span className={styles.dot}>
              <Scissors size={16} />
            </span>
                        Serviços Disponíveis
                    </div>
                    <div className={styles.tags}>
                        {servicos.map((s, i) => (
                            <span className={styles.tag} key={i}>
                {s.nome}
                                <button onClick={() => removerServico(i)} aria-label={`Remover ${s.nome}`}>
                  <X size={13} />
                </button>
              </span>
                        ))}
                        <button className={styles.tagAdd} onClick={() => setModalAberto(true)}>
                            <Plus size={13} /> Adicionar Serviço
                        </button>
                    </div>
                </section>

                <div className={styles.span2}>
                    <button className={styles.btnPrimario} onClick={() => alert("Alterações salvas!")}>
                        SALVAR ALTERAÇÕES
                    </button>
                </div>
            </div>

            {/* Componente: Modal Adicionar Serviço */}
            <ModalAdicionarServico open={modalAberto} onClose={() => setModalAberto(false)} onAdd={adicionarServico} />
        </div>
    );
}