// Script corrigido para mostrar erro de email na área marcada de vermelho
(function() {
    'use strict';
    
    console.log('Script de erro de email carregado');
    
    // Lista de emails já cadastrados
    const emailsCadastrados = [
        'victorpamene@outlook.com',
        'victorpamene@gmail.com',
        'teste@email.com',
        'usuario@exemplo.com',
        'admin@pratica.com'
    ];
    
    // Função para mostrar erro de email
    function mostrarErroEmail(inputElement, mensagem) {
        console.log('Mostrando erro para:', inputElement, mensagem);
        
        // Remove erro anterior se existir
        removerErroEmail(inputElement);
        
        // Cria a mensagem de erro
        const errorDiv = document.createElement('div');
        errorDiv.className = 'email-error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${mensagem}`;
        
        // Estilos inline para garantir que apareça
        errorDiv.style.cssText = `
            display: block !important;
            color: #f44336 !important;
            font-size: 14px !important;
            margin-top: 8px !important;
            padding: 8px 12px !important;
            background: rgba(244, 67, 54, 0.1) !important;
            border: 1px solid rgba(244, 67, 54, 0.3) !important;
            border-radius: 6px !important;
            width: 100% !important;
            box-sizing: border-box !important;
            animation: slideDown 0.3s ease-out !important;
            position: relative !important;
            z-index: 10 !important;
        `;
        
        // Adiciona a classe show
        errorDiv.classList.add('show');
        
        // Insere após o input
        if (inputElement.nextSibling) {
            inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
        } else {
            inputElement.parentNode.appendChild(errorDiv);
        }
        
        console.log('Erro adicionado:', errorDiv);
        return errorDiv;
    }
    
    // Função para remover erro de email
    function removerErroEmail(inputElement) {
        const existingError = inputElement.parentNode.querySelector('.email-error-message');
        if (existingError) {
            existingError.remove();
            console.log('Erro removido');
        }
    }
    
    // Função para verificar se email está cadastrado
    function verificarEmailCadastrado(email) {
        return emailsCadastrados.includes(email.toLowerCase());
    }
    
    // Função para configurar verificação em tempo real
    function configurarVerificacaoTempoReal() {
        const emailInputs = document.querySelectorAll('input[type="email"]');
        console.log('Encontrados', emailInputs.length, 'inputs de email');
        
        emailInputs.forEach((input, index) => {
            console.log(`Configurando input ${index + 1}:`, input);
            
            // Verificação quando usuário sai do campo
            input.addEventListener('blur', function() {
                const email = this.value.trim();
                console.log('Email verificado:', email);
                
                if (email && verificarEmailCadastrado(email)) {
                    mostrarErroEmail(this, 'Este email já está cadastrado. Tente fazer login ou use um email diferente.');
                } else {
                    removerErroEmail(this);
                }
            });
            
            // Remove erro quando usuário digita
            input.addEventListener('input', function() {
                removerErroEmail(this);
            });
            
            // Verificação imediata se já tem valor
            if (input.value.trim()) {
                const email = input.value.trim();
                if (verificarEmailCadastrado(email)) {
                    setTimeout(() => {
                        mostrarErroEmail(input, 'Este email já está cadastrado. Tente fazer login ou use um email diferente.');
                    }, 100);
                }
            }
        });
    }
    
    // Interceptar alert() para erros de email
    const alertOriginal = window.alert;
    window.alert = function(mensagem) {
        console.log('Alert interceptado:', mensagem);
        
        if (mensagem && 
            (mensagem.toLowerCase().includes('email') || 
             mensagem.toLowerCase().includes('cadastrado') || 
             mensagem.toLowerCase().includes('já existe'))) {
            
            const emailInput = document.querySelector('input[type="email"]');
            if (emailInput) {
                mostrarErroEmail(emailInput, 'Este email já está cadastrado. Tente fazer login ou use um email diferente.');
                return; // Não mostra o alert
            }
        }
        
        // Para outros tipos de alert, mostra normalmente
        alertOriginal.call(window, mensagem);
    };
    
    // Interceptar envio de formulários
    function configurarInterceptacaoFormulario() {
        const forms = document.querySelectorAll('form');
        console.log('Encontrados', forms.length, 'formulários');
        
        forms.forEach((form, index) => {
            console.log(`Configurando formulário ${index + 1}:`, form);
            
            form.addEventListener('submit', function(e) {
                const emailInput = form.querySelector('input[type="email"]');
                if (emailInput) {
                    const email = emailInput.value.trim();
                    console.log('Verificando email no formulário:', email);
                    
                    if (email && verificarEmailCadastrado(email)) {
                        e.preventDefault();
                        mostrarErroEmail(emailInput, 'Este email já está cadastrado. Tente fazer login ou use um email diferente.');
                        return false;
                    }
                }
            });
        });
    }
    
    // Função principal de inicialização
    function init() {
        console.log('Inicializando sistema de erro de email');
        
        // Adicionar CSS se não existir
        if (!document.querySelector('#email-error-styles')) {
            const style = document.createElement('style');
            style.id = 'email-error-styles';
            style.textContent = `
                .email-error-message {
                    display: none;
                    color: #f44336;
                    font-size: 14px;
                    margin-top: 8px;
                    padding: 8px 12px;
                    background: rgba(244, 67, 54, 0.1);
                    border: 1px solid rgba(244, 67, 54, 0.3);
                    border-radius: 6px;
                    animation: slideDown 0.3s ease-out;
                }
                .email-error-message.show {
                    display: block !important;
                }
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        configurarVerificacaoTempoReal();
        configurarInterceptacaoFormulario();
        
        console.log('Sistema de erro de email configurado com sucesso');
    }
    
    // Executar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Expor funções globalmente
    window.mostrarErroEmail = mostrarErroEmail;
    window.removerErroEmail = removerErroEmail;
    window.verificarEmailCadastrado = verificarEmailCadastrado;
    
    // Função de teste
    window.testarErroEmail = function() {
        const emailInput = document.querySelector('input[type="email"]');
        if (emailInput) {
            mostrarErroEmail(emailInput, 'Este email já está cadastrado. Tente fazer login ou use um email diferente.');
        } else {
            console.log('Nenhum input de email encontrado');
        }
    };
    
})();

