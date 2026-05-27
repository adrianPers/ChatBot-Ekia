
import styles from "./mensagem.module.css";

const Mensagem = ({ dados, funcoes }) => {
    if (dados.tipo == "texto") {
        return (

            <div className={styles.boxMensagem}>

                <p className={styles.mensagemTexto}
                    style={{
                        backgroundColor: dados.autor == "bot" || dados.autor == "atendente" ? "#37677e" : "#1989bd",
                        float: dados.autor == "bot" || dados.autor == "atendente" ? "left" : "right",
                    }}>
                    {dados.conteudo}
                    <br />
                    <span>{dados.hora}</span>
                </p>
            </div>
        )
    } else {
        return (
            <div className={styles.boxMensagem}>
                <div className={styles.caixaBotoes}>
                    <p>{dados?.conteudo}</p>
                    {dados.botoes.map((botao, index) => (
                        <button
                            onClick={(e) => {
                                funcoes[0](e.target.innerHTML, "cliente");
                                funcoes[1](false);
                                botao.acao();
                                [...e.target.parentElement.children].map(
                                    btn => btn.disabled = true
                                )
                            }}
                            key={index}>
                            {botao.conteudo}
                        </button>
                    ))}
                </div>
            </div>
        )
    }
}

export default Mensagem;

