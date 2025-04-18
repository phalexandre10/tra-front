/**
 * Módulo para validação de formulários do lado do cliente
 * Implementa funções de validação de dados para formulários
 */

/**
 * Classe para validação de formulários
 */
export class Validador {
    /**
     * Verifica se um valor está vazio (string vazia, null, undefined)
     * @param {*} valor - Valor a ser verificado 
     * @returns {boolean} Se o valor está vazio
     */
    static estaVazio(valor) {
        return valor === undefined || valor === null || valor.toString().trim() === '';
    }

    /**
     * Valida se um campo obrigatório foi preenchido
     * @param {string} valor - Valor do campo 
     * @param {string} nomeCampo - Nome do campo para mensagem de erro
     * @returns {Object} Resultado da validação { valido, mensagem }
     */
    static campoObrigatorio(valor, nomeCampo) {
        const valido = !this.estaVazio(valor);
        return {
            valido,
            mensagem: valido ? '' : `O campo ${nomeCampo} é obrigatório.`
        };
    }

    /**
     * Valida se um email está em formato válido
     * @param {string} email - Email a ser validado
     * @returns {Object} Resultado da validação { valido, mensagem }
     */
    static email(email) {
        if (this.estaVazio(email)) {
            return {
                valido: false,
                mensagem: 'O campo email é obrigatório.'
            };
        }

        // Expressão regular para validação básica de email
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const valido = regex.test(email);

        return {
            valido,
            mensagem: valido ? '' : 'Informe um endereço de email válido.'
        };
    }

    /**
     * Valida se um telefone está em formato válido
     * @param {string} telefone - Telefone a ser validado
     * @returns {Object} Resultado da validação { valido, mensagem }
     */
    static telefone(telefone) {
        if (this.estaVazio(telefone)) {
            return { valido: true, mensagem: '' }; // Telefone pode ser opcional
        }

        // Remove caracteres não numéricos
        const numeroLimpo = telefone.replace(/\D/g, '');
        
        // Verifica se tem entre 10 e 11 dígitos (com DDD)
        const valido = numeroLimpo.length >= 10 && numeroLimpo.length <= 11;

        return {
            valido,
            mensagem: valido ? '' : 'Informe um número de telefone válido com DDD.'
        };
    }

    /**
     * Valida o comprimento mínimo de um texto
     * @param {string} texto - Texto a ser validado
     * @param {number} min - Comprimento mínimo
     * @param {string} nomeCampo - Nome do campo para mensagem
     * @returns {Object} Resultado da validação { valido, mensagem }
     */
    static comprimentoMinimo(texto, min, nomeCampo) {
        if (this.estaVazio(texto)) {
            return {
                valido: false,
                mensagem: `O campo ${nomeCampo} é obrigatório.`
            };
        }

        const valido = texto.length >= min;
        return {
            valido,
            mensagem: valido ? '' : `O campo ${nomeCampo} deve ter pelo menos ${min} caracteres.`
        };
    }

    /**
     * Valida o comprimento máximo de um texto
     * @param {string} texto - Texto a ser validado
     * @param {number} max - Comprimento máximo
     * @param {string} nomeCampo - Nome do campo para mensagem
     * @returns {Object} Resultado da validação { valido, mensagem }
     */
    static comprimentoMaximo(texto, max, nomeCampo) {
        if (this.estaVazio(texto)) {
            return { valido: true, mensagem: '' };
        }

        const valido = texto.length <= max;
        return {
            valido,
            mensagem: valido ? '' : `O campo ${nomeCampo} deve ter no máximo ${max} caracteres.`
        };
    }
}

/**
 * Classe para validar formulários completos
 */
export class ValidadorFormulario {
    constructor() {
        this.erros = {};
        this.valido = true;
    }

    /**
     * Adiciona uma validação ao formulário
     * @param {string} campo - Nome do campo
     * @param {Object} resultado - Resultado da validação { valido, mensagem }
     * @returns {ValidadorFormulario} Instância atual para encadeamento
     */
    adicionarValidacao(campo, resultado) {
        if (!resultado.valido) {
            this.erros[campo] = resultado.mensagem;
            this.valido = false;
        }
        return this;
    }

