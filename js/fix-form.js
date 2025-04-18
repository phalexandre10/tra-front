/**
 * Script para verificar e corrigir o formulário de orçamento
 * Este arquivo complementa o app.js para garantir que o formulário de orçamento
 * seja inicializado corretamente mesmo em casos de problemas no carregamento
 */

class FormularioCorrecao {
    /**
     * Inicializa a classe de correção do formulário
     */
    constructor() {
        this.aguardarDOMCarregado();
    }
    
    /**
     * Aguarda o DOM estar completamente carregado antes de iniciar
     */
    aguardarDOMCarregado() {
        document.addEventListener('DOMContentLoaded', () => {
            // Aguarda um pouco para garantir que o app.js já foi executado
            setTimeout(() => this.verificarFormulario(), 1000);
            
            // Aguarda mais tempo e verifica se a App está disponível na janela global
            setTimeout(() => this.salvarInstanciaApp(), 1500);
        });
    }
    
    /**
     * Salva a instância da App na janela global se disponível
     */
    salvarInstanciaApp() {
        if (window.app) {
            window.appInstance = window.app;
        }
    }
    
    /**
     * Verifica se o formulário existe e precisa de correção
     */
    verificarFormulario() {
        const formulario = document.getElementById('form-orcamento');
        if (!formulario) return;
        
        // Verifica se a área de produtos selecionados já existe
        if (document.getElementById('produtos-selecionados')) {
            return; // Nada a fazer, área já existe
        }
        
        this.criarAreaProdutosSelecionados(formulario);
    }
    
    /**
     * Cria a área de produtos selecionados no formulário
     * @param {HTMLElement} formulario - O formulário onde a área será criada
     */
    criarAreaProdutosSelecionados(formulario) {
        // Cria o contêiner para produtos selecionados
        const produtosSelecionadosDiv = document.createElement('div');
        produtosSelecionadosDiv.id = 'produtos-selecionados';
        produtosSelecionadosDiv.className = 'campo-formulario';
        
        // Adiciona o título
        const titulo = document.createElement('h3');
        titulo.textContent = 'Produtos Selecionados';
        produtosSelecionadosDiv.appendChild(titulo);
        
        // Adiciona a lista de produtos
        const listaProdutos = document.createElement('ul');
        listaProdutos.id = 'lista-produtos-selecionados';
        listaProdutos.className = 'lista-produtos-selecionados';
        
        // Adiciona mensagem inicial
        const semProdutos = document.createElement('li');
        semProdutos.className = 'sem-produtos';
        semProdutos.textContent = 'Nenhum produto selecionado para orçamento.';
        listaProdutos.appendChild(semProdutos);
        
        produtosSelecionadosDiv.appendChild(listaProdutos);
        
        // Adiciona a área de valor total
        const totalDiv = document.createElement('div');
        totalDiv.id = 'total-produtos';
        totalDiv.className = 'total-orcamento';
        totalDiv.innerHTML = '<strong>Valor Total:</strong> <span id="valor-total">R$ 0,00</span>';
        produtosSelecionadosDiv.appendChild(totalDiv);
        
        // Posiciona o elemento no formulário
        this.posicionarElementoNoFormulario(formulario, produtosSelecionadosDiv);
        
        // Configura as funções de suporte
        this.configurarFuncoesDeSuporteOrcamento();
    }
    
    /**
     * Posiciona o elemento no formulário de forma apropriada
     * @param {HTMLElement} formulario - O formulário
     * @param {HTMLElement} elemento - O elemento a ser inserido
     */
    posicionarElementoNoFormulario(formulario, elemento) {
        const campos = formulario.querySelectorAll('.campo-formulario');
        if (campos.length > 0) {
            const ultimoCampo = campos[campos.length - 1];
            
            // Insere após o último campo
            if (ultimoCampo.nextSibling) {
                formulario.insertBefore(elemento, ultimoCampo.nextSibling);
            } else {
                formulario.appendChild(elemento);
            }
        } else {
            // Insere no início do formulário
            formulario.prepend(elemento);
        }
    }
    
    /**
     * Configura as funções de suporte para atualizar o orçamento e o total
     */
    configurarFuncoesDeSuporteOrcamento() {
        // Adiciona função para atualizar o total
        this.criarFuncaoAtualizarTotal();
        
        // Modifica as funções da App se disponível
        this.modificarFuncoesApp();
    }
    
