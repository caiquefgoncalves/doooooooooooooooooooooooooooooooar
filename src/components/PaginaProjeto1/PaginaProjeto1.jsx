// src/components/PaginaProjeto1/PaginaProjeto1.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Titulo from "../Titulo/Titulo.jsx";
import MenuLateral from "../MenuLateral/MenuLateral.jsx";
import css from "./PaginaProjeto1.module.css";

export default function PaginaProjeto1() {
    const { id } = useParams();
    const [projeto, setProjeto] = useState(null);
    const [ong, setOng] = useState(null);
    const [atualizacoes, setAtualizacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = 'http://10.92.3.144:5000';

    useEffect(() => {
        buscarDados();
    }, [id]);

    async function buscarDados() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/ver_projeto_publico/${id}?token=${token || ''}`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                if (data.projeto) {
                    setProjeto(data.projeto);
                    setOng(data.ong);
                    setAtualizacoes(data.atualizacoes || []);
                }
            }
        } catch (error) { console.error('Erro:', error); }
        finally { setLoading(false); }
    }

    if (loading) return (
        <section className={css.secao}>
            <MenuLateral/>
            <div className={css.conteudo}><p>Carregando...</p></div>
        </section>
    );

    if (!projeto) return (
        <section className={css.secao}>
            <MenuLateral/>
            <div className={css.conteudo}><p>Projeto não encontrado</p></div>
        </section>
    );

    return (
        <section className={css.secao}>
            <MenuLateral/>
            <div className={css.conteudo}>

                {/* Título e ONG */}
                <h1 className={css.tituloProjeto}>{projeto.titulo}</h1>
                {ong && (
                    <p className={css.desenvolvidoPor}>
                        Projeto desenvolvido pela ONG <Link to={`/ong/${ong.id}`}>{ong.nome}</Link>
                    </p>
                )}

                {/* Sobre Nós */}
                <div className={css.secaoBox}>
                    <Titulo titulo={'Sobre Nós'} cor={'preto'}/>
                    <p className={css.descricao}>{projeto.descricao}</p>
                </div>

                {/* Informações */}
                <div className={css.secaoBox}>
                    <div className={css.infoGrid}>
                        <div>
                            <span className={css.infoLabel}>Categoria</span>
                            <p className={css.infoValor}>{projeto.categoria}</p>
                        </div>
                        <div>
                            <span className={css.infoLabel}>Localização</span>
                            <p className={css.infoValor}>{projeto.localizacao || 'Não informada'}</p>
                        </div>
                        <div>
                            <span className={css.infoLabel}>Tipo de ajuda</span>
                            <p className={css.infoValor}>{projeto.tipo_ajuda}</p>
                        </div>
                    </div>
                </div>

                {/* Apoie a ONG */}
                {ong && (
                    <div className={css.secaoBox}>
                        <Titulo titulo={`Apoie o ${ong.nome} diretamente!`} cor={'preto'}/>
                        <div className={css.dadosBancarios}>
                            <p><strong>Instituição:</strong> {ong.cod_banco || 'Não informado'}</p>
                            <p><strong>Agência:</strong> {ong.num_agencia || 'Não informada'}</p>
                            <p><strong>Titular:</strong> {ong.nome}</p>
                            <p><strong>CNPJ:</strong> {ong.cpf_cnpj}</p>
                        </div>
                    </div>
                )}

                {/* Últimas atualizações */}
                {atualizacoes.length > 0 && (
                    <div className={css.secaoBox}>
                        <Titulo titulo={'Últimas atualizações'} cor={'preto'}/>
                        <div className={css.atualizacoesLista}>
                            {atualizacoes.map(att => (
                                <div key={att.id} className={css.atualizacao}>
                                    <h3 className={css.attTitulo}>{att.titulo}</h3>
                                    <p className={css.attTexto}>{att.texto}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
}