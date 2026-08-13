/* ==========================================
   ESTUDA+ — JAVASCRIPT
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

    inicializarPesquisa();
    inicializarLogin();
    inicializarCadastro();
    inicializarFavoritos();
    inicializarEstudos();
    inicializarPublicacao();
    inicializarBotoes();

});


/* ==========================================
   BANCO DE DADOS LOCAL
   ========================================== */

function obterDados(chave, padrao = []) {

    const dados = localStorage.getItem(chave);

    if (!dados) {
        return padrao;
    }

    try {
        return JSON.parse(dados);
    } catch {
        return padrao;
    }
}


function salvarDados(chave, dados) {

    localStorage.setItem(
        chave,
        JSON.stringify(dados)
    );

}


/* ==========================================
   NOTIFICAÇÃO
   ========================================== */

function mostrarMensagem(mensagem, tipo = "sucesso") {

    const antiga = document.querySelector(".notification");

    if (antiga) {
        antiga.remove();
    }

    const notification = document.createElement("div");

    notification.className = `notification ${tipo}`;

    notification.textContent = mensagem;

    document.body.appendChild(notification);

    setTimeout(() => {

        notification.classList.add("hide");

        setTimeout(() => {
            notification.remove();
        }, 300);

    }, 2500);

}


/* ==========================================
   PESQUISA
   ========================================== */

function inicializarPesquisa() {

    const camposPesquisa = document.querySelectorAll(
        ".search input, .library-search input"
    );

    camposPesquisa.forEach(campo => {

        campo.addEventListener("keydown", event => {

            if (event.key === "Enter") {

                realizarPesquisa(campo.value);

            }

        });

    });


    const botoesPesquisa = document.querySelectorAll(
        ".search button, .library-search button"
    );

    botoesPesquisa.forEach(botao => {

        botao.addEventListener("click", () => {

            const container = botao.parentElement;

            const input = container.querySelector("input");

            if (input) {

                realizarPesquisa(input.value);

            }

        });

    });

}


function realizarPesquisa(termo) {

    termo = termo.trim();

    if (!termo) {

        mostrarMensagem(
            "Digite algo para pesquisar.",
            "erro"
        );

        return;

    }

    window.location.href =
        `pages/biblioteca.html?busca=${encodeURIComponent(termo)}`;

}


/* ==========================================
   FILTRO DA BIBLIOTECA
   ========================================== */

function filtrarBiblioteca() {

    const parametros =
        new URLSearchParams(window.location.search);

    const busca =
        parametros.get("busca");

    const cards =
        document.querySelectorAll(".material-card");

    if (!busca || !cards.length) {
        return;
    }

    const termo =
        busca.toLowerCase();

    let encontrados = 0;

    cards.forEach(card => {

        const texto =
            card.textContent.toLowerCase();

        if (texto.includes(termo)) {

            card.style.display = "";

            encontrados++;

        } else {

            card.style.display = "none";

        }

    });

    if (encontrados === 0) {

        mostrarMensagem(
            "Nenhum material encontrado.",
            "erro"
        );

    }

}


/* ==========================================
   LOGIN
   ========================================== */

function inicializarLogin() {

    const formulario =
        document.querySelector(".auth-box form");

    if (!formulario) {
        return;
    }

    const titulo =
        document.querySelector(".auth-box h1");

    if (!titulo) {
        return;
    }

    if (!titulo.textContent.includes("Bem-vindo")) {
        return;
    }

    formulario.addEventListener("submit", event => {

        event.preventDefault();

        const inputs =
            formulario.querySelectorAll("input");

        const email =
            inputs[0].value.trim();

        const senha =
            inputs[1].value.trim();

        if (!email || !senha) {

            mostrarMensagem(
                "Preencha todos os campos.",
                "erro"
            );

            return;

        }

        const usuarios =
            obterDados("usuarios");

        const usuario =
            usuarios.find(
                u =>
                    u.email === email &&
                    u.senha === senha
            );

        if (!usuario) {

            mostrarMensagem(
                "E-mail ou senha incorretos.",
                "erro"
            );

            return;

        }

        localStorage.setItem(
            "usuarioLogado",
            JSON.stringify(usuario)
        );

        mostrarMensagem(
            "Login realizado com sucesso!"
        );

        setTimeout(() => {

            window.location.href =
                "../index.html";

        }, 1000);

    });

}


/* ==========================================
   CADASTRO
   ========================================== */

