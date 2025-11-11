// Script para remover popups de erro e substituir por mensagens inline
// Adicione este script no final da sua página de cadastro

(function() {
    'use strict';
    
    console.log('Script de remoção de popups carregado');
    
    // Função para criar mensagem de erro inline
    function criarMensagemErro(inputElement, mensagem) {
        // Remove mensagem anterior se existir
        const erroAnterior = inputElement.parentNode.querySelector('.email-error-message');
        if (erroAnterior) {
            erroAnterior.remove();
        }
        
        // Cria nova mensagem de erro
        const errorDiv = document.createElement('div');
        errorDiv.className = 'email-error-message show';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${mensagem}`;
        
        // Estilos inline para garantir visibilidade
        errorDiv.style.cssText = `
            display: block !important;
            color: #f44336;
            font-size: 14px;
            margin-top: 8px;
            padding: 8px 12px;
            background: rgba(244, 67, 54, 0.1);
            border: 1px solid rgba(244, 67, 54, 0.3);
            border-radius: 6px;
            width: 100%;
            box-sizing: border-box;
            animation: slideDown 0.3s ease-out;
        `;
        
        // Insere após o input
        inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
        
        return errorDiv;
    }
    
    // Função para remover mensagem de erro
    function removerMensagemErro(inputElement) {
        const erro = inputElement.parentNode.querySelector('.email-error-message');
        if (erro) {
            erro.remove();
        }
    }
    
    // Interceptar alert() para erros de email
    const alertOriginal = window.alert;
    window.alert = function(mensagem) {
        console.log('Alert interceptado:', mensagem);
        
        // Verifica se é erro de email já cadastrado
        if (mensagem && 
            (mensagem.toLowerCase().includes('email') || mensagem.toLowerCase().includes('já cadastrado') || 
             mensagem.toLowerCase().includes('já existe') || mensagem.toLowerCase().includes('cadastrado'))) {
            
            // Procura input de email na página
            const emailInput = document.querySelector('input[type="email"]');
            if (emailInput) {
                console.log('Mostrando erro inline para email');
                criarMensagemErro(emailInput, 'Este email já está cadastrado. Tente fazer login ou use um email diferente.');
                return; // Não mostra o alert
            }
        }
        
        // Para outros tipos de alert, mostra normalmente
        alertOriginal.call(window, mensagem);
    };
    
    // Interceptar confirm() para erros de email
    const confirmOriginal = window.confirm;
    window.confirm = function(mensagem) {
        console.log('Confirm interceptado:', mensagem);
        
        // Verifica se é erro de email já cadastrado
        if (mensagem && 
            (mensagem.toLowerCase().includes('email') || mensagem.toLowerCase().includes('já cadastrado') || 
             mensagem.toLowerCase().includes('já existe') || mensagem.toLowerCase().includes('cadastrado'))) {
            
            // Procura input de email na página
            const emailInput = document.querySelector('input[type="email"]');
            if (emailInput) {
                console.log('Mostrando erro inline para email (confirm)');
                criarMensagemErro(emailInput, 'Este email já está cadastrado. Tente fazer login ou use um email diferente.');
                return false; // Retorna false para o confirm
            }
        }
        
        // Para outros tipos de confirm, executa normalmente
        return confirmOriginal.call(window, mensagem);
    };
    
    // Interceptar qualquer função que possa mostrar popups de erro
    function interceptarFuncoesErro() {
        // Lista de emails já cadastrados (simulação)
        const emailsCadastrados = [
            'victorpamene@gmail.com',
            'teste@email.com',
            'usuario@exemplo.com',
            'admin@pratica.com'
        ];
        
        // Função para verificar se email já está cadastrado
        function verificarEmailCadastrado(email) {
            return emailsCadastrados.includes(email.toLowerCase());
        }
        
        // Interceptar envio de formulários
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const emailInput = form.querySelector('input[type="email"]');
                if (emailInput) {
                    const email = emailInput.value.trim();
                    
                    if (email && verificarEmailCadastrado(email)) {
                        e.preventDefault();
                        criarMensagemErro(emailInput, 'Este email já está cadastrado. Tente fazer login ou use um email diferente.');
                        return false;
                    }
                }
            });
        });
        
        // Verificação em tempo real quando usuário sai do campo email
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('blur', function() {
                const email = this.value.trim();
                if (email && verificarEmailCadastrado(email)) {
                    criarMensagemErro(this, 'Este email já está cadastrado. Tente fazer login ou use um email diferente.');
                } else {
                    removerMensagemErro(this);
                }
            });
            
            // Remove erro quando usuário começa a digitar
            input.addEventListener('input', function() {
                removerMensagemErro(this);
            });
        });
    }
    
    // Executar quando DOM estiver pronto
    function init() {
        console.log('Inicializando interceptação de popups');
        interceptarFuncoesErro();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Expor funções globalmente
    window.criarMensagemErro = criarMensagemErro;
    window.removerMensagemErro = removerMensagemErro;
    
    console.log('Script de remoção de popups configurado com sucesso');
    
})();

