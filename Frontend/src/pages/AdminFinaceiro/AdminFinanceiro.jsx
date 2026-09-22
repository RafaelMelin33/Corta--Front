import { useState } from 'react';

import {
    FiDownload,
    FiPlus,
    FiArrowUp,
    FiArrowDown,
    FiCreditCard,
    FiScissors,
    FiTruck,
    FiZap,
    FiCheckCircle,
    FiSearch,
    FiChevronLeft,
    FiChevronRight
} from 'react-icons/fi';

import {
    ResponsiveContainer,
    ComposedChart,
    Line,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from 'recharts';


import estilo from './Adminfinanceiro.module.css';


// =====================================================
// DADOS DO GRÁFICO
// =====================================================

const dadosGrafico = [
    { dia: '01 Jul', entradas: 1200, saidas: 800 },
    { dia: '05 Jul', entradas: 2500, saidas: 1200 },
    { dia: '10 Jul', entradas: 2100, saidas: 950 },
    { dia: '15 Jul', entradas: 3800, saidas: 1800 },
    { dia: '20 Jul', entradas: 3200, saidas: 1400 },
    { dia: '25 Jul', entradas: 4500, saidas: 1900 },
    { dia: '30 Jul', entradas: 5200, saidas: 2100 }
];


// =====================================================
// DADOS DOS CARDS
// =====================================================

const dadosFinanceiros = [
    {
        id: 1,
        titulo: 'RECEITA TOTAL',
        valor: 'R$ 14.250,00',
        periodo: 'Este mês',
        tipo: 'receita',
        icone: <FiArrowUp />
    },
    {
        id: 2,
        titulo: 'DESPESAS',
        valor: 'R$ 5.820,00',
        periodo: 'Este mês',
        tipo: 'despesa',
        icone: <FiArrowDown />
    },
    {
        id: 3,
        titulo: 'LUCRO MENSAL',
        valor: 'R$ 8.430,00',
        periodo: 'Este mês',
        tipo: 'lucro',
        icone: <FiCreditCard />
    }
];


// =====================================================
// DADOS DAS TRANSAÇÕES
// =====================================================

const dadosTransacoes = [
    {
        id: 1,
        descricao: 'Corte + Barba (Seu Jorge)',
        subtitulo: 'SERVIÇO REALIZADO',
        categoria: 'ENTRADA',
        data: 'Hoje, 14:30',
        valor: 85,
        icone: <FiScissors />
    },
    {
        id: 2,
        descricao: 'Fornecedor (Pomadas & Shampoos)',
        subtitulo: 'ESTOQUE',
        categoria: 'SAÍDA',
        data: 'Hoje, 11:00',
        valor: -320,
        icone: <FiTruck />
    },
    {
        id: 3,
        descricao: 'Conta de Energia',
        subtitulo: 'CUSTOS FIXOS',
        categoria: 'SAÍDA',
        data: 'Ontem',
        valor: -450,
        icone: <FiZap />
    },
    {
        id: 4,
        descricao: 'Assinatura Premium CortAê',
        subtitulo: 'PLATAFORMA',
        categoria: 'SAÍDA',
        data: '28/07/2026',
        valor: -99,
        icone: <FiCheckCircle />
    },
    {
        id: 5,
        descricao: 'Corte Masculino (Diogo)',
        subtitulo: 'SERVIÇO REALIZADO',
        categoria: 'ENTRADA',
        data: '28/07/2026',
        valor: 50,
        icone: <FiScissors />
    }
];


// =====================================================
// COMPONENTE: CABEÇALHO
// =====================================================

function CabecalhoFinanceiro() {

    function exportarRelatorio() {
        alert('Relatório será exportado futuramente.');
    }

    function novaTransacao() {
        alert('Modal de nova transação será aberto futuramente.');
    }

    return (
        <section className={estilo.cabecalho}>

            <div className={estilo.tituloArea}>

                <h1>PAINEL FINANCEIRO</h1>

                <p>
                    Acompanhe o desempenho financeiro da sua
                    barbearia em tempo real.
                </p>

            </div>

            <div className={estilo.acoes}>

                <button
                    className={estilo.botaoExportar}
                    onClick={exportarRelatorio}
                >
                    <FiDownload />
                    Exportar Relatório
                </button>

                <button
                    className={estilo.botaoNova}
                    onClick={novaTransacao}
                >
                    <FiPlus />
                    Nova Transação
                </button>

            </div>

        </section>
    );
}


// =====================================================
// COMPONENTE: CARDS FINANCEIROS
// =====================================================

function CardsFinanceiros() {

    return (
        <section className={estilo.cards}>

            {dadosFinanceiros.map((item, index) => (

                <article
                    key={item.id}
                    className={`${estilo.card} ${estilo[item.tipo]}`}
                    style={{
                        '--delay': `${index * 0.15}s`
                    }}
                >

                    <div className={estilo.topoCard}>

                        <span className={estilo.icone}>
                            {item.icone}
                        </span>

                        <span className={estilo.periodo}>
                            {item.periodo}
                        </span>

                    </div>

                    <div className={estilo.informacoes}>

                        <p>{item.titulo}</p>

                        <h2>{item.valor}</h2>

                    </div>

                </article>

            ))}

        </section>
    );
}


// =====================================================
// COMPONENTE: GRÁFICO FINANCEIRO
// =====================================================

function GraficoFinanceiro() {

    return (
        <section className={estilo.graficoContainer}>

            <div className={estilo.graficoCabecalho}>

                <div>

                    <h2>DESEMPENHO MENSAL</h2>

                    <p>
                        Comparativo de Entradas vs. Saídas nos últimos 30 dias
                    </p>

                </div>

                <div className={estilo.legenda}>

                    <span>
                        <i className={estilo.bolinhaEntrada}></i>
                        Entradas
                    </span>

                    <span>
                        <i className={estilo.bolinhaSaida}></i>
                        Saídas
                    </span>

                </div>

            </div>

            <div className={estilo.areaGrafico}>

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <ComposedChart
                        data={dadosGrafico}
                        margin={{
                            top: 15,
                            right: 10,
                            left: 0,
                            bottom: 5
                        }}
                    >

                        <defs>

                            <linearGradient
                                id="preenchimentoGrafico"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >

                                <stop
                                    offset="0%"
                                    stopColor="#000000"
                                    stopOpacity={0.12}
                                />

                                <stop
                                    offset="100%"
                                    stopColor="#000000"
                                    stopOpacity={0.02}
                                />

                            </linearGradient>

                        </defs>

                        <CartesianGrid
                            stroke="#e5e5e5"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="dia"
                            axisLine={{
                                stroke: '#bdbdbd'
                            }}
                            tickLine={false}
                            tick={{
                                fontSize: 10,
                                fill: '#929292'
                            }}
                        />

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            width={45}
                            tick={{
                                fontSize: 10,
                                fill: '#929292'
                            }}
                        />

                        <Tooltip
                            cursor={{
                                stroke: '#cccccc',
                                strokeDasharray: '4 4'
                            }}
                            contentStyle={{
                                border: 'none',
                                borderRadius: '10px',
                                boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                                fontSize: '12px'
                            }}
                            formatter={(valor) =>
                                `R$ ${Number(valor).toLocaleString('pt-BR')}`
                            }
                        />

                        <Area
                            type="monotone"
                            dataKey="entradas"
                            stroke="none"
                            fill="url(#preenchimentoGrafico)"
                            animationDuration={1800}
                        />

                        <Line
                            type="monotone"
                            dataKey="entradas"
                            stroke="#111111"
                            strokeWidth={3}
                            dot={{
                                r: 3,
                                fill: '#111111'
                            }}
                            activeDot={{
                                r: 6
                            }}
                            animationDuration={1800}
                        />

                        <Line
                            type="monotone"
                            dataKey="saidas"
                            stroke="#929292"
                            strokeWidth={3}
                            dot={{
                                r: 3,
                                fill: '#929292'
                            }}
                            activeDot={{
                                r: 6
                            }}
                            animationDuration={2200}
                        />

                    </ComposedChart>

                </ResponsiveContainer>

            </div>

        </section>
    );
}


// =====================================================
// COMPONENTE: MOVIMENTAÇÕES
// =====================================================

function Movimentacoes() {

    const [busca, setBusca] = useState('');

    const [pagina, setPagina] = useState(1);

    const transacoesFiltradas = dadosTransacoes.filter((item) =>
        `${item.descricao} ${item.categoria} ${item.subtitulo}`
            .toLowerCase()
            .includes(busca.toLowerCase())
    );

    function alterarBusca(valor) {
        setBusca(valor);
        setPagina(1);
    }

    return (
        <section className={estilo.movimentacoes}>

            <div className={estilo.movimentacoesCabecalho}>

                <h2>ÚLTIMAS MOVIMENTAÇÕES</h2>

                <div className={estilo.busca}>

                    <FiSearch />

                    <input
                        type="text"
                        placeholder="Filtrar transações..."
                        value={busca}
                        onChange={(e) => alterarBusca(e.target.value)}
                    />

                </div>

            </div>

            <div className={estilo.tabelaWrapper}>

                <table>

                    <thead>

                    <tr>
                        <th>DESCRIÇÃO</th>
                        <th>CATEGORIA</th>
                        <th>DATA</th>
                        <th>VALOR</th>
                    </tr>

                    </thead>

                    <tbody>

                    {transacoesFiltradas.map((item, index) => (

                        <tr
                            key={item.id}
                            style={{
                                '--delay': `${index * 0.08}s`
                            }}
                        >

                            <td>

                                <div className={estilo.descricao}>

                                        <span className={estilo.iconeTransacao}>
                                            {item.icone}
                                        </span>

                                    <div>

                                        <strong>
                                            {item.descricao}
                                        </strong>

                                        <small>
                                            {item.subtitulo}
                                        </small>

                                    </div>

                                </div>

                            </td>

                            <td>

                                    <span
                                        className={`${estilo.tag} ${
                                            item.categoria === 'ENTRADA'
                                                ? estilo.tagEntrada
                                                : estilo.tagSaida
                                        }`}
                                    >
                                        {item.categoria}
                                    </span>

                            </td>

                            <td className={estilo.data}>
                                {item.data}
                            </td>

                            <td
                                className={`${estilo.valor} ${
                                    item.valor > 0
                                        ? estilo.valorEntrada
                                        : estilo.valorSaida
                                }`}
                            >

                                {item.valor > 0 ? '' : '- '}

                                R$ {Math.abs(item.valor).toLocaleString(
                                'pt-BR',
                                {
                                    minimumFractionDigits: 2
                                }
                            )}

                            </td>

                        </tr>

                    ))}

                    {transacoesFiltradas.length === 0 && (

                        <tr>

                            <td
                                colSpan="4"
                                className={estilo.semResultados}
                            >
                                Nenhuma transação encontrada.
                            </td>

                        </tr>

                    )}

                    </tbody>

                </table>

            </div>

            <div className={estilo.paginacao}>

                <button
                    aria-label="Página anterior"
                    disabled={pagina === 1}
                    onClick={() => setPagina(pagina - 1)}
                >
                    <FiChevronLeft />
                </button>

                <button
                    className={pagina === 1 ? estilo.paginaAtiva : ''}
                    onClick={() => setPagina(1)}
                >
                    1
                </button>

                <button
                    className={pagina === 2 ? estilo.paginaAtiva : ''}
                    onClick={() => setPagina(2)}
                >
                    2
                </button>

                <button
                    aria-label="Próxima página"
                    disabled={pagina === 2}
                    onClick={() => setPagina(pagina + 1)}
                >
                    <FiChevronRight />
                </button>

            </div>

        </section>
    );
}


// =====================================================
// PÁGINA PRINCIPAL: ADMIN FINACEIRO
// =====================================================

function AdminFinaceiro() {

    return (
        <div className={estilo.pagina}>


            <main className={estilo.conteudo}>

                <CabecalhoFinanceiro />

                <CardsFinanceiros />

                <GraficoFinanceiro />

                <Movimentacoes />

            </main>



        </div>
    );
}

export default AdminFinaceiro;