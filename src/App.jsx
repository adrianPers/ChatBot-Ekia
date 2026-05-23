import styles from './app.module.css';
import { useState, useEffect, useRef } from 'react';
import Mesagem from './components/Mensagem/Mensagem';

const App = () => {

  const [mensagens, setMensagens] = useState([]);
  const [value, setValue] = useState();

   const chatRef = useRef(null);

  useEffect(() => {

   chatRef.current.scrollTo({

    top: chatRef.current.scrollHeight,

    behavior: "smooth"

  });
  }, [mensagens]);


  const enviarMensagemTexto = (texto, autor) => {



    const mensagem = {
      autor: autor ? autor : 'bot',
      tipo: "texto",
      conteudo: texto,
      hora: "19:10",
      data: "12/12/2012",
      botoes: []
    }

    setTimeout(() => {
      setMensagens((prev) => [
        ...prev,
        mensagem
      ]);
    }, (autor != "cliente" ? 1000 : 0));
  };

  const enviarCaixaBotoes = (dados) => {

    const mensagem = {
      autor: "bot",
      tipo: "botoes",
      conteudo: dados.texto,
      hora: "19:10",
      data: "12/12/2012",
      botoes: dados.botoes
    }

    setTimeout(() => {
      setMensagens((prev) => [
        ...prev,
        mensagem
      ]);
    }, 1000);
  };

  const conteudoMenuInicial = {
    texto: "Como posso te ajudar",
    botoes: [
      {
        conteudo: "Ver Produtos"
      }, {
        conteudo: "problemas com a compra"
      }, {
        conteudo: "Sobre a Loja",
        acao: () => enviarCaixaBotoes(conteudoMenuInfo)
      }, {
        conteudo: "Falar com atendente"
      }
    ]
  };

  const conteudoMenuInfo = {
    texto: "Sobre a Eko",
    botoes: [
      {
        conteudo: "Informações de Funcionamento",
        acao: () => enviarIformacoesDaLoja(0)
      }, {
        conteudo: "Sobre a Loja",
        acao: () => enviarIformacoesDaLoja(1)
      }, {
        conteudo: "Sustentabilidade",
        acao: () => enviarIformacoesDaLoja(2)
      }
    ]
  };

  const conteudoMenuFimInfo = {
    texto: "Como deseja prosseguir?",
    botoes: [
      {
        conteudo: "Menu inicial",
        acao: () => enviarCaixaBotoes(conteudoMenuInicial)
      }, {
        conteudo: "Outras informações",
        acao: () => enviarCaixaBotoes(conteudoMenuInfo)
      }, {
        conteudo: "Falar com atente"
      }, {
        conteudo: "Encerrar conversa"
      }
    ]
  };

  const textosInformativos = [
    "Funciona quando nois que",
    "É uma loja legal",
    "Gostamos de tartarugas"
  ];

  // caixa de boteos do fim do fluxo informativo

  const enviarIformacoesDaLoja = (opcao) => {

    enviarMensagemTexto(textosInformativos[opcao]);
    setTimeout(() => {
      enviarCaixaBotoes(conteudoMenuFimInfo)
    }, 2000);

  }  


  const HandleEnvio = () => {
    if (!value.trim()) return;
    enviarMensagemTexto(value, "cliente");
    setValue("");
  }

  useEffect(() => {
    enviarMensagemTexto("Olá sou Ekia asistemte da loja Eko")
    enviarCaixaBotoes(conteudoMenuInicial);
  }, [])


  return (
    <div className={styles.app}>


      <header className={styles.header}> Eko </header>

      <div className={styles.boxConversa} ref={chatRef}>
        {mensagens.map(
          (mensagem, index) => (
            <Mesagem key={index} dados={mensagem} opcaoEscolida={enviarMensagemTexto}/>
          )
        )}
        <div className={styles.teste}></div>
      </div>

      <div className={styles.boxInput}>
        <textarea
          className={styles.input}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        ></textarea>
        <button
          className={styles.btnEnviar}
          onClick={HandleEnvio}
        >
          &gt;
        </button>
      </div>


    </div>
  )
}

export default App;
