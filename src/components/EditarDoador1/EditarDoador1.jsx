// EditarDoador1.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Titulo from "../Titulo/Titulo.jsx";
import css from "../CadastroDoador1/CadastroDoador1.module.css";
import Input from "../Input/Input.jsx";
import Botao from "../Botao/Botao.jsx";
import InputArquivo from "../InputArquivo/InputArquivo.jsx";
import Mensagem from "../Mensagem/Mensagem.jsx";

function decodificarToken(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) { return null; }
}

export default function EditarDoador() {
    const { id } = useParams();
    const navigate = useNavigate();
    const API_URL = 'http://10.92.3.144:5000';

    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [fotoPerfil, setFotoPerfil] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        const tokenData = decodificarToken(token);
        if (!tokenData) { localStorage.clear(); navigate('/login'); return; }

        // Só ADM (tipo 0) ou o próprio doador (tipo 1 com mesmo ID)
        if (tokenData.tipo !== 0 && !(tokenData.tipo === 1 && tokenData.id_usuarios === parseInt(id))) {
            navigate('/dashboard');
            return;
        }

        buscarDadosDoador();
    }, [id]);

    async function buscarDadosDoador() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/listar_usuarios?token=${token}`, {
                method: 'GET', credentials: 'include',
            });
            if (response.status === 401) { localStorage.clear(); navigate('/login'); return; }
            if (response.ok) {
                const data = await response.json();
                const doador = data.usuarios.find(u => u[0] === parseInt(id));
                if (doador) {
                    setNome(doador[1] || '');
                    setEmail(doador[2] || '');
                    setCpf(doador[4] || '');
                    setTelefone(doador[5] || '');
                }
            }
        } catch (error) { console.error('Erro:', error); }
        finally { setLoading(false); }
    }

    async function salvarEdicao() {
        const token = localStorage.getItem('token');
        const form = new FormData();
        form.append('token', token);
        form.append('nome', nome.trim());
        form.append('email', email.trim());
        form.append('cpf_cnpj', cpf.replace(/\D/g, ''));
        form.append('telefone', telefone.replace(/\D/g, ''));
        if (senha) form.append('senha', senha);
        if (confirmarSenha) form.append('confirmar_senha', confirmarSenha);
        if (fotoPerfil) form.append('foto_perfil', fotoPerfil);

        try {
            const response = await fetch(`${API_URL}/editar_usuarios/${id}`, {
                method: 'PUT', credentials: 'include', body: form
            });
            const data = await response.json();
            setMensagem(data.message || data.error);
            setTipoMensagem(response.ok ? 'sucesso' : 'erro');
            if (response.ok) setTimeout(() => navigate('/dashboardAdm'), 2000);
        } catch (error) { setMensagem('Erro de conexão'); setTipoMensagem('erro'); }
    }

    if (loading) return <section className={css.containerSection}><p>Carregando...</p></section>;

    return (
        <section className={css.containerSection}>
            <Mensagem tipo={tipoMensagem} texto={mensagem} onClose={() => setMensagem('')} />
            <div className={css.organizar}><Titulo titulo={'Editar Doador'} cor={'rosa'} /></div>
            <div className={css.formulario}>
                <div className={css.linha}>
                    <div className={css.campos}>
                        <Input label={'Nome'} type={'text'} input={nome} alterarInput={(e) => setNome(e.target.value)} required={true} />
                        <Input label={'Nova senha (opcional)'} type={'password'} input={senha} alterarInput={(e) => setSenha(e.target.value)} />
                        <Input label={'Telefone'} type={'text'} input={telefone} alterarInput={(e) => setTelefone(e.target.value)} mascara={'telefone'} />
                        <Input label={'Email'} type={'text'} input={email} alterarInput={(e) => setEmail(e.target.value.replace(/\s/g, ''))} required={true} />
                    </div>
                    <div className={css.campos}>
                        <Input label={'CPF'} type={'text'} input={cpf} disabled={true} mascara={'cpf'} />
                        <Input label={'Confirmar senha'} type={'password'} input={confirmarSenha} alterarInput={(e) => setConfirmarSenha(e.target.value)} />
                        <InputArquivo tamanho={'big'} required={false} alterarInput={(e) => setFotoPerfil(e.target.files[0])} />
                    </div>
                </div>
                <div className={css.botaoContainer}>
                    <Botao acao={salvarEdicao} texto={'Salvar Alterações'} cor={'rosa'}/>
                </div>
            </div>
        </section>
    );
}