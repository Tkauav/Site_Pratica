// Script para gerenciar erros de email inline (sem popups)
// Inclua este script em suas páginas de cadastro

(function() {
    'use strict';
    
    // Funções para gerenciar mensagem de erro de email
    function showEmailError(inputElement, message) {
        console.log('Mostrando erro de email:', message);
        
        // Remove mensagem anterior se existir
        hideEmailError(inputElement);
        
        // Cria a mensagem de erro
        const errorDiv = document.createElement('div');
        errorDiv.className = 'email-error-message show';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        
        // Adiciona estilos inline para garantir que apareça
        errorDiv.style.display = 'block';
        errorDiv.style.color = '#f44336';
        errorDiv.style.fontSize = '14px';
        errorDiv.style.marginTop = '8px';
        errorDiv.style.padding = '8px 12px';
        errorDiv.style.background = 'rgba(244, 67, 54, 0.1)';
        errorDiv.style.border = '1px solid rgba(244, 67, 54, 0.3)';
        errorDiv.style.borderRadius = '6px';
        errorDiv.style.width = '100%';
        errorDiv.style.boxSizing = 'border-box';
        errorDiv.style.animation = 'slideDown 0.3s ease-out';
        
        // Insere após o input
        if (inputElement.nextSibling) {
            inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
        } else {
            inputElement.parentNode.appendChild(errorDiv);
        }
        
        console.log('Mensagem de erro adicionada:', errorDiv);
    }
    
    function hideEmailError(inputElement) {
        const existingError = inputElement.parentNode.querySelector('.email-error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    // Função para verificar se email já está cadastrado
    function verificarEmailCadastrado(email) {
        // Lista de emails já cadastrados (simulação)
        const emailsCadastrados = [
            'victorpamene@gmail.com',
            'teste@email.com',
            'usuario@exemplo.com',
            'admin@pratica.com'
        ];
        
        return emailsCadastrados.includes(email.toLowerCase());
    }

    // Função para substituir popups de erro por mensagens inline
    function substituirPopupsPorMensagensInline() {
        // Intercepta alert() para erros de email
        const originalAlert = window.alert;
        window.alert = function(message) {
            if (message && message.toLowerCase().includes('email') && 
                (message.toLowerCase().includes('cadastrado') || message.toLowerCase().includes('já existe'))) {
                
                // Encontra o input de email na página
                const emailInput = document.querySelector('input[type="email"]');
                if (emailInput) {
                    showEmailError(emailInput, 'Este email já está cadastrado. Tente fazer login ou use um email diferente.');
                    return;
                }
            }
            
            // Para outros tipos de alert, usa o alert original
            originalAlert.call(window, message);
        };
    }

    // Função para configurar verificação em tempo real
    function configurarVerificacaoTempoReal() {
        const emailInputs = document.querySelectorAll('input[type="email"]');
        
        emailInputs.forEach(input => {
            input.addEventListener('blur', function() {
                const email = this.value.trim();
                if (email && verificarEmailCadastrado(email)) {
                    showEmailError(this, 'Este email já está cadastrado. Tente fazer login ou use um email diferente.');
                } else {
                    hideEmailError(this);
                }
            });
            
            input.addEventListener('input', function() {
                // Remove erro quando usuário começa a digitar
                hideEmailError(this);
            });
        });
    }

    // Função para interceptar envio de formulário
    function configurarInterceptacaoFormulario() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const emailInput = form.querySelector('input[type="email"]');
                if (emailInput) {
                    const email = emailInput.value.trim();
                    
                    if (email && verificarEmailCadastrado(email)) {
                        e.preventDefault();
                        showEmailError(emailInput, 'Este email já está cadastrado. Tente fazer login ou use um email diferente.');
                        return false;
                    }
                }
            });
        });
    }

    // Inicializar quando o DOM estiver pronto
    function init() {
        substituirPopupsPorMensagensInline();
        configurarVerificacaoTempoReal();
        configurarInterceptacaoFormulario();
    }

    // Executar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expor funções globalmente
    window.showEmailError = showEmailError;
    window.hideEmailError = hideEmailError;
    window.verificarEmailCadastrado = verificarEmailCadastrado;

})();

