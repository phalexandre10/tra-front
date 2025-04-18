/**
 * Módulo de modelos (entidades) 
 * Implementa classes e herança para representar entidades do sistema
 */

/**
 * Classe base para todos os produtos
 */
export class Produto {
    constructor(id, nome, categoria, descricao, preco, imagem, norma, disponivel) {
        this.id = id;
        this.nome = nome;
        this.categoria = categoria;
        this.descricao = descricao;
        this.preco = preco;
        this.imagem = imagem || "https://via.placeholder.com/300x200.png?text=Produto+EPI";
        this.norma = norma;
        this.disponivel = disponivel !== false;
    }

    /**
     * Verifica se o produto está disponível para venda
     * @returns {boolean} Disponibilidade do produto
     */
    estaDisponivel() {
        return this.disponivel;
    }

    /**
     * Formata o preço para o padrão brasileiro
     * @returns {string} Preço formatado
     */
    formatarPreco() {
        return this.preco.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }
}

/**
 * Classe para representar equipamentos de proteção para cabeça
 * Herda da classe Produto
 */
export class ProtecaoParaCabeca extends Produto {
    constructor(id, nome, descricao, preco, imagem, norma, disponivel, material, ajustavel) {
        super(id, nome, "Proteção para cabeça", descricao, preco, imagem, norma, disponivel);
        this.material = material || "Polietileno de alta densidade";
        this.ajustavel = ajustavel !== false;
    }
}

/**
 * Classe para representar equipamentos de proteção respiratória
 * Herda da classe Produto
 */
export class ProtecaoRespiratoria extends Produto {
    constructor(id, nome, descricao, preco, imagem, norma, disponivel, tipo, fatorProtecao) {
        super(id, nome, "Proteção respiratória", descricao, preco, imagem, norma, disponivel);
        this.tipo = tipo || "Descartável";
        this.fatorProtecao = fatorProtecao || "P2";
    }
}

/**
 * Classe para representar equipamentos de proteção para mãos
 * Herda da classe Produto
 */
export class ProtecaoParaMaos extends Produto {
    constructor(id, nome, descricao, preco, imagem, norma, disponivel, material, tamanho) {
        super(id, nome, "Proteção para mãos", descricao, preco, imagem, norma, disponivel);
        this.material = material || "Látex";
        this.tamanho = tamanho || "M";
    }
}

/**
 * Classe para representar equipamentos de proteção para os pés
 * Herda da classe Produto
 */
export class ProtecaoParaPes extends Produto {
    constructor(id, nome, descricao, preco, imagem, norma, disponivel, tipoBiqueira, tamanho) {
        super(id, nome, "Proteção para os pés", descricao, preco, imagem, norma, disponivel);
        this.tipoBiqueira = tipoBiqueira || "Composite";
        this.tamanho = tamanho || "40";
    }
}

/**
 * Classe para representar equipamentos de proteção facial e ocular
 * Herda da classe Produto
 */
export class ProtecaoFacialOcular extends Produto {
    constructor(id, nome, descricao, preco, imagem, norma, disponivel, tipoLente, antiEmbaçante) {
        super(id, nome, "Proteção facial e ocular", descricao, preco, imagem, norma, disponivel);
        this.tipoLente = tipoLente || "Incolor";
        this.antiEmbaçante = antiEmbaçante !== false;
    }
}

/**
 * Fábrica para criar produtos com base em dados da API
 */
export class ProdutoFactory {
    /**
     * Cria uma instância de produto com base nos dados
     * @param {Object} dadosProduto - Dados do produto da API 
     * @returns {Produto} Instância do produto criado
     */
    static criarProduto(dadosProduto) {
        const categoria = dadosProduto.categoria?.toLowerCase() || '';
        
        if (categoria.includes('cabeça')) {
            return new ProtecaoParaCabeca(
                dadosProduto.id,
                dadosProduto.nome,
                dadosProduto.descricao,
                dadosProduto.preco,
                dadosProduto.imagem,
                dadosProduto.norma,
                dadosProduto.disponivel,
                dadosProduto.material,
                dadosProduto.ajustavel
            );
        } 
        else if (categoria.includes('respiratória')) {
            return new ProtecaoRespiratoria(
                dadosProduto.id,
                dadosProduto.nome,
                dadosProduto.descricao,
                dadosProduto.preco,
                dadosProduto.imagem,
                dadosProduto.norma,
                dadosProduto.disponivel,
                dadosProduto.tipo,
                dadosProduto.fatorProtecao
            );
        }
        else if (categoria.includes('mãos')) {
            return new ProtecaoParaMaos(
                dadosProduto.id,
                dadosProduto.nome,
                dadosProduto.descricao,
                dadosProduto.preco,
                dadosProduto.imagem,
                dadosProduto.norma,
                dadosProduto.disponivel,
                dadosProduto.material,
                dadosProduto.tamanho
            );
        }
        else if (categoria.includes('pés')) {
            return new ProtecaoParaPes(
                dadosProduto.id,
                dadosProduto.nome,
                dadosProduto.descricao,
                dadosProduto.preco,
                dadosProduto.imagem,
                dadosProduto.norma,
                dadosProduto.disponivel,
                dadosProduto.tipoBiqueira,
                dadosProduto.tamanho
            );
        }
        else if (categoria.includes('facial') || categoria.includes('ocular')) {
            return new ProtecaoFacialOcular(
                dadosProduto.id,
                dadosProduto.nome,
                dadosProduto.descricao,
                dadosProduto.preco,
                dadosProduto.imagem,
                dadosProduto.norma,
                dadosProduto.disponivel,
                dadosProduto.tipoLente,
                dadosProduto.antiEmbaçante
            );
        }
        else {
            return new Produto(
                dadosProduto.id,
                dadosProduto.nome,
                dadosProduto.categoria,
                dadosProduto.descricao,
                dadosProduto.preco,
                dadosProduto.imagem,
                dadosProduto.norma,
                dadosProduto.disponivel
            );
        }
    }
} 