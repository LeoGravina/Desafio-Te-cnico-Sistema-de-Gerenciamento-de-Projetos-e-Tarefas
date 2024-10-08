require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require('cors');
const db = require("./db");
const port = process.env.PORT || 3000;
const { connect } = require('./db');

const app = express();

app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Rota para servir o index.html
app.get('/', (req, res) => {
    res.redirect('/index.html');
});

// Listar um projeto específico
app.get("/projetos/:id", async (req, res) => {
    try {
        const projeto = await db.listarProjeto(req.params.id);
        if (!projeto) {
            return res.status(404).json({ error: "Projeto não encontrado" });
        }
        res.status(200).json(projeto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar o projeto" });
    }
});

// Listar todos os projetos
app.get("/projetos", async (req, res) => {
    try {
        const projetos = await db.listarProjetos();
        res.status(200).json(projetos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao listar os projetos" });
    }
});

// Criar um novo projeto
app.post("/projetos", async (req, res) => {
    try {
        const projeto = await db.inserirProjeto(req.body);
        res.status(201).json(projeto);
    } catch (error) {
        console.error('Erro ao inserir projeto:', error);
        res.status(500).json({ error: "Erro ao inserir projeto" });
    }    
});

// Atualizar um projeto existente
app.put("/projetos/:id", async (req, res) => {
    try {
        const projetoAtualizado = await db.atualizarProjeto(req.params.id, req.body);
        if (!projetoAtualizado) {
            return res.status(404).json({ error: "Projeto não encontrado" });
        }
        res.status(200).json(projetoAtualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao atualizar o projeto" });
    }
});

// Excluir um projeto
app.delete("/projetos/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await db.excluirProjeto(id);
        res.status(204).send(); // Envia uma resposta de sucesso
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao excluir projeto" });
    }
});

// Listar todas as tarefas de um projeto específico
app.get('/projetos/:id/tarefas', async (req, res) => {
    const projetoId = req.params.id;
    try {
        const conn = await connect();
        const result = await conn.query('SELECT * FROM tarefas WHERE id_projeto=$1', [projetoId]);

        if (result.rows.length === 0) {
            return res.json({ message: 'Não existem tarefas para este projeto.' });
        }

        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        res.status(500).json({ error: 'Erro ao buscar tarefas.', details: error.message });
    }
});

// Criar uma nova tarefa
app.post("/projetos/:projetoId/tarefas", async (req, res) => {
    try {
        const tarefa = {
            nome: req.body.nome,
            descricao: req.body.descricao,
            id_projeto: req.params.projetoId
        };

        const novaTarefa = await db.inserirTarefa(tarefa);
        res.status(201).json(novaTarefa);
    } catch (error) {
        console.error('Erro ao inserir tarefa:', error);
        res.status(500).json({ error: "Erro ao inserir tarefa" });
    }
});

// Atualizar uma tarefa existente
app.put("/tarefas/:id", async (req, res) => {
    try {
        const tarefaAtualizada = await db.atualizarTarefa(req.params.id, req.body);
        if (!tarefaAtualizada) {
            return res.status(404).json({ error: "Tarefa não encontrada" });
        }
        res.status(200).json(tarefaAtualizada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao atualizar a tarefa" });
    }
});

// Excluir uma tarefa
app.delete("/tarefas/:id", async (req, res) => {
    try {
        const tarefaExcluida = await db.excluirTarefa(req.params.id);
        if (!tarefaExcluida) {
            return res.status(404).json({ error: "Tarefa não encontrada" });
        }
        res.sendStatus(204);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao excluir a tarefa" });
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Backend rodando na porta ${port}`);
});