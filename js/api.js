/**
 * Módulo para comunicação com API externa
 * Utiliza fetch, async/await e promises para obter dados de produtos EPI
 */

// URL base da API pública de segurança do trabalho (simulada)
const API_URL = 'https://api.safeworkapi.com/v1';

// Token de autenticação (simulado)
const API_TOKEN = 'sim_12345abcde';

/**
 * Classe para comunicação com API externa
 */
class ApiService {
    constructor() {
        this.baseUrl = API_URL;
        this.token = API_TOKEN;
        
        // Define os headers padrão para requisições diretamente como propriedade
        this.headers = {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    /**
     * Realiza requisição HTTP para a API
     * @param {string} endpoint - Endpoint da API
     * @param {string} method - Método HTTP (GET, POST, etc)
     * @param {Object} data - Dados para enviar (opcional)
     * @returns {Promise} Promise com resposta da API
     */
    async fetchData(endpoint, method = 'GET', data = null) {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const options = {
                method,
                headers: this.headers,
                credentials: 'same-origin'
            };

            // Adiciona corpo da requisição se for POST, PUT, etc
            if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
                options.body = JSON.stringify(data);
            }

            // Simula latência de rede
            await new Promise(resolve => setTimeout(resolve, 500));

            // Em ambiente real, faria a requisição efetiva:
            // const response = await fetch(url, options);
            
            // Simula a resposta da API para desenvolvimento
            return this.getMockResponse(endpoint, method, data);
        } catch (error) {
            throw new Error(`Falha na comunicação com o servidor: ${error.message}`);
        }
    }

    /**
     * Obtém lista de produtos da API
     * @returns {Promise<Array>} Lista de produtos
     */
    async getProdutos() {
        return this.fetchData('/produtos');
    }

    /**
     * Obtém produtos por categoria
     * @param {string} categoria - Nome da categoria
     * @returns {Promise<Array>} Lista de produtos da categoria
     */
    async getProdutosPorCategoria(categoria) {
        return this.fetchData(`/produtos?categoria=${encodeURIComponent(categoria)}`);
    }

    /**
     * Envia solicitação de orçamento
     * @param {Object} dados - Dados do formulário de orçamento
     * @returns {Promise<Object>} Confirmação do envio
     */
    async enviarOrcamento(dados) {
        return this.fetchData('/orcamentos', 'POST', dados);
    }

