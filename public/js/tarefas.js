// Variável global para armazenar o ID da tarefa em edição
let currentEditingTaskId = null;

// Função para criar uma nova tarefa
async function criarTarefa() {
    const nome = document.getElementById('nome-tarefa').value.trim();
    const descricao = document.getElementById('descricao-tarefa').value.trim();
    const projetoId = document.getElementById('projeto-tarefa').value;

    // Verificação de preenchimento dos campos
    if (!nome || !descricao || !projetoId) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    try {
        const response = await fetch(`/projetos/${projetoId}/tarefas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, descricao, id_projeto: projetoId })
        });

        if (response.ok) {
            alert('Tarefa criada com sucesso!');
            listarTarefas(projetoId);
            limparFormularioTarefa();
        } else {
            const errorResponse = await response.json();
            alert('Erro ao criar tarefa: ' + errorResponse.error);
        }
    } catch (error) {
        console.error('Erro ao criar tarefa:', error);
        alert('Erro ao criar tarefa. Verifique a conexão ou contate o suporte.');
    }
}

// Função para listar as tarefas associadas a um projeto específico
async function listarTarefas(projetoId) {
    const listaTarefas = document.getElementById('tbody-tarefas');
    listaTarefas.innerHTML = '';

    // Verifica se o projetoId é válido antes de buscar as tarefas
    if (!projetoId) {
        console.warn('Nenhum projeto selecionado.');
        return;
    }

    try {
        const response = await fetch(`/projetos/${projetoId}/tarefas`);
        const tarefas = await response.json();

        if (Array.isArray(tarefas) && tarefas.length > 0) {
            tarefas.forEach(tarefa => {
                const tr = document.createElement('tr');
                const idTd = document.createElement('td');
                const nomeTd = document.createElement('td');
                const descricaoTd = document.createElement('td');
                const acoesTd = document.createElement('td');

                idTd.textContent = tarefa.id;
                nomeTd.textContent = tarefa.nome;
                descricaoTd.textContent = tarefa.descricao;

                const editButton = createEditButton(tarefa);
                const deleteButton = createDeleteButton(tarefa.id, tarefa.id_projeto);

                acoesTd.appendChild(editButton);
                acoesTd.appendChild(deleteButton);

                tr.appendChild(idTd);
                tr.appendChild(nomeTd);
                tr.appendChild(descricaoTd);
                tr.appendChild(acoesTd);

                listaTarefas.appendChild(tr);
            });
        } else {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 4; // Atualizado para refletir o número de colunas
            td.textContent = 'Não existem tarefas!';
            td.style.textAlign = 'center';
            tr.appendChild(td);
            listaTarefas.appendChild(tr);
        }
    } catch (error) {
        console.error('Erro ao listar tarefas:', error);
    }
}

// Backend - Ajustar a função para garantir que sempre retorne um array
async function obterTarefasPorProjeto(projetoId) {
    const conn = await connect();
    const res = await conn.query("SELECT * FROM tarefas WHERE id_projeto=$1", [projetoId]);
    return res.rows; 
}

// Chama a listagem de tarefas apenas após selecionar um projeto
document.getElementById('projeto-tarefa').addEventListener('change', (event) => {
    const projetoId = event.target.value;
    listarTarefas(projetoId);
});

// Adiciona o evento ao formulário de tarefas
document.addEventListener('DOMContentLoaded', function() {
    const formTarefa = document.getElementById('form-tarefa');
    if (formTarefa) {
        formTarefa.addEventListener('submit', async function(event) {
            event.preventDefault();
        });
    } else {
        console.error('O formulário de tarefa não foi encontrado!');
    }
});

// Função para criar o botão de editar
function createEditButton(tarefa) {
    const button = document.createElement('button');
    button.textContent = 'Editar';
    button.id = 'btn-edit';
    button.addEventListener('click', () => {
        document.getElementById('nome-tarefa').value = tarefa.nome;
        document.getElementById('descricao-tarefa').value = tarefa.descricao;
        document.getElementById('projeto-tarefa').value = tarefa.id_projeto;

        document.getElementById('btn-criar-tarefa').textContent = 'Atualizar Tarefa';
        currentEditingTaskId = tarefa.id;
    });
    return button;
}


// Função para atualizar uma tarefa
async function atualizarTarefa() {
    const nome = document.getElementById('nome-tarefa').value.trim();
    const descricao = document.getElementById('descricao-tarefa').value.trim();
    const projetoId = document.getElementById('projeto-tarefa').value;

    // Verificação de preenchimento dos campos
    if (!nome || !descricao || !projetoId) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    try {
        let response;
        if (currentEditingTaskId) {
            // Atualizar tarefa existente
            response = await fetch(`/tarefas/${currentEditingTaskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, descricao, id_projeto: projetoId })
            });
        } else {
            // Criar nova tarefa
            response = await fetch(`/projetos/${projetoId}/tarefas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, descricao, id_projeto: projetoId })
            });
        }

        if (response.ok) {
            alert(currentEditingTaskId ? 'Tarefa atualizada com sucesso!' : 'Tarefa criada com sucesso!');
            listarTarefas(projetoId);
            limparFormularioTarefa();
        } else {
            const errorResponse = await response.json();
            alert('Erro ao salvar tarefa: ' + errorResponse.error);
        }
    } catch (error) {
        console.error('Erro ao salvar tarefa:', error);
        alert('Erro ao salvar tarefa. Verifique a conexão ou contate o suporte.');
    }
}

// Inicializa a listagem de tarefas ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
    const projetoId = document.getElementById('projeto-tarefa').value;
    if (projetoId) {
        listarTarefas(projetoId);
    }
});

// Vincular o evento ao botão de atualizar tarefa
document.getElementById('btn-criar-tarefa').addEventListener('click', atualizarTarefa);

// Função para limpar o formulário
function limparFormularioTarefa() {
    document.getElementById('nome-tarefa').value = '';
    document.getElementById('descricao-tarefa').value = '';
    document.getElementById('projeto-tarefa').value = ''; 
    currentEditingTaskId = null; 
    document.getElementById('btn-criar-tarefa').textContent = 'Criar Tarefa';
}

// Função para atualizar o select de projetos
async function atualizarSelectProjetos(projetoId) {
    try {
        const response = await fetch('/projetos');
        if (response.ok) {
            const projetos = await response.json();
            const select = document.getElementById('projeto-tarefa');
            
            // Limpa o select atual
            select.innerHTML = '';
            
            // Adiciona as opções de projetos
            projetos.forEach(projeto => {
                const option = document.createElement('option');
                option.value = projeto.id;
                option.textContent = projeto.nome;
                if (projeto.id === projetoId) {
                    option.selected = true
                }
                select.appendChild(option);
            });
        } else {
            console.error('Erro ao buscar projetos:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao buscar projetos:', error);
    }
}

function createDeleteButton(tarefaId, projetoId) {
    const button = document.createElement('button');
    button.textContent = 'Excluir';
    button.id = 'btn-excluir';

    // Adiciona o evento de clique ao botão de exclusão
    button.addEventListener('click', async () => {
        const confirmDelete = confirm('Tem certeza que deseja excluir esta tarefa?');
        if (confirmDelete) {
            try {
                // Faz a requisição DELETE para excluir a tarefa
                const response = await fetch(`/tarefas/${tarefaId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    alert('Tarefa excluída com sucesso!');
                    
                    // Atualiza o select de projetos (caso necessário)
                    await atualizarSelectProjetos(projetoId);
                    
                    // Atualiza a lista de tarefas após a exclusão
                    listarTarefas(projetoId);
                } else {
                    const errorResponse = await response.json();
                    alert('Erro ao excluir a tarefa: ' + errorResponse.error);
                }
            } catch (error) {
                console.error('Erro ao excluir a tarefa:', error);
            }
        }
    });

    return button;
}

// Função para limpar o formulário de tarefas
function limparFormularioTarefa() {
    document.getElementById('nome-tarefa').value = '';
    document.getElementById('descricao-tarefa').value = '';
    document.getElementById('projeto-tarefa').value = ''; 
    currentEditingTaskId = null; 
    document.getElementById('btn-criar-tarefa').textContent = 'Criar Tarefa';
}

// Função para preencher o select de projetos
function preencherSelectProjetos(projetos) {
    const select = document.getElementById('projeto-tarefa');
    select.innerHTML = ''; 
    select.innerHTML += '<option value="">Selecione um projeto</option>'; 

    projetos.forEach(projeto => {
        const option = document.createElement('option');
        option.value = projeto.id;
        option.textContent = projeto.nome;
        select.appendChild(option); 
    });
}

// Função para listar os projetos e preencher o select
async function listarProjetos() {
    try {
        const response = await fetch('/projetos');
        const projetos = await response.json();
        preencherSelectProjetos(projetos); // Preencher o select com os projetos
    } catch (error) {
        console.error('Erro ao listar projetos:', error);
    }
}

// Inicializa a listagem de projetos
document.addEventListener('DOMContentLoaded', () => {
    listarProjetos();
});