function inicializarCadastro() {

    const formulario =
        document.querySelector(".auth-box form");

    if (!formulario) {
        return;
    }

    const titulo =
        document.querySelector(".auth-box h1");

    if (
        !titulo ||
        !titulo.textContent.includes("Crie sua conta")
    ) {
        return;
    }

    formulario.addEventListener("submit", event => {

        event.preventDefault();

        const inputs =
            formulario.querySelectorAll("input");

        const nome =
            inputs[0].value.trim();

        const email =
            inputs[1].value.trim();

        const senha =
            inputs[2].value.trim();

        const select =
            formulario.querySelector("select");

        const serie =
            select.value;

        if (!nome || !email || !senha || !serie) {

            mostrarMensagem(
                "Preencha todos os campos obrigatórios.",
                "erro"
            );

            return;

        }

        if (senha.length < 6) {

            mostrarMensagem(
                "A senha precisa ter pelo menos 6 caracteres.",
                "erro"
            );

            return;

        }

        const usuarios =
            obterDados("usuarios");

        const emailExistente =
            usuarios.some(
                usuario =>
                    usuario.email === email
            );

        if (emailExistente) {

            mostrarMensagem(
                "Esse e-mail já está cadastrado.",
                "erro"
            );

            return;

        }

        const materias = [];

        const checkboxes =
            formulario.querySelectorAll(
                ".checkbox-group input:checked"
            );

        checkboxes.forEach(checkbox => {

            materias.push(
                checkbox.parentElement.textContent.trim()
            );

        });

        const novoUsuario = {

            id: Date.now(),

            nome,

            email,

            senha,

            serie,

            materias,

            criadoEm:
                new Date().toISOString()

        };

        usuarios.push(novoUsuario);

        salvarDados(
            "usuarios",
            usuarios
        );

        localStorage.setItem(
            "usuarioLogado",
            JSON.stringify(novoUsuario)
        );

        mostrarMensagem(
            "Conta criada com sucesso!"
        );

        setTimeout(() => {

            window.location.href =
                "../index.html";

        }, 1000);

    });

}


/* ==========================================
   FAVORITOS
   ========================================== */

function inicializarFavoritos() {

    const botoes =
        document.querySelectorAll(
            ".material-page .btn"
        );

    botoes.forEach(botao => {

        if (
            botao.textContent.includes("Salvar")
        ) {

            botao.addEventListener(
                "click",
                () => adicionarFavorito(botao)
            );

        }

    });

}


function adicionarFavorito(botao) {

    const material =
        document.querySelector(".material-page");

    if (!material) {
        return;
    }

    const titulo =
        material.querySelector("h1");

    if (!titulo) {
        return;
    }

    const favoritos =
        obterDados("favoritos");

    const nome =
        titulo.textContent.trim();

    const existe =
        favoritos.some(
            item => item.titulo === nome
        );

    if (existe) {

        mostrarMensagem(
            "Esse material já está nos favoritos."
        );

        return;

    }

    favoritos.push({

        id: Date.now(),

        titulo: nome,

        adicionadoEm:
            new Date().toISOString()

    });

    salvarDados(
        "favoritos",
        favoritos
    );

    botao.textContent =
        "✓ Salvo nos favoritos";

    mostrarMensagem(
        "Material adicionado aos favoritos!"
    );

}


/* ==========================================
   ESTUDOS
   ========================================== */

function inicializarEstudos() {

    const tarefas =
        document.querySelectorAll(
            ".study-list input[type='checkbox']"
        );

    if (!tarefas.length) {
        return;
    }

    tarefas.forEach(tarefa => {

        tarefa.addEventListener(
            "change",
            atualizarProgresso
        );

    });

    atualizarProgresso();

}


function atualizarProgresso() {

    const tarefas =
        document.querySelectorAll(
            ".study-list input[type='checkbox']"
        );

    const concluidas =
        document.querySelectorAll(
            ".study-list input[type='checkbox']:checked"
        );

    if (!tarefas.length) {
        return;
    }

    const porcentagem =
        Math.round(
            (concluidas.length / tarefas.length) * 100
        );

    const barra =
        document.querySelector(".progress-bar div");

    const porcentagemTexto =
        document.querySelector(".progress-info strong");

    if (barra) {

        barra.style.width =
            `${porcentagem}%`;

    }

    if (porcentagemTexto) {

        porcentagemTexto.textContent =
            `${porcentagem}%`;

    }

    salvarDados(
        "progressoEstudos",
        {
            total: tarefas.length,
            concluidas: concluidas.length,
            porcentagem
        }
    );

}


/* ==========================================
   ADICIONAR À LISTA DE ESTUDOS
   ========================================== */

function inicializarBotoes() {

    const botoes =
        document.querySelectorAll(
            ".material-page button"
        );

    botoes.forEach(botao => {

        if (
            botao.textContent.includes(
                "Adicionar aos estudos"
            )
        ) {

            botao.addEventListener(
                "click",
                adicionarAosEstudos
            );

        }

        if (
            botao.textContent.includes(
                "Baixar"
            )
        ) {

            botao.addEventListener(
                "click",
                baixarMaterial
            );

        }

    });

}


