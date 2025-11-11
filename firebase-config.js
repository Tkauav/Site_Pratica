// Verificar se já foi carregado
if (window.firebaseConfigLoaded) {
    console.log('Firebase já foi carregado, usando instâncias existentes');
} else {
    window.firebaseConfigLoaded = true;

    // Configuração do Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyAZer-O-YgBy_uitlp44mhNIXwlVnczxik",
        authDomain: "praticamais-5ce0b.firebaseapp.com",
        projectId: "praticamais-5ce0b",
        storageBucket: "praticamais-5ce0b.firebasestorage.app",
        messagingSenderId: "200608014377",
        appId: "1:200608014377:web:58b8fa10b047a2fcad3c38",
        measurementId: "G-XRKSLYRBE1"
    };

    // Inicializar Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    // Armazenar referências globalmente
    window.db = firebase.firestore();
    window.auth = firebase.auth();

    // Funções para gerenciar usuários
    window.UserManager = {
        // Cadastrar novo usuário
        async cadastrarUsuario(usuario) {
            try {
                // Criar usuário no Firebase Auth
                const userCredential = await window.auth.createUserWithEmailAndPassword(
                    usuario.email, 
                    usuario.senha
                );
                
                const user = userCredential.user;
                
                // Salvar dados adicionais no Firestore
                await window.db.collection('users').doc(user.uid).set({
                    nome: usuario.nome,
                    email: usuario.email,
                    dataCadastro: firebase.firestore.FieldValue.serverTimestamp(),
                    preferencias: {
                        esporteFavorito: '',
                        notificacoes: true,
                        tema: 'claro',
                        esportesInteresse: []
                    }
                });
                
                console.log('Usuário cadastrado com sucesso!');
                return { success: true, user: user };
                
            } catch (error) {
                console.error('Erro ao cadastrar usuário:', error);
                return { success: false, error: error.message };
            }
        },
        
        // Fazer login
        async fazerLogin(email, senha) {
            try {
                const userCredential = await window.auth.signInWithEmailAndPassword(email, senha);
                const user = userCredential.user;
                
                // Buscar dados do usuário no Firestore
                const userDoc = await window.db.collection('users').doc(user.uid).get();
                const userData = userDoc.data();
                
                // Salvar no sessionStorage
                sessionStorage.setItem('currentUser', JSON.stringify({
                    uid: user.uid,
                    nome: userData.nome,
                    email: userData.email,
                    preferencias: userData.preferencias
                }));
                
                console.log('Login realizado com sucesso!');
                return { success: true, user: userData };
                
            } catch (error) {
                console.error('Erro ao fazer login:', error);
                return { success: false, error: error.message };
            }
        },
        
        // Fazer logout
        async fazerLogout() {
            try {
                await window.auth.signOut();
                sessionStorage.removeItem('currentUser');
                console.log('Logout realizado com sucesso!');
                return { success: true };
            } catch (error) {
                console.error('Erro ao fazer logout:', error);
                return { success: false, error: error.message };
            }
        },
        
        // Atualizar preferências do usuário
        async atualizarPreferencias(uid, preferencias) {
            try {
                await window.db.collection('users').doc(uid).update({
                    'preferencias': preferencias
                });
                
                // Atualizar sessionStorage
                const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
                if (currentUser) {
                    currentUser.preferencias = preferencias;
                    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
                }
                
                console.log('Preferências atualizadas com sucesso!');
                return { success: true };
            } catch (error) {
                console.error('Erro ao atualizar preferências:', error);
                return { success: false, error: error.message };
            }
        },
        
        // Buscar usuário por ID
        async buscarUsuario(uid) {
            try {
                const userDoc = await window.db.collection('users').doc(uid).get();
                if (userDoc.exists) {
                    return { success: true, data: userDoc.data() };
                } else {
                    return { success: false, error: 'Usuário não encontrado' };
                }
            } catch (error) {
                console.error('Erro ao buscar usuário:', error);
                return { success: false, error: error.message };
            }
        },
        
        // Adicionar esporte aos favoritos
        async adicionarEsporteFavorito(uid, esporte) {
            try {
                const userDoc = window.db.collection('users').doc(uid);
                await userDoc.update({
                    'preferencias.esportesInteresse': firebase.firestore.FieldValue.arrayUnion(esporte)
                });
                
                console.log('Esporte adicionado aos favoritos!');
                return { success: true };
            } catch (error) {
                console.error('Erro ao adicionar esporte favorito:', error);
                return { success: false, error: error.message };
            }
        },
        
        // Remover esporte dos favoritos
        async removerEsporteFavorito(uid, esporte) {
            try {
                const userDoc = window.db.collection('users').doc(uid);
                await userDoc.update({
                    'preferencias.esportesInteresse': firebase.firestore.FieldValue.arrayRemove(esporte)
                });
                
                console.log('Esporte removido dos favoritos!');
                return { success: true };
            } catch (error) {
                console.error('Erro ao remover esporte favorito:', error);
                return { success: false, error: error.message };
            }
        }
    };

    // Verificar se usuário está logado
    window.verificarUsuarioLogado = function() {
        return new Promise((resolve) => {
            window.auth.onAuthStateChanged((user) => {
                if (user) {
                    // Usuário está logado
                    window.db.collection('users').doc(user.uid).get().then((doc) => {
                        if (doc.exists) {
                            const userData = doc.data();
                            sessionStorage.setItem('currentUser', JSON.stringify({
                                uid: user.uid,
                                nome: userData.nome,
                                email: userData.email,
                                preferencias: userData.preferencias
                            }));
                            resolve({ logado: true, user: userData });
                        } else {
                            resolve({ logado: false });
                        }
                    });
                } else {
                    // Usuário não está logado
                    sessionStorage.removeItem('currentUser');
                    resolve({ logado: false });
                }
            });
        });
    };

    console.log('✅ Firebase configurado com sucesso!');
}