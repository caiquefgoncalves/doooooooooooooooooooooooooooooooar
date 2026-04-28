import { useState } from 'react'
import css from './InputArquivo.module.css'

export default function InputArquivo({ required = false, tamanho = "normal", alterarInput }) {

    const [nomeArquivo, setNomeArquivo] = useState("Nenhum arquivo selecionado")

    function handleChange(e) {
        const file = e.target.files[0]

        if (file) {
            setNomeArquivo(file.name)
        } else {
            setNomeArquivo("Nenhum arquivo selecionado")
        }

        // Chama a função do pai para salvar o arquivo
        if (alterarInput) {
            alterarInput(e)
        }
    }

    return (
        <div className={css.inputGroup}>
            <label className={css.label}>Foto de Perfil</label>

            <label className={`${css.botao} ${css[tamanho]}`}>
                Selecionar arquivo
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    required={required}
                    className={css.inputFile}
                />
            </label>

            <span className={css.nome}>{nomeArquivo}</span>
        </div>
    )
}