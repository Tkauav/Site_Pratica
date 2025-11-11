# 🔥 Configuração do Firebase - Pratica+

## **Passo 1: Criar Projeto no Firebase**

1. Acesse [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Nome do projeto: `praticamais` (ou o nome que preferir)
4. Ative o Google Analytics (opcional)
5. Clique em "Criar projeto"

## **Passo 2: Configurar Authentication**

1. No painel do Firebase, vá em "Authentication"
2. Clique em "Começar"
3. Vá na aba "Sign-in method"
4. Ative "Email/Password"
5. Clique em "Salvar"

## **Passo 3: Configurar Firestore Database**

1. No painel do Firebase, vá em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Modo de teste" (para desenvolvimento)
4. Escolha a localização mais próxima (ex: us-central1)
5. Clique em "Concluído"

## **Passo 4: Obter Configurações**

1. No painel do Firebase, vá em "Configurações do projeto" (ícone de engrenagem)
2. Role para baixo até "Seus aplicativos"
3. Clique em "Web" (ícone `</>`)
4. Nome do app: `praticamais-web`
5. Clique em "Registrar app"
6. **COPIE** as configurações que aparecem

## **Passo 5: Atualizar firebase-config.js**

Substitua as configurações no arquivo `firebase-config.js`:

```javascript
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto-id",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
};
```

## **Passo 6: Configurar Regras do Firestore**

No Firestore Database, vá em "Regras" e substitua por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler/escrever apenas seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Permitir leitura de dados públicos
    match /{document=**} {
      allow read: if true;
    }
  }
}
```

## **Passo 7: Testar**

1. Abra o `index.html` no navegador
2. Vá para a página de cadastro
3. Cadastre um usuário
4. Faça login
5. Verifique se os dados aparecem no Firestore

## **📊 Estrutura do Banco de Dados**

### **Coleção: users**
```json
{
  "nome": "João Victor",
  "email": "joao@email.com",
  "dataCadastro": "timestamp",
  "preferencias": {
    "esporteFavorito": "Futebol",
    "notificacoes": true,
    "tema": "escuro",
    "esportesInteresse": ["Futebol", "Basquete"]
  }
}
```

## **🔧 Funções Disponíveis**

- `UserManager.cadastrarUsuario(usuario)` - Cadastrar usuário
- `UserManager.fazerLogin(email, senha)` - Fazer login
- `UserManager.fazerLogout()` - Fazer logout
- `UserManager.atualizarPreferencias(uid, preferencias)` - Atualizar preferências
- `UserManager.adicionarEsporteFavorito(uid, esporte)` - Adicionar esporte favorito
- `UserManager.removerEsporteFavorito(uid, esporte)` - Remover esporte favorito

## **✅ Pronto!**

Agora seu projeto está conectado ao Firebase e pode salvar dados de usuários e preferências na nuvem!
