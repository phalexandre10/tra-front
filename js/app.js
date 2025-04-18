/**
 * Arquivo principal da aplicação
 * Implementa a classe App que gerencia toda a funcionalidade principal
 */

// Importação dos módulos
import apiService from './api.js';
import { ProdutoFactory } from './models.js';
import { DOMManager, EventosManager } from './dom.js';
import { ValidacaoHelper } from './validacao.js';

/**
 * Classe principal da aplicação
 * Responsável por gerenciar produtos, orçamentos e interações com a interface
 */
class App {
    /**
     * Inicializa a aplicação com valores padrão
     */
    constructor() {
        // Inicializa propriedades da aplicação
        this.produtos = [];
        this.produtosParaOrcamento = [];
        this.categoriaAtual = 'todos';
        
        // Conecta a função de adicionar ao orçamento com o DOMManager
        DOMManager.adicionarAoOrcamento = this.adicionarAoOrcamento.bind(this);
    }

    /**
     * Inicializa a aplicação assincronamente
     * @returns {Promise<void>}
     */
    async inicializar() {
        // Garantir que o DOM esteja completamente carregado
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }
        
        // Inicializa componentes da aplicação
        this.inicializarEventos();
        await this.carregarProdutos();
        ValidacaoHelper.aplicarMascarasCampos('form-orcamento');
        
        // Define o botão "Todos" como ativo por padrão
        const botaoTodos = document.querySelector('.filtro-categoria[data-categoria="todos"]');
        if (botaoTodos) {
            botaoTodos.classList.add('ativo');
        }
        
