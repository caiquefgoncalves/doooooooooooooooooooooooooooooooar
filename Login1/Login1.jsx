// src/components/Login1/Login1.jsx
import css from './Login1.module.css'
import Input from "../../components/Input/Input.jsx";
import Titulo from "../Titulo/Titulo.jsx";
import Botao from "../Botao/Botao.jsx";
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Mensagem from "../Mensagem/Mensagem.jsx";

export default function Login1({ api }) {
    const api_url = api
    const [cpf, setCpf] = useState('')
    const [senha, setSenha] = useState('')
    const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const tokenData = decodificarToken(token);
            if (tokenData) {
                if (tokenData.tipo === 0) navigate('/dashboardAdm');
                else if (tokenData.tipo === 2) navigate('/dashboardOng');
                else if (tokenData.tipo === 1) navigate('/dashboardDoador');
            }
        }
    }, []);

    function alterarCPF(e) {
        let valor = e.target.value;

        // Remove tudo que não é número
        valor = valor.replace(/\D/g, '');

        // Limita o tamanho máximo a 14 dígitos (CNPJ)
        valor = valor.substring(0, 14);

        // Aplica máscara conforme o tamanho
        if (valor.length <= 11) {
            // Máscara de CPF: 000.000.000-00
            valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
            valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
            valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        } else {
            // Máscara de CNPJ: 00.000.000/0000-00
            valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
            valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
            valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
        }

        setCpf(valor);
    }

    function alterarSenha(e) {
        setSenha(e.target.value)
    }

    function decodificarToken(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            return null;
        }
    }

    async function realizarLogin() {
        try {
            // Envia apenas números (sem máscara)
            const cpfLimpo = cpf.replace(/\D/g, '');

            let retorno = await fetch(`${api_url}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cpf_cnpj: cpfLimpo, senha: senha })
            })

            retorno = await retorno.json();

            console.log('Resposta do login:', retorno);

            if (retorno.token) {
                localStorage.setItem('token', retorno.token);
                localStorage.setItem('nome', retorno.nome);

                const tokenData = decodificarToken(retorno.token);
                console.log('Dados do token:', tokenData);

                if (tokenData) {
                    if (tokenData.tipo === 0) {
                        navigate('/dashboardAdm');
                    } else if (tokenData.tipo === 2) {
                        navigate('/dashboardOng');
                    } else if (tokenData.tipo === 1) {
                        navigate('/dashboardDoador');
                    } else {
                        setMensagem({ texto: 'Tipo de usuário não reconhecido', tipo: 'erro' });
                    }
                } else {
                    setMensagem({ texto: 'Erro ao processar token', tipo: 'erro' });
                }
            } else if (retorno.error === "Verifique o e-mail antes de logar!") {
                setMensagem({ texto: 'E-mail não confirmado! Redirecionando...', tipo: 'erro' });
                setTimeout(() => navigate('/confirmaremail'), 3000);
            } else if (retorno.error === "Sua ONG ainda está pendente de aprovação.") {
                setMensagem({ texto: retorno.error, tipo: 'erro' });
            } else if (retorno.error === "Sua ONG foi reprovada.") {
                setMensagem({ texto: retorno.error, tipo: 'erro' });
            } else if (retorno.error === "Usuário não encontrado") {
                setMensagem({ texto: 'CPF/CNPJ não cadastrado', tipo: 'erro' });
            } else if (retorno.error === "Senha incorreta") {
                setMensagem({ texto: 'Senha incorreta', tipo: 'erro' });
            } else {
                setMensagem({ texto: retorno.error || 'Erro ao realizar login', tipo: 'erro' });
            }
        } catch (error) {
            console.error('Erro:', error);
            setMensagem({ texto: 'Erro de conexão com o servidor', tipo: 'erro' });
        }
    }

    return (
        <div className={"container-fluid " + css.secao}>
            <Mensagem tipo={mensagem.tipo} texto={mensagem.texto} onClose={() => setMensagem({ texto: '', tipo: '' })} />
            <div className="row g-0">
                <div className={"col-md-6 " + css.colunaFormulario}>
                    <div className={css.conteudoFormulario}>
                        <Titulo titulo={'Bem-vindo de volta!'} cor={'azul-claro'} />

                        <form className={css.formulario} onSubmit={(e) => {
                            e.preventDefault();
                            realizarLogin();
                        }}>
                            <div className={css.campo}>
                                <Input
                                    label={"CPF/CNPJ"}
                                    type={"text"}
                                    input={cpf}
                                    alterarInput={alterarCPF}
                                    placeholder={"Digite seu CPF ou CNPJ"}
                                    required={true}
                                />
                            </div>

                            <div className={css.campo}>
                                <Input
                                    alterarInput={alterarSenha}
                                    input={senha}
                                    label={"Senha"}
                                    type={"password"}
                                    placeholder={"Digite sua senha"}
                                    required={true}
                                />
                                <a href="/esqueciSenha" className={css.link}>Esqueci minha senha</a>
                            </div>

                            <div className={css.areaBotao}>
                                <Botao acao={realizarLogin} cor={'amarelo'} texto={'Login'} />
                            </div>

                            <div className={css.cadastro}>
                                <p className={css.p}>Ainda não está no Doar+?</p>
                                <Botao pagina={'/cadastroDoador'} cor={'vazadoamarelo'} texto={'Cadastre-se'} />
                            </div>
                        </form>
                    </div>
                </div>

                <div className={"col-md-6 " + css.colunaImagem}>
                    <img
                        className={css.imagem}
                        src="/cachorro_macaco.png"
                        alt="Cachorro com um macaco de pelúcia"
                    />
                </div>
            </div>
        </div>
    )
}