    /**
     * Simula respostas da API para desenvolvimento
     * @param {string} endpoint - Endpoint da API
     * @param {string} method - Método HTTP
     * @param {Object} data - Dados enviados
     * @returns {Promise<Object>} Resposta simulada
     */
    getMockResponse(endpoint, method, data) {
        // Dados simulados para desenvolvimento (reduzidos)
        const produtosAPI = [
            {
                id: 1,
                nome: "Capacete de Segurança",
                categoria: "Proteção para cabeça",
                descricao: "Capacete de segurança com carneira ajustável.",
                preco: 45.90,
                imagem: "https://images.tcdn.com.br/img/img_prod/1194153/capacete_de_seguranca_plastcor_classe_b_plt_com_suspensao_branco_c_a_31469_147_1_8a9972e99498fae2c80d7f36c11f4afd.png",
                norma: "NBR 8221",
                disponivel: true
            },
            {
                id: 2,
                nome: "Respirador PFF2",
                categoria: "Proteção respiratória",
                descricao: "Proteção respiratória contra poeiras e névoas.",
                preco: 6.50,
                imagem: "https://d3bhvz7al37iy6.cloudfront.net/Custom/Content/Products/10/53/1053479_mascara-respiratoria-pff2-vo-pro-agro-com-valvula-e-carvao-ativado-delta-plus-ca-38507-_s3_638315746781260540.webp",
                norma: "NBR 13698",
                disponivel: true
            },
            {
                id: 3,
                nome: "Luva de Segurança",
                categoria: "Proteção para mãos",
                descricao: "Luva de segurança confeccionada em látex.",
                preco: 8.90,
                imagem: "https://images.tcdn.com.br/img/img_prod/995770/luva_de_latex_super_safety_silver_amarela_9153_1_9a1f5956137237a0929dae9453420331.jpg",
                norma: "NBR 13392",
                disponivel: true
            },
            {
                id: 4,
                nome: "Protetor Auricular",
                categoria: "Proteção auricular",
                descricao: "Protetor auricular tipo plug de silicone.",
                preco: 3.50,
                imagem: "https://telhanorte.vtexassets.com/arquivos/ids/1257794-400-auto",
                norma: "NBR 16076",
                disponivel: true
            },
            {
                id: 5,
                nome: "Bota de Segurança",
                categoria: "Proteção para os pés",
                descricao: "Bota de segurança com biqueira de composite.",
                preco: 89.90,
                imagem: "https://cdn-themes.shoppub.io/6deacde3-3e01-4460-bcbf-db7107562dea/live/static/assets/img/Newsletter-Mobile3.jpg?_ts=1694024375",
                norma: "NBR ISO 20345",
                disponivel: true
            },
            {
                id: 6,
                nome: "Óculos de Proteção",
                categoria: "Proteção facial e ocular",
                descricao: "Óculos de segurança com lente incolor e proteção lateral.",
                preco: 12.90,
                imagem: "https://centercor.vtexassets.com/arquivos/ids/525046-800-auto?v=638334305340800000&width=800&height=auto&aspect=true",
                norma: "NBR 16360",
                disponivel: true
            },
            {
                id: 7,
                nome: "Protetor Auricular Tipo Concha",
                categoria: "Proteção auricular",
                descricao: "Protetor auricular tipo concha.",
                preco: 78.05,
                imagem: "https://m.media-amazon.com/images/I/51nwjQebQCL.__AC_SX300_SY300_QL70_ML2_.jpg",
                norma: "NBR 16390",
                disponivel: false
            },
            {
                id: 8,
                nome: "Respirador Purificador De Ar",
                categoria: "Proteção respiratória",
                descricao: "Respirador purificador de ar de segurança.",
                preco: 60.50,
                imagem: "https://http2.mlstatic.com/D_NQ_NP_2X_663086-MLB51778832852_092022-F-respirador-purificador-de-ar-seguranca-destra-com-2-filtros.webp",
                norma: "NBR 13681",
                disponivel: true
            },
            {
                id: 9,
                nome: "Luva Tricotada Pigmentada Emborrachada",
                categoria: "Proteção para mãos",
                descricao: "Par de luva de segurança tricotada com fios de algodão e poliéster.",
                preco: 11.90,
                imagem: "https://m.media-amazon.com/images/I/61SB2UgsjiL._AC_SX569_.jpg",
                norma: "NBR 13458",
                disponivel: false
            },
            {
                id: 10,
                nome: "Meia Térmica de Algodão ",
                categoria: "Proteção para pés",
                descricao: "Proteção dos pés do usuário em ambientes de baixa temperatura.",
                preco: 7.90,
                imagem: "https://d3bhvz7al37iy6.cloudfront.net/Custom/Content/Products/10/65/1065805_meia-termica-de-algodao-preta-prevemax-para-baixa-temperatura-ca-44422_m1_638114548393134663.webp",
                norma: "NBR 13446",
                disponivel: true
            }
        ];

        // Simula respostas com base no endpoint
        if (endpoint === '/produtos') {
            return produtosAPI;
        } 
        else if (endpoint.startsWith('/produtos?categoria=')) {
            const categoria = decodeURIComponent(endpoint.split('=').pop());
            const produtosFiltrados = produtosAPI.filter(p => 
                p.categoria.toLowerCase().includes(categoria.toLowerCase())
            );
            return produtosFiltrados;
        }
        else if (endpoint === '/orcamentos' && method === 'POST') {
            return {
                sucesso: true,
                mensagem: 'Orçamento recebido com sucesso',
                protocolo: `ORC-${Date.now()}`,
                previsao: '24 horas úteis'
            };
        }
        
        return { erro: 'Endpoint não encontrado' };
    }
}

// Exporta a classe para uso em outros módulos
export default new ApiService(); 