        // Aguarda um momento para garantir que o formulário esteja pronto
        setTimeout(() => this.criarAreaProdutosSelecionados(), 500);
    }
    
    /**
     * Cria a área para exibir produtos selecionados no formulário
     */
    criarAreaProdutosSelecionados() {
        const formulario = document.getElementById('form-orcamento');
        if (!formulario) return;
        
        // Verifica se a área já existe para evitar duplicação
        if (document.getElementById('produtos-selecionados')) {
            this.atualizarListaProdutosSelecionados();
            return;
        }
        
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
        produtosSelecionadosDiv.appendChild(listaProdutos);
        
        // Adiciona a área de valor total
        const totalDiv = document.createElement('div');
        totalDiv.id = 'total-produtos';
        totalDiv.className = 'total-orcamento';
        totalDiv.innerHTML = '<strong>Valor Total:</strong> <span id="valor-total">R$ 0,00</span>';
        produtosSelecionadosDiv.appendChild(totalDiv);
        
        // Determina onde inserir no formulário
        this.inserirElementoNoFormulario(formulario, produtosSelecionadosDiv);
        
        // Exibe mensagem quando não há produtos
        this.atualizarListaProdutosSelecionados();
    }
    
    /**
     * Insere um elemento no formulário de forma apropriada
     * @param {HTMLElement} formulario - O formulário onde inserir
     * @param {HTMLElement} elemento - O elemento a ser inserido
     */
    inserirElementoNoFormulario(formulario, elemento) {
        const botaoEnviar = formulario.querySelector('button[type="submit"]');
        
        if (botaoEnviar) {
            // Abordagem mais segura: inserir antes do último elemento div
            const ultimoCampoFormulario = [...formulario.querySelectorAll('.campo-formulario')].pop();
            
            if (ultimoCampoFormulario) {
                formulario.insertBefore(elemento, ultimoCampoFormulario.nextSibling);
            } else {
                formulario.insertBefore(elemento, botaoEnviar);
            }
        } else {
            formulario.appendChild(elemento);
        }
    }

    /**
     * Atualiza a lista de produtos selecionados no formulário
     */
    atualizarListaProdutosSelecionados() {
        const listaProdutos = document.getElementById('lista-produtos-selecionados');
        if (!listaProdutos) return;
        
        // Limpa a lista atual
        listaProdutos.innerHTML = '';
        
        // Se não houver produtos, exibe mensagem
        if (this.produtosParaOrcamento.length === 0) {
            this.exibirMensagemSemProdutos(listaProdutos);
            return;
        }
        
        // Adiciona cada produto à lista
        this.produtosParaOrcamento.forEach((produto, index) => {
            this.adicionarItemProduto(listaProdutos, produto, index);
        });
        
        // Atualiza o valor total
        this.atualizarValorTotal();
    }
    
    /**
     * Exibe uma mensagem quando não há produtos selecionados
     * @param {HTMLElement} listaProdutos - Elemento da lista de produtos
     */
    exibirMensagemSemProdutos(listaProdutos) {
        const semProdutos = document.createElement('li');
        semProdutos.className = 'sem-produtos';
        semProdutos.textContent = 'Nenhum produto selecionado para orçamento.';
        listaProdutos.appendChild(semProdutos);
        
        // Atualiza o valor total para zero
        this.atualizarValorTotal();
    }
    
    /**
     * Adiciona um item de produto à lista
     * @param {HTMLElement} listaProdutos - Elemento da lista de produtos
     * @param {Object} produto - Objeto do produto a ser adicionado
     * @param {number} index - Índice do produto na lista
     */
    adicionarItemProduto(listaProdutos, produto, index) {
        const item = document.createElement('li');
        item.className = 'produto-selecionado';
        
        // Cria o contêiner de informações do produto
        const produtoInfo = this.criarElementoInfoProduto(produto);
        
        // Cria o botão de remover
        const btnRemover = this.criarBotaoRemover(index);
        
        // Monta o item e adiciona à lista
        item.appendChild(produtoInfo);
        item.appendChild(btnRemover);
        listaProdutos.appendChild(item);
    }
    
    /**
     * Cria o elemento de informações do produto
     * @param {Object} produto - Objeto do produto
     * @returns {HTMLElement} Elemento de informações do produto
     */
    criarElementoInfoProduto(produto) {
        const produtoInfo = document.createElement('div');
        produtoInfo.className = 'produto-info';
        
        // Nome do produto
        const nomeProduto = document.createElement('span');
        nomeProduto.className = 'produto-nome';
        nomeProduto.textContent = produto.nome;
        
        // Preço do produto
        const precoProduto = document.createElement('span');
        precoProduto.className = 'produto-preco';
        precoProduto.textContent = this.formatarPreco(produto);
        
        produtoInfo.appendChild(nomeProduto);
        produtoInfo.appendChild(precoProduto);
        
        return produtoInfo;
    }
    
    /**
     * Formata o preço do produto
     * @param {Object} produto - Objeto do produto
     * @returns {string} Preço formatado
     */
    formatarPreco(produto) {
        return produto.formatarPreco ? 
            produto.formatarPreco() : 
            produto.preco.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
    }
    
    /**
     * Cria o botão de remover produto
     * @param {number} index - Índice do produto
     * @returns {HTMLElement} Botão de remover
     */
    criarBotaoRemover(index) {
        const btnRemover = document.createElement('button');
        btnRemover.type = 'button';
        btnRemover.className = 'btn-remover-produto';
        btnRemover.textContent = 'Remover';
        btnRemover.dataset.index = index;
        btnRemover.setAttribute('aria-label', `Remover produto ${index+1}`);
        
        // Adiciona o evento de clique
        btnRemover.addEventListener('click', (e) => {
            const indexToRemove = parseInt(e.target.dataset.index);
            this.removerProdutoSelecionado(indexToRemove);
        });
        
        return btnRemover;
    }
    
    /**
     * Atualiza o valor total dos produtos selecionados
     */
    atualizarValorTotal() {
        const valorTotalElement = document.getElementById('valor-total');
        if (!valorTotalElement) return;
        
        // Se não houver produtos, mostra zero
        if (this.produtosParaOrcamento.length === 0) {
            valorTotalElement.textContent = 'R$ 0,00';
            return;
        }
        
        // Calcula o total
        const total = this.produtosParaOrcamento.reduce((acc, produto) => {
            return acc + (produto?.preco || 0);
        }, 0);
        
        // Formata e exibe o valor total
        valorTotalElement.textContent = total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }
    
    /**
     * Remove um produto da lista de produtos selecionados
     * @param {number} index - Índice do produto a ser removido
     */
    removerProdutoSelecionado(index) {
        if (index >= 0 && index < this.produtosParaOrcamento.length) {
            const produtoRemovido = this.produtosParaOrcamento[index];
            
            // Remove o produto da lista
            this.produtosParaOrcamento.splice(index, 1);
            
            // Atualiza a lista de produtos selecionados
            this.atualizarListaProdutosSelecionados();
            
            // Exibe mensagem de confirmação
            DOMManager.exibirModal('Produto Removido', `"${produtoRemovido.nome}" foi removido do seu orçamento.`, 'info');
        }
    }

    /**
     * Inicializa eventos da aplicação
     */
    inicializarEventos() {
        // Inicializa eventos dos filtros de categoria
        EventosManager.inicializarFiltrosCategorias(this.filtrarProdutos.bind(this));
        
        // Inicializa evento de envio do formulário
        EventosManager.inicializarFormularioOrcamento(this.enviarFormularioOrcamento.bind(this));
        
        // Inicializa rolagem suave
        EventosManager.inicializarRolagemSuave();
        
        // Adiciona listener para o evento customizado "tentarNovamente"
        document.addEventListener('tentarNovamente', async (e) => {
            const { containerId } = e.detail;
            if (containerId === 'lista-produtos') {
                await this.carregarProdutos();
            }
        });
    }

    /**
     * Carrega produtos da API
     * @returns {Promise<void>}
     */
    async carregarProdutos() {
        try {
            // Exibe mensagem de carregamento
            DOMManager.exibirCarregamento('lista-produtos', 'Carregando produtos...');
            
            // Obtém produtos da API
            const dadosProdutos = await apiService.getProdutos();
            
            // Converte dados para instâncias de classes de produto
            this.produtos = dadosProdutos.map(p => ProdutoFactory.criarProduto(p));
            
            // Se tiver uma categoria filtrada, aplica o filtro
            if (this.categoriaAtual !== 'todos') {
                this.filtrarProdutos(this.categoriaAtual);
            } else {
                // Exibe todos os produtos
                DOMManager.exibirProdutos(this.produtos);
            }
        } catch (erro) {
            DOMManager.exibirErro('lista-produtos', 'Não foi possível carregar os produtos. Tente novamente mais tarde.');
        }
    }

    /**
     * Filtra produtos por categoria
     * @param {string} categoria - Categoria selecionada
     * @returns {Promise<void>}
     */
    async filtrarProdutos(categoria) {
        try {
            this.categoriaAtual = categoria;
            DOMManager.aplicarFiltroCategoria(categoria);
            
            // Exibe mensagem de carregamento
            DOMManager.exibirCarregamento('lista-produtos', 'Filtrando produtos...');
            
            let produtosFiltrados;
            
            if (categoria === 'todos') {
                // Se for "todos", usa os produtos já carregados ou carrega novamente
                if (this.produtos.length === 0) {
                    const dadosProdutos = await apiService.getProdutos();
                    this.produtos = dadosProdutos.map(p => ProdutoFactory.criarProduto(p));
                }
                produtosFiltrados = this.produtos;
            } else {
                // Busca produtos filtrados por categoria na API
                const dadosProdutos = await apiService.getProdutosPorCategoria(categoria);
                produtosFiltrados = dadosProdutos.map(p => ProdutoFactory.criarProduto(p));
            }
            
            // Exibe os produtos filtrados
            DOMManager.exibirProdutos(produtosFiltrados);
        } catch (erro) {
            DOMManager.exibirErro('lista-produtos', 'Não foi possível filtrar os produtos. Tente novamente mais tarde.');
        }
    }

    /**
     * Adiciona produto ao orçamento
     * @param {number} produtoId - ID do produto
     */
    adicionarAoOrcamento(produtoId) {
        // Busca o produto pelo ID
        const produto = this.produtos.find(p => p.id === produtoId);
        
        if (!produto) {
            DOMManager.exibirModal('Erro', 'Produto não encontrado.', 'erro');
            return;
        }
        
        // Verifica se o produto está disponível
        if (!produto.estaDisponivel()) {
            DOMManager.exibirModal('Produto Indisponível', 'Este produto está temporariamente indisponível para orçamento.', 'alerta');
            return;
        }
        
        // Verifica se o produto já está na lista
        const produtoExistente = this.produtosParaOrcamento.find(p => p.id === produto.id);
        if (produtoExistente) {
            DOMManager.exibirModal('Produto Já Adicionado', `"${produto.nome}" já está no seu orçamento.`, 'info');
            return;
        }
        
        // Adiciona à lista de produtos para orçamento
        this.produtosParaOrcamento.push(produto);
        
        // Garante que a área de produtos selecionados esteja criada e atualizada
        if (!document.getElementById('produtos-selecionados')) {
            this.criarAreaProdutosSelecionados();
        } else {
            this.atualizarListaProdutosSelecionados();
        }
        
        // Adiciona informações ao formulário de orçamento
        this.preencherFormularioComProduto(produto);
        
        // Exibe mensagem de confirmação com preço
        const precoFormatado = this.formatarPreco(produto);
        DOMManager.exibirModal(
            'Produto Adicionado', 
            `"${produto.nome}" (${precoFormatado}) adicionado ao seu orçamento. Complete o formulário para solicitar.`, 
            'sucesso'
        );
    }

    /**
     * Preenche o formulário com informações do produto
     * @param {Object} produto - Produto selecionado
     */
    preencherFormularioComProduto(produto) {
        const formulario = document.getElementById('form-orcamento');
        if (!formulario) return;
        
        // Tenta selecionar a categoria do produto no select
        this.selecionarCategoriaCorrespondente(formulario, produto);
        
        // Rolagem suave até o formulário
        const formularioSection = document.getElementById('formulario');
        if (formularioSection) {
            formularioSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    /**
     * Seleciona a categoria correspondente no formulário
     * @param {HTMLElement} formulario - Elemento do formulário
     * @param {Object} produto - Produto selecionado
     */
    selecionarCategoriaCorrespondente(formulario, produto) {
        const categoriaSelect = formulario.querySelector('#categoria');
        if (!categoriaSelect) return;
        
        // Tenta encontrar uma opção que corresponda à categoria do produto
        const opcoes = Array.from(categoriaSelect.options);
        const opcaoCorrespondente = opcoes.find(opcao => 
            produto.categoria.toLowerCase().includes(opcao.text.toLowerCase()) ||
            opcao.text.toLowerCase().includes(produto.categoria.toLowerCase())
        );
        
        if (opcaoCorrespondente) {
            categoriaSelect.value = opcaoCorrespondente.value;
        }
    }

    /**
     * Processa o envio do formulário de orçamento
     * @param {HTMLFormElement} formulario - Elemento do formulário
     * @returns {Promise<void>}
     */
    async enviarFormularioOrcamento(formulario) {
        // Verifica se há produtos selecionados
        if (this.produtosParaOrcamento.length === 0) {
            DOMManager.exibirModal('Atenção', 'Por favor, selecione pelo menos um produto para solicitar o orçamento.', 'alerta');
            return;
        }
        
        // Valida o formulário
        const validador = ValidacaoHelper.validarFormularioOrcamento(formulario);
        
        // Se formulário não for válido, exibe erros
        if (!validador.eValido()) {
            validador.exibirErros('form-orcamento');
            return;
        }
        
        try {
            // Prepara dados do formulário
            const dadosFormulario = this.prepararDadosFormulario(formulario);
            
            // Exibe estado de carregamento no botão
            const botaoEnviar = formulario.querySelector('button[type="submit"]');
            const textoOriginal = botaoEnviar.textContent;
            botaoEnviar.textContent = 'Enviando...';
            botaoEnviar.disabled = true;
            
            // Envia dados para a API
            const resposta = await apiService.enviarOrcamento(dadosFormulario);
            
            // Restaura botão
            botaoEnviar.textContent = textoOriginal;
            botaoEnviar.disabled = false;
            
            if (resposta.sucesso) {
                this.processarRespostaOrcamentoSucesso(formulario, resposta);
            } else {
                throw new Error('Erro ao processar solicitação');
            }
        } catch (erro) {
            DOMManager.exibirModal(
                'Erro ao Enviar', 
                'Não foi possível enviar sua solicitação. Por favor, tente novamente mais tarde.', 
                'erro'
            );
        }
    }
    
    /**
     * Prepara os dados do formulário para envio
     * @param {HTMLFormElement} formulario - Elemento do formulário
     * @returns {Object} Dados formatados do formulário
     */
    prepararDadosFormulario(formulario) {
        return {
            nome: formulario.nome.value,
            email: formulario.email.value,
            telefone: formulario.telefone.value,
            categoria: formulario.categoria.value,
            produtos: this.produtosParaOrcamento.map(produto => ({
                id: produto.id,
                nome: produto.nome,
                quantidade: 1
            }))
        };
    }
    
    /**
     * Processa a resposta de sucesso do orçamento
     * @param {HTMLFormElement} formulario - Elemento do formulário
     * @param {Object} resposta - Resposta da API
     */
    processarRespostaOrcamentoSucesso(formulario, resposta) {
        // Exibe mensagem de sucesso
        DOMManager.exibirModal(
            'Solicitação Enviada', 
            `Sua solicitação de orçamento foi enviada com sucesso!<br>
            Protocolo: <strong>${resposta.protocolo}</strong><br>
            Entraremos em contato em até ${resposta.previsao}.`,
            'sucesso'
        );
        
        // Limpa o formulário e a lista de produtos
        formulario.reset();
        this.produtosParaOrcamento = [];
        this.atualizarListaProdutosSelecionados();
    }
}

// Cria e inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', async () => {
    const app = new App();
    // Expõe a instância globalmente para permitir acesso pelo fix-form.js
    window.app = app;
    await app.inicializar();
}); 