    /**
     * Retorna todos os erros encontrados
     * @returns {Object} Objeto com erros por campo
     */
    obterErros() {
        return this.erros;
    }

    /**
     * Verifica se o formulário é válido
     * @returns {boolean} Se o formulário é válido
     */
    eValido() {
        return this.valido;
    }

    /**
     * Obtém o primeiro erro encontrado
     * @returns {string} Mensagem do primeiro erro
     */
    obterPrimeiroErro() {
        const campos = Object.keys(this.erros);
        return campos.length > 0 ? this.erros[campos[0]] : '';
    }

    /**
     * Exibe erros de validação no formulário
     * @param {string} formId - ID do formulário
     * @param {boolean} exibirAlerta - Se deve exibir alerta com primeiro erro
     */
    exibirErros(formId, exibirAlerta = true) {
        const form = document.getElementById(formId);
        if (!form) return;

        // Limpa mensagens de erro anteriores
        const mensagensAnteriores = form.querySelectorAll('.erro-validacao');
        mensagensAnteriores.forEach(elemento => elemento.remove());

        // Reseta classes de erro nos campos
        form.querySelectorAll('.campo-com-erro').forEach(campo => {
            campo.classList.remove('campo-com-erro');
        });

        // Se não há erros, retorna
        if (this.valido) return;

        // Processa cada erro
        Object.keys(this.erros).forEach(campo => {
            const elemento = form.querySelector(`[name="${campo}"]`);
            if (!elemento) return;

            // Adiciona classe de erro ao campo
            elemento.classList.add('campo-com-erro');

            // Cria o elemento de mensagem de erro
            const mensagemErro = document.createElement('div');
            mensagemErro.className = 'erro-validacao';
            mensagemErro.textContent = this.erros[campo];
            
            // Adiciona a mensagem após o campo
            elemento.parentNode.insertBefore(mensagemErro, elemento.nextSibling);
        });

        // Exibe alerta com primeiro erro, se solicitado
        if (exibirAlerta && Object.keys(this.erros).length > 0) {
            alert(this.obterPrimeiroErro());
        }
    }
}

/**
 * Classe responsável pela validação de formulários
 * @class ValidacaoHelper
 */
