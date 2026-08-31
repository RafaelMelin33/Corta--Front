import { useEffect, useState } from 'react';
import { IMaskInput } from 'react-imask';
import { useNavigate } from 'react-router-dom';
import styles from './VerificarCodigo.module.css';
import { apiFetch, mensagemDaApi } from '../../services/api';

export default function VerificarCodigo() {
    const [email, setEmail] = useState('');
    const [codigo, setCodigo] = useState('');
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [carregando, setCarregando] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const emailSalvo = localStorage.getItem('email_verificacao') || '';
        setEmail(emailSalvo);
    }, []);

    const verificar = async (e) => {
        e.preventDefault();
        setErro('');
        setSucesso('');

        if (codigo.length !== 6) {
            setErro('Digite o código de 6 dígitos.');
            return;
        }

        setCarregando(true);

        try {
            const dados = await apiFetch('/verificar-codigo', {
                method: 'POST',
                body: JSON.stringify({ email, codigo }),
            });

            setSucesso(
                dados?.mensagem?.informacao ||
                'E-mail confirmado com sucesso!'
            );

            localStorage.removeItem('email_verificacao');

            setTimeout(() => navigate('/login'), 1000);
        } catch (error) {
            setErro(mensagemDaApi(error));
        } finally {
            setCarregando(false);
        }
    };

    return (
        <main className={styles.container}>
            <section className={styles.card}>
                <h1>CONFIRME SEU E-MAIL</h1>

                <p>
                    Digite o código de 6 dígitos enviado para:
                    <br />
                    <strong>{email || 'seu e-mail'}</strong>
                </p>

                {erro && <div className={styles.erro} role="alert">{erro}</div>}
                {sucesso && <div className={styles.sucesso} role="status">{sucesso}</div>}

                <form onSubmit={verificar}>
                    <IMaskInput
                        mask="000000"
                        type="text"
                        inputMode="numeric"
                        value={codigo}
                        onAccept={(value) => setCodigo(value)}
                        className={styles.codigo}
                        placeholder="000000"
                        required
                    />

                    <button
                        id="btn-confirmar-email"
                        type="submit"
                        disabled={carregando}
                    >
                        {carregando ? 'VERIFICANDO...' : 'CONFIRMAR E-MAIL'}
                    </button>
                </form>
            </section>
        </main>
    );
}