function adicionarAosEstudos() {

    const titulo =
        document.querySelector(
            ".material-page h1"
        );

    if (!titulo) {
        return;
    }

    const lista =
        obterDados("listaEstudos");

    const nome =
        titulo.textContent.trim();

    const existe =
        lista.some(
            item => item.titulo === nome
        );

    if (existe) {

        mostrarMensagem(
            "Esse material já está na sua lista."
        );

        return;

    }

    lista.push({

        id: Date.now(),

        titulo: nome,

        concluido: false

    });

    salvarDados(
        "listaEstudos",
        lista
    );

    mostrarMensagem(
        "Material adicionado aos seus estudos!"
    );

}


/* ==========================================
   DOWNLOAD
   ========================================== */

function baixarMaterial() {

    const titulo =
        document.querySelector(
            ".material-page h1"
        );

    if (!titulo) {
        return;
    }

    const conteudo =
        document.querySelector(
            ".document-preview"
        );

    if (!conteudo) {
        return;
    }

    const texto =
        `${titulo.textContent}\n\n` +
        conteudo.innerText;

    const arquivo =
        new Blob(
            [texto],
            {
                type: "text/plain;charset=utf-8"
            }
        );

    const url =
        URL.createObjectURL(arquivo);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        `${titulo.textContent}.txt`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

    mostrarMensagem(
        "Material baixado!"
    );

}


/* ==========================================
   PUBLICAÇÃO DE MATERIAL
   ========================================== */

function inicializarPublicacao() {

    const formulario =
        document.querySelector(".form-page form");

    if (!formulario) {
        return;
    }

    formulario.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const campos =
                formulario.querySelectorAll(
                    "input, textarea, select"
                );

            const titulo =
                campos[0].value.trim();

            const descricao =
                campos[1].value.trim();

            const materia =
                campos[2].value;

            const tipo =
                campos[3].value;

            const arquivo =
                campos[4].files[0];

            if (
                !titulo ||
                !descricao ||
                !materia ||
                !tipo
            ) {

                mostrarMensagem(
                    "Preencha todos os campos.",
                    "erro"
                );

                return;

            }

            const materiais =
                obterDados("materiais");

            const novoMaterial = {

                id: Date.now(),

                titulo,

                descricao,

                materia,

                tipo,

                arquivo:
                    arquivo
                        ? arquivo.name
                        : null,

                status:
                    "pendente",

                criadoEm:
                    new Date().toISOString()

            };

            materiais.push(
                novoMaterial
            );

            salvarDados(
                "materiais",
                materiais
            );

            formulario.reset();

            mostrarMensagem(
                "Material enviado para análise!"
            );

        }
    );

}


/* ==========================================
   PERFIL
   ========================================== */

function carregarPerfil() {

    const usuario =
        JSON.parse(
            localStorage.getItem(
                "usuarioLogado"
            )
        );

    if (!usuario) {
        return;
    }

    const perfil =
        document.querySelector(".profile");

    if (!perfil) {
        return;
    }

    const nome =
        perfil.querySelector("h1");

    const serie =
        perfil.querySelector("p");

    const avatar =
        perfil.querySelector(".avatar");

    if (nome) {

        nome.textContent =
            usuario.nome;

    }

    if (serie) {

        serie.textContent =
            usuario.serie;

    }

    if (avatar) {

        const iniciais =
            usuario.nome
                .split(" ")
                .map(nome =>
                    nome.charAt(0)
                )
                .slice(0, 2)
                .join("")
                .toUpperCase();

        avatar.textContent =
            iniciais;

    }

}


/* ==========================================
   USUÁRIO LOGADO NO HEADER
   ========================================== */

function atualizarHeader() {

    const usuario =
        JSON.parse(
            localStorage.getItem(
                "usuarioLogado"
            )
        );

    if (!usuario) {
        return;
    }

    const header =
        document.querySelector("header");

    if (!header) {
        return;
    }

    const area =
        header.querySelector(
            "div:last-child"
        );

    if (!area) {
        return;
    }

    area.innerHTML = `

        <span style="
            margin-right: 12px;
            color: #6b6f85;
            font-size: 14px;
        ">
            Olá, ${usuario.nome.split(" ")[0]}!
        </span>

        <button
            class="btn-outline"
            id="logoutBtn"
        >
            Sair
        </button>

    `;

    const logout =
        document.querySelector(
            "#logoutBtn"
        );

    logout.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "usuarioLogado"
            );

            mostrarMensagem(
                "Você saiu da sua conta."
            );

            setTimeout(() => {

                window.location.href =
                    "../index.html";

            }, 800);

        }
    );

}