export class ValidacaoHelper {
    /**
     * Cria uma instância do ValidacaoHelper
     * @constructor
     */
    constructor() {
        this.camposObrigatorios = ['nome', 'email', 'categoria'];
        this.padroes = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            telefone: /^\(\d{2}\)\s\d{4,5}-\d{4}$/
        };
    }

    /**
     * Valida um formulário de orçamento
     * @param {HTMLFormElement} formulario - Formulário a ser validado
     * @returns {ValidadorFormulario} Validador com resultado
     */
    static validarFormularioOrcamento(formulario) {
        const validador = new ValidadorFormulario();
        
        // Obtém os valores dos campos
        const nome = formulario.nome.value;
        const email = formulario.email.value;
        const telefone = formulario.telefone.value;
        const categoria = formulario.categoria.value;
        
        // Executa as validações
        validador
            .adicionarValidacao('nome', Validador.comprimentoMinimo(nome, 3, 'Nome Completo'))
            .adicionarValidacao('email', Validador.email(email))
            .adicionarValidacao('telefone', Validador.telefone(telefone))
            .adicionarValidacao('categoria', Validador.campoObrigatorio(categoria, 'Categoria de EPI'));
        
        return validador;
    }

    /**
     * Valida todos os campos de um formulário
     * @param {HTMLFormElement} formulario - O formulário a ser validado
     * @returns {boolean} Verdadeiro se todos os campos são válidos
     */
    validarFormulario(formulario) {
        let valido = true;
        this.limparErros(formulario);

        // Validar campos obrigatórios
        this.camposObrigatorios.forEach(campo => {
            const elemento = formulario.querySelector(`#${campo}`);
            if (elemento && !this.validarCampoObrigatorio(elemento)) {
                this.mostrarErro(elemento, 'Este campo é obrigatório.');
                valido = false;
            }
        });

        // Validar email
        const campoEmail = formulario.querySelector('#email');
        if (campoEmail && campoEmail.value && !this.validarEmail(campoEmail.value)) {
            this.mostrarErro(campoEmail, 'Por favor, insira um email válido.');
            valido = false;
        }

        // Validar telefone (se preenchido)
        const campoTelefone = formulario.querySelector('#telefone');
        if (campoTelefone && campoTelefone.value && !this.validarTelefone(campoTelefone.value)) {
            this.mostrarErro(campoTelefone, 'Por favor, insira um telefone no formato (XX) XXXXX-XXXX.');
            valido = false;
        }

        return valido;
    }

    /**
     * Valida se um campo obrigatório está preenchido
     * @param {HTMLElement} campo - O campo a ser validado
     * @returns {boolean} Verdadeiro se o campo está preenchido
     */
    validarCampoObrigatorio(campo) {
        return campo.value.trim() !== '';
    }

    /**
     * Valida um endereço de email
     * @param {string} email - O email a ser validado
     * @returns {boolean} Verdadeiro se o email é válido
     */
    validarEmail(email) {
        return this.padroes.email.test(email);
    }

    /**
     * Valida um número de telefone
     * @param {string} telefone - O telefone a ser validado
     * @returns {boolean} Verdadeiro se o telefone é válido
     */
    validarTelefone(telefone) {
        // Se estiver vazio, é considerado válido (não é obrigatório)
        if (!telefone) return true;
        return this.padroes.telefone.test(telefone);
    }

    /**
     * Mostra uma mensagem de erro para um campo
     * @param {HTMLElement} campo - O campo com erro
     * @param {string} mensagem - A mensagem de erro
     */
    mostrarErro(campo, mensagem) {
        const elementoPai = campo.parentElement;
        const mensagemErro = document.createElement('div');
        mensagemErro.className = 'mensagem-erro';
        mensagemErro.innerText = mensagem;
        elementoPai.appendChild(mensagemErro);
        campo.classList.add('campo-invalido');
    }

    /**
     * Limpa todas as mensagens de erro de um formulário
     * @param {HTMLFormElement} formulario - O formulário a ser limpo
     */
    limparErros(formulario) {
        const mensagensErro = formulario.querySelectorAll('.mensagem-erro');
        const camposInvalidos = formulario.querySelectorAll('.campo-invalido');
        
        mensagensErro.forEach(mensagem => mensagem.remove());
        camposInvalidos.forEach(campo => campo.classList.remove('campo-invalido'));
    }

    /**
     * Formata um telefone conforme ele é digitado
     * @param {HTMLInputElement} input - O campo de input do telefone
     */
    formatarTelefoneAoDigitar(input) {
        input.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/\D/g, '');
            
            if (valor.length > 0) {
                // Adiciona o DDD entre parênteses
                valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
                
                // Adiciona o hífen
                if (valor.length > 10) {
                    valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
                } else {
                    valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
                }
            }
            
            e.target.value = valor;
        });
    }

    /**
     * Configura a formatação automática de telefone para um campo
     * @param {string} seletorCampo - O seletor do campo de telefone
     */
    configurarFormatacaoTelefone(seletorCampo) {
        const campoTelefone = document.querySelector(seletorCampo);
        if (campoTelefone) {
            this.formatarTelefoneAoDigitar(campoTelefone);
        }
    }

    /**
     * Adiciona máscaras de formatação aos campos do formulário
     * @param {string} formId - ID do formulário 
     */
    static aplicarMascarasCampos(formId) {
        const form = document.getElementById(formId);
        if (!form) return;
        
        const campoTelefone = form.querySelector('[name="telefone"]');
        if (campoTelefone) {
            const helper = new ValidacaoHelper();
            helper.formatarTelefoneAoDigitar(campoTelefone);
        }
    }
} 