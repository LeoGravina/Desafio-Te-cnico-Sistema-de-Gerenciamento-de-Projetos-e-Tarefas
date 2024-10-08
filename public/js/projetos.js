// Variável global para armazenar o ID do projeto em edição
let currentEditingProjectId = null;

// Função para criar um novo projeto
async function criarProjeto() {
    const nome = document.getElementById('nome-projeto').value;
    const descricao = document.getElementById('descricao-projeto').value;
    const dataCriacao = document.getElementById('data-criacao').value;

    console.log("Nome:", nome);
    console.log("Descrição:", descricao);
    console.log("Data de Criação:", dataCriacao);

    try {
        const response = await fetch('/projetos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, descricao, data_criacao: dataCriacao })
        });

        console.log("Resposta do servidor:", response);
        const responseData = await response.json();
        console.log("Dados da resposta:", responseData);

        if (response.ok) {
            alert('Projeto criado com sucesso!');
            listarProjetos();
            limparFormularioProjeto();
        } else {
            alert('Erro ao criar projeto: ' + responseData.error);
        }
    } catch (error) {
        console.error('Erro ao criar projeto:', error);
        alert('Erro ao criar projeto: ' + error.message);
    }
}

// Função para listar os projetos
async function listarProjetos() {
    const listaProjetos = document.getElementById('tbody-projetos');
    if (!listaProjetos) {
        console.error('Elemento tbody-projetos não encontrado');
        return;
    }
    listaProjetos.innerHTML = '';

    try {
        const response = await fetch('/projetos');
        const projetos = await response.json();

        if (projetos.length === 0) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 5; 
            td.textContent = 'Não existem projetos!';
            td.style.textAlign = 'center'; 
            tr.appendChild(td);
            listaProjetos.appendChild(tr);
        } else {
            projetos.forEach(projeto => {
                const tr = document.createElement('tr');

                const dataCriacao = new Date(projeto.data_criacao).toLocaleDateString('pt-BR');
                const idTd = document.createElement('td');
                const nomeTd = document.createElement('td');
                const descricaoTd = document.createElement('td');
                const dataTd = document.createElement('td');
                const acoesTd = document.createElement('td');

                idTd.textContent = projeto.id;
                nomeTd.textContent = projeto.nome;
                descricaoTd.textContent = projeto.descricao;
                dataTd.textContent = dataCriacao;

                const editButton = createEditButton(projeto);
                const deleteButton = createDeleteButton(projeto.id);

                acoesTd.appendChild(editButton);
                acoesTd.appendChild(deleteButton);

                tr.appendChild(idTd);
                tr.appendChild(nomeTd);
                tr.appendChild(descricaoTd);
                tr.appendChild(dataTd);
                tr.appendChild(acoesTd);

                listaProjetos.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('Erro ao listar projetos:', error);
    }
}

// Adicione a mesma verificação de elemento para o formulário de projeto
document.addEventListener('DOMContentLoaded', function() {
    const formProjeto = document.getElementById('form-projeto');
    if (formProjeto) {
        formProjeto.addEventListener('submit', async function(event) {
            event.preventDefault();
            if (currentEditingProjectId) {
                await editarProjeto();
            } else {
                await criarProjeto();
            }
        });
    } else {
        console.error('O formulário de projeto não foi encontrado!');
    }
});


// Função para criar o botão de editar
function createEditButton(projeto) {
    const button = document.createElement('button');
    button.textContent = 'Editar';
    button.id = 'btn-edit';
    button.addEventListener('click', () => {
        document.getElementById('nome-projeto').value = projeto.nome;
        document.getElementById('descricao-projeto').value = projeto.descricao;
        document.getElementById('data-criacao').value = projeto.data_criacao;

        const criarButton = document.getElementById('btn-criar');
        criarButton.textContent = 'Atualizar Projeto';

        currentEditingProjectId = projeto.id;

        criarButton.onclick = function() {
            editarProjeto();
            criarButton.textContent = 'Criar Projeto';
            limparFormularioProjeto();
            currentEditingProjectId = null;
        };
    });

    return button;
}

// Função para criar o botão de excluir
function createDeleteButton(projetoId) {
    const button = document.createElement('button');
    button.textContent = 'Excluir';
    button.id = 'btn-excluir';
    button.onclick = async () => {
        const confirmDelete = confirm('Tem certeza que deseja excluir este projeto?');
        if (confirmDelete) {
            try {
                const response = await fetch(`/projetos/${projetoId}`, { method: 'DELETE' });
                if (response.ok) {
                    listarProjetos();
                } else {
                    console.error('Erro ao excluir o projeto:', response.statusText);
                }
            } catch (error) {
                console.error('Erro ao excluir projeto:', error);
            }
        }
    };
    return button;
}

// Função para editar um projeto
async function editarProjeto() {
    if (currentEditingProjectId) {
        const nome = document.getElementById('nome-projeto').value;
        const descricao = document.getElementById('descricao-projeto').value;
        const dataCriacao = document.getElementById('data-criacao').value;

        try {
            const response = await fetch(`/projetos/${currentEditingProjectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, descricao, data_criacao: dataCriacao })
            });

            if (response.ok) {
                alert('Projeto atualizado com sucesso!');
                listarProjetos();
                limparFormularioProjeto();
                currentEditingProjectId = null;
            } else {
                const error = await response.json();
                alert('Erro ao atualizar projeto: ' + error.error);
            }
        } catch (error) {
            console.error('Erro ao atualizar projeto:', error);
        }
    }
}

// Função para limpar o formulário de projetos
function limparFormularioProjeto() {
    document.getElementById('nome-projeto').value = '';
    document.getElementById('descricao-projeto').value = '';
    document.getElementById('data-criacao').value = '';
}

// Inicializa a listagem de projetos ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
    listarProjetos();
});