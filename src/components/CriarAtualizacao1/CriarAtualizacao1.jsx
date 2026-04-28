// src/components/CriarAtualizacao1/CriarAtualizacao1.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Titulo from "../Titulo/Titulo.jsx";
import Input from "../Input/Input.jsx";
import Botao from "../Botao/Botao.jsx";
import Select from "../Select/Select.jsx";
import InputArquivo from "../InputArquivo/InputArquivo.jsx";
import Mensagem from "../Mensagem/Mensagem.jsx";
import css from "../CriarProjeto1/CriarProjeto1.module.css";

function decodificarToken(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) { return null; }
}

export default function CriarAtualizacao1() {
    const navigate = useNavigate();
    const API_URL = 'http://10.92.3.144:5000';
    const [titulo, setTitulo] = useState('');
    const [projetoId, setProjetoId] = useState('');
    const [projetoTitulo, setProjetoTitulo] = useState(''); // Para exibir no Select
    const [texto, setTexto] = useState('');
    const [foto, setFoto] = useState(null);
    const [projetos, setProjetos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        const tokenData = decodificarToken(token);
        if (!tokenData || tokenData.tipo !== 2) { navigate('/login'); return; }
        buscarProjetos();
    }, []);

    async function buscarProjetos() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/listar_projetos?token=${token}`, {
                method: 'GET', credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                if (data.projetos && data.projetos.length > 0) {
                    setProjetos(data.projetos);
                    console.log('Projetos.jsx carregados:', data.projetos);
                } else {
                    console.log('Nenhum projeto encontrado');
                }
            }
        } catch (error) {
            console.error('Erro ao buscar projetos:', error);
        } finally {
            setLoading(false);
        }
    }

    // Quando seleciona um projeto pelo título, encontra o ID
    function handleProjetoChange(e) {
        const tituloSelecionado = e.target.value;
        setProjetoTitulo(tituloSelecionado);

        if (tituloSelecionado === 'Escolha um projeto' || tituloSelecionado === '') {
            setProjetoId('');
            return;
        }

        const projeto = projetos.find(p => p.titulo === tituloSelecionado);
        if (projeto) {
            setProjetoId(projeto.id);
            console.log('Projeto selecionado ID:', projeto.id);
        }
    }

    async function criarAtualizacao() {
        if (!titulo.trim()) {
            setMensagem({ texto: 'Preencha o título', tipo: 'erro' });
            return;
        }
        if (!projetoId) {
            setMensagem({ texto: 'Selecione um projeto', tipo: 'erro' });
            return;
        }

        const token = localStorage.getItem('token');
        const form = new FormData();
        form.append('titulo', titulo);
        form.append('projeto_id', projetoId); // Envia o ID (número)
        form.append('texto', texto);
        if (foto) form.append('foto', foto);

        try {
            console.log('Enviando atualização - Projeto ID:', projetoId, 'Tipo:', typeof projetoId);

            const response = await fetch(`${API_URL}/criar_atualizacao?token=${token}`, {
                method: 'POST', credentials: 'include', body: form
            });
            const data = await response.json();

            if (response.ok) {
                setMensagem({ texto: data.message || 'Atualização criada!', tipo: 'sucesso' });
                setTimeout(() => navigate('/dashboardOng'), 2000);
            } else {
                setMensagem({ texto: data.error || data.message, tipo: 'erro' });
            }
        } catch (error) {
            setMensagem({ texto: 'Erro de conexão', tipo: 'erro' });
        }
    }

    if (loading) return (
        <section className={css.containerSection}>
            <p className={css.loading}>Carregando projetos...</p>
        </section>
    );

    return (
        <section className={css.containerSection}>
            <Mensagem tipo={mensagem.tipo} texto={mensagem.texto} onClose={() => setMensagem({ texto: '', tipo: '' })} />
            <div className={css.titulo}>
                <Titulo titulo={'Criar atualização'} cor={'laranja'}/>
            </div>
            <div className={css.formulario}>
                <div className={css.linha}>
                    <div className={css.campos}>
                        <Input
                            label={'Título'}
                            type={'text'}
                            placeholder={'Título da atualização'}
                            input={titulo}
                            alterarInput={(e) => setTitulo(e.target.value)}
                            required={true}
                            apenasTexto={true}
                        />
                        {projetos.length === 0 ? (
                            <div className={css.aviso}>
                                <p>⚠️ Nenhum projeto encontrado.</p>
                                <p>Crie um projeto primeiro antes de criar uma atualização.</p>
                            </div>
                        ) : (
                            <Select
                                label={'Projeto'}
                                input={projetoTitulo}
                                alterarInput={handleProjetoChange}
                                options={['Escolha um projeto', ...projetos.map(p => p.titulo)]}
                            />
                        )}
                    </div>
                    <div className={css.campos}>
                        <Input
                            label={'Texto'}
                            type={'text'}
                            placeholder={'Texto da atualização'}
                            input={texto}
                            alterarInput={(e) => setTexto(e.target.value)}
                            apenasTexto={true}
                        />
                        <InputArquivo label={'Foto da atualização'} alterarInput={(e) => setFoto(e.target.files[0])} />
                    </div>
                </div>
                <div className={css.botaoContainer}>
                    <Botao acao={criarAtualizacao} texto={'Criar atualização'} cor={'azul'}/>
                </div>
            </div>
        </section>
    );
}