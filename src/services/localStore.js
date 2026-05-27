
const updateItems = async (key, novoItem) => {
    try{
        const itens = await getItems(key);
        const atualizado = [...itens, novoItem];    
        localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizado));
        return novoItem;
    }catch(error){
        console.error("erro :", error);
        return [];
    }
}

const getItems = async (key) => {
    try{
        const dados = await localStorage.getItem(key);
        return dados ? JSON.parse(dados) : undefined;
    }catch(error){
        console.error("erro :", error);
        return [];
    }
}

const setItens = (key, item) => {
    try{
        localStorage.setItem(key, JSON.stringify(item));
    }catch(error){
        console.error("erro :", error);
        return [];
    }
}

export { setItens, getItems, updateItems} 