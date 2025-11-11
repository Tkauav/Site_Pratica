// Cards -> navegam para article.html (opcional)
document.querySelectorAll('.card[data-article]').forEach(card=>{
card.addEventListener('click',()=>{
const t=encodeURIComponent(card.dataset.title||'Matéria');
const i=encodeURIComponent(card.dataset.image||'');
location.href=`article.html?title=${t}&image=${i}`;
});
});

// Landing CTA - removido "Fale conosco"

// Sidebar toggle otimizado para o portal
document.addEventListener('DOMContentLoaded', function() {
  const bar = document.querySelector('.bar');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const closeBtn = document.getElementById('closeMenu');
  
  if (!bar || !sidebar || !overlay) {
    console.log('Elementos do sidebar não encontrados');
    return;
  }
  
  let isOpen = false;
  
  const open = () => {
    if (isOpen) return;
    isOpen = true;
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  
  const close = () => {
    if (!isOpen) return;
    isOpen = false;
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  };
  
  // Event listeners otimizados
  bar.addEventListener('click', open, { passive: true });
  overlay.addEventListener('click', close, { passive: true });
  
  // Botão de fechar
  if (closeBtn) {
    console.log('Botão de fechar encontrado e configurado');
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Botão de fechar clicado');
      close();
    }, { passive: false });
  } else {
    console.log('Botão de fechar não encontrado');
  }
  
  // Fechar com ESC otimizado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      close();
    }
  }, { passive: true });
  
  // Fechar ao redimensionar janela
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && isOpen) {
      close();
    }
  }, { passive: true });
});

// Carrossel movido para inline no portal.html

// Remover elementos de usuário da header
function removeUserElementsFromHeader() {
    const header = document.querySelector('.site-header');
    if (header) {
        // Remover todos os elementos de usuário
        const userElements = header.querySelectorAll('.user-area, .user-info, .user-avatar, .user-details, .user-name, .btn-logout');
        userElements.forEach(element => element.remove());
        
        // Forçar ocultação com CSS inline
        const nav = header.querySelector('.nav');
        if (nav) {
            const userArea = nav.querySelector('.user-area');
            if (userArea) {
                userArea.style.display = 'none';
                userArea.style.visibility = 'hidden';
                userArea.style.opacity = '0';
                userArea.remove();
            }
        }
        
        // Remover todas as sombras da header
        const allElements = header.querySelectorAll('*');
        allElements.forEach(element => {
            element.style.boxShadow = 'none';
            element.style.webkitBoxShadow = 'none';
            element.style.mozBoxShadow = 'none';
            element.style.textShadow = 'none';
            element.style.filter = 'none';
            element.style.webkitFilter = 'none';
        });
        
        // Remover sombras do próprio header
        header.style.boxShadow = 'none';
        header.style.webkitBoxShadow = 'none';
        header.style.mozBoxShadow = 'none';
        header.style.textShadow = 'none';
        header.style.filter = 'none';
        header.style.webkitFilter = 'none';
    }
}

// Executar imediatamente
removeUserElementsFromHeader();

// Executar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', removeUserElementsFromHeader);

// Executar periodicamente para garantir que elementos não apareçam
setInterval(removeUserElementsFromHeader, 1000);