    /**
     * Cria a função para atualizar o total do orçamento
     */
    criarFuncaoAtualizarTotal() {
        window.atualizarTotalOrcamento = function(produtos) {
            const valorTotalElement = document.getElementById('valor-total');
            if (!valorTotalElement) return;
            
            if (!produtos || !Array.isArray(produtos) || produtos.length === 0) {
                valorTotalElement.textContent = 'R$ 0,00';
                return;
            }
            
            // Calcula o total
            const total = produtos.reduce((acc, produto) => {
                return acc + (produto?.preco || 0);
            }, 0);
            
            // Formata e exibe o valor total
            valorTotalElement.textContent = total.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
        };
    }
    
    /**
     * Modifica as funções da App para funcionar com nossa implementação
     */
    modificarFuncoesApp() {
        const appInstance = window.appInstance;
        if (!appInstance) return;
        
        // Substitui a função de atualizar lista
        this.substituirFuncaoAtualizarLista(appInstance);
        
        // Substitui a função de remover produto
        this.substituirFuncaoRemoverProduto(appInstance);
    }
    
    /**
     * Substitui a função de atualizar lista de produtos
     * @param {Object} appInstance - Instância da App
     */
    substituirFuncaoAtualizarLista(appInstance) {
        const originalFunc = appInstance.atualizarListaProdutosSelecionados;
        appInstance.atualizarListaProdutosSelecionados = function() {
            const listaProdutos = document.getElementById('lista-produtos-selecionados');
            if (!listaProdutos) return;
            
            // Limpa a lista atual
            listaProdutos.innerHTML = '';
            
            // Se não houver produtos, exibe mensagem
            if (this.produtosParaOrcamento.length === 0) {
                const semProdutos = document.createElement('li');
                semProdutos.className = 'sem-produtos';
                semProdutos.textContent = 'Nenhum produto selecionado para orçamento.';
                listaProdutos.appendChild(semProdutos);
                window.atualizarTotalOrcamento([]);
                return;
            }
            
            // Adiciona cada produto à lista
            this.produtosParaOrcamento.forEach((produto, index) => {
                const item = this.criarItemProduto(produto, index);
                listaProdutos.appendChild(item);
            });
            
            // Atualiza o valor total
            window.atualizarTotalOrcamento(this.produtosParaOrcamento);
        };
        
        // Adiciona método helper para criar item de produto
        appInstance.criarItemProduto = function(produto, index) {
            const item = document.createElement('li');
            item.className = 'produto-selecionado';
            
            const produtoInfo = document.createElement('div');
            produtoInfo.className = 'produto-info';
            
            const nomeProduto = document.createElement('span');
            nomeProduto.className = 'produto-nome';
            nomeProduto.textContent = produto.nome;
            
            const precoProduto = document.createElement('span');
            precoProduto.className = 'produto-preco';
            precoProduto.textContent = produto.preco.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
            
            produtoInfo.appendChild(nomeProduto);
            produtoInfo.appendChild(precoProduto);
            
            const btnRemover = document.createElement('button');
            btnRemover.type = 'button';
            btnRemover.className = 'btn-remover-produto';
            btnRemover.textContent = 'Remover';
            btnRemover.dataset.index = index;
            btnRemover.setAttribute('aria-label', `Remover produto ${index+1}`);
            
            btnRemover.addEventListener('click', (e) => {
                const indexToRemove = parseInt(e.target.dataset.index);
                this.removerProdutoSelecionado(indexToRemove);
            });
            
            item.appendChild(produtoInfo);
            item.appendChild(btnRemover);
            
            return item;
        };
    }
    
    /**
     * Substitui a função de remover produto
     * @param {Object} appInstance - Instância da App
     */
    substituirFuncaoRemoverProduto(appInstance) {
        const originalRemoverFunc = appInstance.removerProdutoSelecionado;
        appInstance.removerProdutoSelecionado = function(index) {
            originalRemoverFunc.call(this, index);
            window.atualizarTotalOrcamento(this.produtosParaOrcamento);
        };
    }
}

// Inicializa a correção do formulário
new FormularioCorrecao(); 