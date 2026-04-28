// src/components/EditarAtualizacao1/EditarAtualizacao1.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

export default function EditarAtualizacao1({api}) {
    const { id } = useParams();
    const navigate = useNavigate();
    const api_url = api
    const [titulo, setTitulo] = useState('');
    const [projetoId, setProjetoId] = useState('');
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
        buscarAtualizacao();
    }, [id]);

    async function buscarProjetos() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${api_url}/listar_projetos?token=${token}`, { credentials: 'include' });
            if (response.ok) { const data = await response.json(); if (data.projetos) setProjetos(data.projetos); }
        } catch (error) { console.error('Erro:', error); }
    }

    async function buscarAtualizacao() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${api_url}/buscar_atualizacao/${id}?token=${token}`, { credentials: 'include' });
            if (response.ok) {
                const data = await response.json();
                if (data.atualizacao) {
                    setTitulo(data.atualizacao.titulo || '');
                    setProjetoId(data.atualizacao.projeto_id || '');
                    setTexto(data.atualizacao.texto || '');
                }
            }
        } catch (error) { console.error('Erro:', error); }
        finally { setLoading(false); }
    }

    async function salvarEdicao() {
        const token = localStorage.getItem('token');
        const form = new FormData();
        form.append('titulo', titulo);
        form.append('projeto_id', projetoId);
        form.append('texto', texto);
        if (foto) form.append('foto', foto);

        try {
            const response = await fetch(`${api_url}/editar_atualizacao/${id}?token=${token}`, {
                method: 'PUT', credentials: 'include', body: form
            });
            const data = await response.json();
            setMensagem({ texto: data.message || data.error, tipo: response.ok ? 'sucesso' : 'erro' });
            if (response.ok) setTimeout(() => navigate('/dashboardOng'), 2000);
        } catch (error) { setMensagem({ texto: 'Erro de conexão', tipo: 'erro' }); }
    }

    if (loading) return <section className={css.containerSection}><p className={css.loading}>Carregando...</p></section>;

    return (
        <section className={css.containerSection}>
            <Mensagem tipo={mensagem.tipo} texto={mensagem.texto} onClose={() => setMensagem({ texto: '', tipo: '' })} />
            <div className={css.titulo}><Titulo titulo={'Editar atualização'} cor={'laranja'}/></div>
            <div className={css.formulario}>
                <div className={css.linha}>
                    <div className={css.campos}>
                        <Input label={'Título'} type={'text'} input={titulo} alterarInput={(e) => setTitulo(e.target.value)} required={true} apenasTexto={true} />
                        <Select
                            label={'Projeto'}
                            input={projetoId}
                            alterarInput={(e) => {
                                console.log('Projeto selecionado:', e.target.value);
                                setProjetoId(e.target.value);
                            }}
                            options={[
                                { value: '', label: 'Escolha um projeto' },
                                ...projetos.map(p => ({ value: p.id, label: p.titulo }))
                            ]}
                        />
                    </div>
                    <div className={css.campos}>
                        <Input label={'Texto'} type={'text'} input={texto} alterarInput={(e) => setTexto(e.target.value)} textarea={true} tamanho={'Big'} apenasTexto={true} />
                        <InputArquivo label={'Foto da atualização'} alterarInput={(e) => setFoto(e.target.files[0])} />
                    </div>
                </div>
                <div className={css.botaoContainer}>
                    <Botao acao={salvarEdicao} texto={'Editar atualização'} cor={'azul'}/>
                </div>
            </div>
        </section>
    );
}