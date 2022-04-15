class Print{
    constructor(){
        this.nome = "Foi";
    }
    imprime(){
        console.log(this.nome);
    }
    getNome(){
        return this.nome;
    }
};

module.exports = Print;