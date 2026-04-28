// App.jsx
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import CadastroOng from "./pages/CadastroOng.jsx";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import CadastroDoador from "./pages/CadastroDoador.jsx";
import CadastroAdm from "./pages/CadastroAdm.jsx";
import EsqueciSenha from "./pages/EsqueciSenha.jsx";
import VerificarCodigoSenha from "./pages/VerificarCodigoSenha.jsx";
import TelaErro from "./pages/TelaErro.jsx";
import RedefinirSenha from "./pages/RedefinirSenha.jsx";
import AreaRestrita from "./pages/AreaRestrita.jsx";
import ConfirmarEmail1 from "./components/ConfirmarEmail1/ConfirmarEmail1.jsx";
import Atualizacao from "./pages/Atualizacao.jsx";
import EditarAtualizacao from "./pages/EditarAtualizacao.jsx";
import DashboardDaOng from "./pages/DashboardDaOng.jsx";
import AprovarOngs from "./pages/AprovarOngs.jsx";
import EdicaoOng from "./pages/EdicaoOng.jsx";
import AprovacoesReprovacoes from "./pages/AprovacoesReprovacoes.jsx";
import Teste from "./pages/Teste.jsx";
import DashboardAdm from "./pages/DashboardAdm.jsx";
import ListaAprovacoes from "./pages/ListaAprovacoes.jsx";
import AprovarOng1 from "./components/AprovarOng1/AprovarOng1.jsx";
import EditarOng from './pages/EditarOng.jsx';
import EditarDoador from './pages/EditarDoador.jsx';
import DashboardDaOng1 from './components/DashboardDaOng1/DashboardDaOng1.jsx';
import CriarProjeto1 from './components/CriarProjeto1/CriarProjeto1.jsx';
import EditarProjeto1 from './components/EditarProjeto1/EditarProjeto1.jsx';
import CriarAtualizacao from './pages/CriarAtualizacao.jsx';
import EditarAtualizacao1 from './components/EditarAtualizacao1/EditarAtualizacao1.jsx';
import Feed1 from './components/Feed1/Feed1.jsx';
import PaginaOng1 from './components/PaginaOng1/PaginaOng1.jsx';
import PaginaProjeto1 from './components/PaginaProjeto1/PaginaProjeto1.jsx';
import Busca1 from './components/Busca1/Busca1.jsx';
import Ongs1 from './components/Ongs1/Ongs1.jsx';
import Projetos1 from './components/Projetos1/Projetos1.jsx';

export default function App() {
    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/cadastroOng" element={<CadastroOng/>} />
                <Route path="/cadastroDoador" element={<CadastroDoador/>} />
                <Route path="/cadastroAdm" element={<CadastroAdm/>} />
                <Route path={"/confirmaremail"} element={<ConfirmarEmail1/>} />
                <Route path="/esqueciSenha" element={<EsqueciSenha/>} />
                <Route path="/redefinirSenha" element={<RedefinirSenha/>} />
                <Route path="/verificarCodigo" element={<VerificarCodigoSenha/>} />
                <Route path="/dashboard" element={<AreaRestrita/>} />
                <Route path="/postagem" element={<Atualizacao/>} />
                <Route path="/editarPostagem" element={<EditarAtualizacao/>} />
                <Route path="/dashboardAdm" element={<DashboardAdm/>} />
                <Route path="/aprovarOngs" element={<AprovarOngs/>} />
                <Route path="/editarOng" element={<EdicaoOng/>} />
                <Route path="/aprovarReprovar" element={<AprovacoesReprovacoes/>} />
                <Route path="/teste" element={<Teste/>} />
                <Route path="/listaAprovacoes" element={<ListaAprovacoes/>} />
                <Route path="/aprovarOng1/:id" element={<AprovarOng1/>} />
                <Route path="/editarOng/:id" element={<EditarOng/>} />
                <Route path="/editarDoador/:id" element={<EditarDoador/>} />
                <Route path="/dashboardOng" element={<DashboardDaOng1/>} />
                <Route path="/criarProjeto" element={<CriarProjeto1/>} />
                <Route path="/editarProjeto/:id" element={<EditarProjeto1/>} />
                <Route path="/criarAtualizacao" element={<CriarAtualizacao/>} />
                <Route path="/editarAtualizacao/:id" element={<EditarAtualizacao1/>} />
                <Route path="/feed" element={<Feed1/>} />
                <Route path="/ong/:id" element={<PaginaOng1/>} />
                <Route path="/projeto/:id" element={<PaginaProjeto1/>} />
                <Route path="/busca" element={<Busca1/>} />
                <Route path="/ongs" element={<Ongs1/>} />
                <Route path="/projetos" element={<Projetos1/>} />

                <Route path="/*" element={<TelaErro/>} />
            </Routes>
            <Footer/>
        </BrowserRouter>
    )
}