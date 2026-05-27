import styles from './app.module.css';
import { useState, useEffect, useRef } from 'react';
import Mesagem from './components/Mensagem/Mensagem';
import { getItems, setItens, updateItems } from './services/localStore';
import { socket } from './socket';
import IconCliente from "./assets/iconCliente.svg"
const App = () => {

  const [mensagens, setMensagens] = useState([]);
  const [value, setValue] = useState();
  const [modoAtendimento, setModoAtendimento] = useState("bot");
  const idConversa = useRef(null);
  const boxConversa = useRef(null);
  const boxInput = useRef(null);
  const [nome, setNome] = useState("");

  let status = useRef(0);



  useEffect(() => {



    if (!boxConversa.current) return;

    boxConversa.current.scrollTo({
      top: boxConversa.current.scrollHeight,
      behavior: "smooth"
    });

  }, [mensagens]);

  useEffect(() => {

    const buscarNome = async () => {

      const res = await getItems("@nome");
      setNome(res || "");
    }

    buscarNome();

    const gerarIdConversa = async () => {


      idConversa.current = await getItems("@idConversa");

      if (!idConversa.current) {

        idConversa.current = crypto.randomUUID();

        await setItens("@idConversa", idConversa.current);

      }

    }

    gerarIdConversa();

    socket.on("receber-mensagem", (mensagem) => {
      setMensagens((prev) => [...prev, mensagem]);
    });

    return () => { socket.off("receber-mensagem"); };

  }, []);
  

  const enviarParaAtendente = (texto, autor) => {
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

  const addMensagemTexto = (texto, autor) => {
    const mensagem = {
      id: crypto.randomUUID(),
      idConversa: idConversa.current,
      nome: nome,
      autor: autor ? autor : 'bot',
      tipo: "texto",
      conteudo: texto,
      hora: getHora(),
      data: "12/12/2012",
      botoes: []
    }

    console.log(idConversa.current + " <=");

    if (modoAtendimento == "atendente") {
      socket.emit(
        "enviar-mensagem",
        mensagem
      );
    } else {
      setTimeout(
        () => setMensagens((prev) => [...prev, mensagem]),
        (autor != "cliente" ? 1000 : 0)
      );
    }
  };

  const desativarInput = (value) => {
    // if (!boxInput.current) return;
    // boxInput.current.children[0].readOnly = value;
    // boxInput.current.children[1].disabled = value;
  }

  const enviarCaixaBotoes = (dados) => {

    const mensagem = {
      autor: "bot",
      tipo: "botoes",
      conteudo: dados.texto,
      hora: getHora(),
      data: "12/12/2012",
      botoes: dados.botoes
    }

    // desativarInput(true);

    setTimeout(() => setMensagens((prev) => [...prev, mensagem]), 1000);
  };

  const conteudoMenuInicial = {
    texto: "Como posso te ajudar",
    botoes: [
      {
        conteudo: "Ver Produtos"
      }, {
        conteudo: "problemas com a compra",
        acao : () => enviarCaixaBotoes(conteudoMenuProblemas)
      }, {
        conteudo: "Sobre a Loja",
        acao: () => enviarCaixaBotoes(conteudoMenuInfo)
      }, {
        conteudo: "Falar com atendente",
        acao: () => iniciarChatOnline()
      }
    ]
  };

  const conteudoMenuProblemas = {
    texto: "Como posso te ajudar",
    botoes: [
      {
        conteudo: "Cancelar compra",
        acao : () => {status.current=3211; responder()}
      }, {
        conteudo: "Relatar Problema",
        acao : () => {status.current=3212; responder()}
      }, {
        conteudo: "Falar com atendente"
      }
    ]
  }

  const getHora = () => {
    const hora = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return hora;
  }

  const iniciarChatOnline = async () => {

    setModoAtendimento("atendente");
    console.log(idConversa.current);
    addMensagemTexto("Passando para um atendente");

    console.log(idConversa.current + "<=");

    socket.emit("entrar-conversa", {
      conversaId : idConversa.current,
      nome
    });

    const aviso = {
      id: crypto.randomUUID(),
      idConversa: idConversa.current,
      autor: 'cliente',
      tipo: "texto",
      conteudo: `${nome} solicita atendimento`,
      nome: nome,
      hora: getHora(),
      data: "12/12/2012",
      botoes: []
    }

    socket.emit("enviar-mensagem", aviso)
  }

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

    addMensagemTexto(textosInformativos[opcao]);
    setTimeout(() => {
      enviarCaixaBotoes(conteudoMenuFimInfo)
    }, 2000);

  }


  const HandleEnvio = () => {   
    if (!value.trim()) return;
    addMensagemTexto(value, "cliente");
    setValue("");
    enviarMensagem();
  }

  // useEffect(() => {
  //   addMensagemTexto("Olá sou Ekia asistemte da loja Eko")
  //   enviarCaixaBotoes(conteudoMenuInicial);
  // }, []);

  const enviarMensagem = () => {
    if(!(value.trim()))return;
    responder();
  }

  const responder = () => {
    switch(status.current){
      case 0 : 
        addMensagemTexto("Olá sou Ekia asistemte da loja Eko")
        enviarCaixaBotoes(conteudoMenuInicial);
        console.log(status.current);
      break;
      case 3211 : 
        addMensagemTexto("Informe seu nome");
        status.current = 32111;
        console.log(status.current);
      break;
      case 3212: 
        addMensagemTexto("Informe seu nome");
        status.current = 32121;
        console.log(status.current);
      break;
      case 32111 : 
        addMensagemTexto("Me informe o nome do produto comprado");
        status.current = 32112;
        console.log(status.current);
      break;
      case 32121: 
        addMensagemTexto("Me informe o nome do produto comprado");
        status.current = 32122;
        console.log(status.current);
      break;
      case 32112 : 
        addMensagemTexto("Me informe o motivo do cancelamento");
        status.current = 32113;
        console.log(status.current);
      break;
      case 32122: 
        addMensagemTexto("Relate o problema");
        status.current = 32123;
        console.log(status.current);
      break;
      case 32113 : 
        gearResumo();
      break;
      case 32123: 
        gearResumo();
      break;

    } 
  }

  const gearResumo = ()  => {

      // addMensagemTexto(`Solicitação de atendomento: ${mensagens[length-4].conteudo}`);
      // addMensagemTexto(`Clente : ${mensagens[length-2].conteudo}`);
      // addMensagemTexto(`Clente : ${mensagens[length].conteudo}`)

  }


  return (



    <div className={styles.app}>


      <header className={styles.header}>
        <p>EKo</p>

        <div>

          <input type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            onBlur={() => setItens("@nome", nome)}
            placeholder="Digite seu nome"
          />

          <img src={IconCliente} alt="icon user" />
        </div>

      </header>

      <div className={styles.boxConversa} ref={boxConversa}>
        {mensagens.map(
          (mensagem, index) => (
            <Mesagem key={index} dados={mensagem} funcoes={[addMensagemTexto, desativarInput]} />
          )
        )}
        <div className={styles.teste}></div>
      </div>

      <div className={styles.boxInput} ref={boxInput}>
        <textarea
          className={styles.input}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              HandleEnvio();
            }
          }}
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
