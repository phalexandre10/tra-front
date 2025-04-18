/**
 * Módulo para manipulação do DOM
 * Implementa funções para manipular e atualizar elementos da página
 */

/**
 * Classe para manipulação de elementos da interface
 */
export class DOMManager {
    /**
     * Exibe produtos na interface do usuário
     * @param {Array} produtos - Lista de produtos a serem exibidos
     * @param {string} containerId - ID do elemento contêiner
     */
    static exibirProdutos(produtos, containerId = 'lista-produtos') {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Limpa o conteúdo atual
        container.innerHTML = '';

        // Se não houver produtos
        if (!produtos || produtos.length === 0) {
            container.innerHTML = '<p>Nenhum produto encontrado.</p>';
            return;
        }

        // Para cada produto, cria e adiciona o elemento na página
        produtos.forEach(produto => {
            const produtoElement = document.createElement('div');
            produtoElement.className = 'produto';
            
            // Status de disponibilidade
            const disponibilidade = produto.disponivel 
                ? '<span class="status disponivel">Em estoque</span>' 
                : '<span class="status indisponivel">Fora de estoque</span>';
            
            // Formata o preço para o padrão brasileiro
            const precoFormatado = produto.formatarPreco ? 
                produto.formatarPreco() : 
                produto.preco.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });
            
            // Constrói o HTML do produto
            produtoElement.innerHTML = `
                <img src="${produto.imagem}" alt="${produto.nome}">
                <h3>${produto.nome}</h3>
                <p class="categoria">${produto.categoria}</p>
                <p class="descricao">${produto.descricao}</p>
                <p class="norma">Norma: ${produto.norma}</p>
                <p class="preco">${precoFormatado}</p>
                ${disponibilidade}
                <button data-id="${produto.id}" class="btn-adicionar-orcamento">Adicionar ao Orçamento</button>
            `;
            
            container.appendChild(produtoElement);
        });

        // Adiciona eventos aos botões
        this.inicializarBotoesOrcamento();
    }

    /**
     * Inicializa eventos dos botões de adicionar ao orçamento
     */
    static inicializarBotoesOrcamento() {
        const botoes = document.querySelectorAll('.btn-adicionar-orcamento');
        botoes.forEach(botao => {
            botao.addEventListener('click', (e) => {
                const produtoId = parseInt(e.target.dataset.id);
                this.adicionarAoOrcamento(produtoId);
            });
        });
    }

    /**
     * Adiciona produto ao orçamento
     * @param {number} produtoId - ID do produto
     * @description IMPORTANTE: Este é um método placeholder (stub) que DEVE ser substituído 
     * pela implementação real na classe App. Isso é feito no construtor da classe App 
     * usando: DOMManager.adicionarAoOrcamento = this.adicionarAoOrcamento.bind(this);
     */
    static adicionarAoOrcamento(produtoId) {
        // Este método deve ser substituído pelo implementado em app.js
        // É declarado aqui apenas como um stub
        console.warn('O método adicionarAoOrcamento não foi implementado corretamente. Verifique a inicialização da aplicação.');
    }

    /**
     * Aplica filtro de categoria nos produtos
     * @param {string} categoria - Categoria selecionada
     */
    static aplicarFiltroCategoria(categoria) {
        // Atualiza o botão ativo
        const botoes = document.querySelectorAll('.filtro-categoria');
        botoes.forEach(botao => {
            if (botao.dataset.categoria === categoria) {
                botao.classList.add('ativo');
            } else {
                botao.classList.remove('ativo');
            }
        });
    }

    /**
     * Exibe uma mensagem de carregamento
     * @param {string} containerId - ID do elemento contêiner
     * @param {string} mensagem - Mensagem a ser exibida
     */
    static exibirCarregamento(containerId, mensagem = 'Carregando...') {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = `
            <div class="carregando">
                <div class="spinner"></div>
                <p>${mensagem}</p>
            </div>
        `;
    }

    /**
     * Exibe uma mensagem de erro
     * @param {string} containerId - ID do elemento contêiner
     * @param {string} mensagem - Mensagem de erro
     */
    static exibirErro(containerId, mensagem) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = `
            <div class="mensagem-erro">
                <p>${mensagem}</p>
                <button class="btn-tentar-novamente">Tentar novamente</button>
            </div>
        `;
        
        // Adiciona evento ao botão de tentar novamente
        const btnTentarNovamente = container.querySelector('.btn-tentar-novamente');
        if (btnTentarNovamente) {
            btnTentarNovamente.addEventListener('click', () => {
                // Dispara evento customizado que será tratado pelo app.js
                document.dispatchEvent(new CustomEvent('tentarNovamente', {
                    detail: { containerId }
                }));
            });
        }
    }

    /**
     * Exibe um modal com mensagem para o usuário
     * @param {string} titulo - Título do modal
     * @param {string} mensagem - Conteúdo do modal
     * @param {string} tipo - Tipo do modal (sucesso, erro, alerta)
     */
    static exibirModal(titulo, mensagem, tipo = 'info') {
        // Verifica se já existe um modal
        let modal = document.getElementById('modal-mensagem');
        
        // Se não existir, cria o modal
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modal-mensagem';
            modal.className = 'modal';
            document.body.appendChild(modal);
        }
        
        // Define o conteúdo do modal
        modal.innerHTML = `
            <div class="modal-conteudo modal-${tipo}">
                <span class="fechar-modal">&times;</span>
                <h3>${titulo}</h3>
                <div class="modal-corpo">
                    <p>${mensagem}</p>
                </div>
                <div class="modal-rodape">
                    <button class="btn-fechar-modal">Fechar</button>
                </div>
            </div>
        `;
        
        // Exibe o modal
        modal.style.display = 'flex';
        
        // Adiciona eventos para fechar o modal
        const fecharModal = () => {
            modal.style.display = 'none';
        };
        
        modal.querySelector('.fechar-modal').addEventListener('click', fecharModal);
        modal.querySelector('.btn-fechar-modal').addEventListener('click', fecharModal);
        
        // Fecha o modal se clicar fora do conteúdo
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                fecharModal();
            }
        });
    }
}

/**
 * Classe para gerenciar eventos do DOM
 */
export class EventosManager {
    /**
     * Inicializa eventos dos filtros de categoria
     * @param {Function} callback - Função a ser chamada quando filtro for selecionado
     */
    static inicializarFiltrosCategorias(callback) {
        const filtros = document.querySelectorAll('.filtro-categoria');
        filtros.forEach(filtro => {
            filtro.addEventListener('click', (e) => {
                e.preventDefault();
                const categoria = filtro.dataset.categoria;
                callback(categoria);
            });
        });
    }

    /**
     * Inicializa evento de envio do formulário de orçamento
     * @param {Function} callback - Função a ser chamada quando formulário for enviado
     */
    static inicializarFormularioOrcamento(callback) {
        const formulario = document.getElementById('form-orcamento');
        if (formulario) {
            formulario.addEventListener('submit', (e) => {
                e.preventDefault();
                callback(formulario);
            });
        }
    }

    /**
     * Adiciona evento de rolagem suave para links internos
     */
    static inicializarRolagemSuave() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const id = link.getAttribute('href');
                const elemento = document.querySelector(id);
                
                if (elemento) {
                    elemento.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
} 