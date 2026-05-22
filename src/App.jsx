import styles from './app.module.css';
import { useState, useEffect } from 'react';

const App = () => {

  const [mensagens, setMensagens] = useState([]);
  const [value, setValue] = useState();



  const HandleEnvio = () => {
    // if(mensagem != ""){
    //   let mensage = {
    //     autor: "c",
    //     content: value,
    //     hora: "19:00",
    //     data: "12/12/2020"
    //   }
    // }
    setMensagens([
      ...mensagens,
      {
        autor: "c",
        content: value,
        hora: "19:00",
        data: "12/12/2020"
      }
    ]);
    setValue("");
  }
  

  return (
    <div className={styles.app}>


      <header className={styles.header}> Eko </header>

      <div className={styles.boxConversa}>
        {mensagens.map(
          (mensagem, index) => (
            <p key={index} 
              className={styles.mensagem}>
              {mensagem.content}
            </p>
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
