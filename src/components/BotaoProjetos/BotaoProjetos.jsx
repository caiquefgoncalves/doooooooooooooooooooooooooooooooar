import { useNavigate } from "react-router-dom";
import css from "./BotaoProjetos.module.css";

export default function BotaoProjetos({ acao, pagina, texto, cor = "amarelo" }) {
    const navigate = useNavigate();

    function handleClick(e) {
        e.preventDefault();
        if (acao) {
            acao();
        }
        if (pagina) {
            navigate(pagina);
        }
    }

    return (
        <button type="button" className={css[cor]} onClick={handleClick}>
            {texto}
        </button>
    );
}