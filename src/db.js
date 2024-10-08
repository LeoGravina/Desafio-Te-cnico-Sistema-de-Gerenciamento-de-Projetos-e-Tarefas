const { Pool } = require('pg');

async function connect() {
    if (global.connection) return global.connection;

    const pool = new Pool({
        connectionString: process.env.CONNECTION_STRING
    });

    try {
        const client = await pool.connect();
        console.log("Criou pool de conexões no PostgreSQL!");
        global.connection = pool;
        return pool;
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        throw error;
    }
}

// Funções de gerenciamento de projetos
async function listarProjetos() {
    const conn = await connect();
    const res = await conn.query("SELECT * FROM projetos");
    console.log(res.rows);
    return res.rows;
}

async function listarProjeto(id) {
    const conn = await connect();
    const res = await conn.query("SELECT * FROM projetos WHERE id=$1", [id]);
    return res.rows[0]; // Retorna o primeiro projeto
}

async function inserirProjeto(projeto) {
    const conn = await connect();
    const sql = "INSERT INTO projetos(nome, descricao, data_criacao) VALUES ($1, $2, $3) RETURNING *";
    const values = [projeto.nome, projeto.descricao, projeto.data_criacao];
    const res = await conn.query(sql, values);
    return res.rows[0]; // Retorna o projeto inserido
}

// Função para atualizar o projeto
async function atualizarProjeto(id, projeto) {
    const conn = await connect();
    const sql = "UPDATE projetos SET nome=$1, descricao=$2, data_criacao=$3 WHERE id=$4 RETURNING *";
    const values = [projeto.nome, projeto.descricao, projeto.data_criacao, id];
    const res = await conn.query(sql, values);
    return res.rows[0]; // Retorna o projeto atualizado
}

// Função para excluir o projeto
async function excluirProjeto(id) {
    try {
        const conn = await connect();
        const sql = "DELETE FROM projetos WHERE id = $1 RETURNING *"; // Mantém a estrutura da query
        const res = await conn.query(sql, [id]);

        if (res.rows.length === 0) {
            throw new Error(`Projeto com ID ${id} não encontrado.`);
        }
        return res.rows[0]; // Retorna o projeto excluído
    } catch (error) {
        console.error('Erro ao excluir o projeto:', error);
        throw error; // Lança o erro para ser tratado onde a função for chamada
    }
}

// Funções de gerenciamento de tarefas
async function listarTarefas(projetoId) {
    const conn = await connect();
    const res = await conn.query("SELECT * FROM tarefas WHERE id_projeto=$1", [projetoId]);
    return res.rows;
}

async function listarTarefa(id) {
    const conn = await connect();
    const res = await conn.query("SELECT * FROM tarefas WHERE id=$1", [id]);
    return res.rows[0];
}

async function inserirTarefa(tarefa) {
    const conn = await connect();
    const sql = "INSERT INTO tarefas(nome, descricao, id_projeto) VALUES ($1, $2, $3) RETURNING *";
    const values = [tarefa.nome, tarefa.descricao, tarefa.id_projeto];
    const res = await conn.query(sql, values);
    return res.rows[0];
}

async function atualizarTarefa(id, tarefa) {
    const conn = await connect();
    const sql = "UPDATE tarefas SET nome=$1, descricao=$2 WHERE id=$3 RETURNING *";
    const values = [tarefa.nome, tarefa.descricao, id];
    const res = await conn.query(sql, values);
    return res.rows[0]; 
}

async function excluirTarefa(id) {
    const conn = await connect();
    const sql = "DELETE FROM tarefas WHERE id=$1 RETURNING *";
    const res = await conn.query(sql, [id]);
    return res.rows[0];
}

module.exports = {
    connect,
    listarProjetos,
    listarProjeto,
    inserirProjeto,
    atualizarProjeto,
    excluirProjeto,
    listarTarefas,
    listarTarefa,
    inserirTarefa,
    atualizarTarefa,
    excluirTarefa
};