
# Gerenciamento de Projetos e Tarefas

Este é um sistema simples de gerenciamento de projetos e tarefas desenvolvido com Node.js, PostgreSQL, HTML, CSS e JavaScript. A aplicação permite criar, visualizar, editar e excluir projetos e tarefas.

## Funcionalidades

- **Gerenciamento de Projetos**: Criação, visualização, edição e exclusão de projetos.
- **Gerenciamento de Tarefas**: Criação, visualização, edição e exclusão de tarefas relacionadas a projetos.
- **Integração com Banco de Dados PostgreSQL**: Todas as informações de projetos e tarefas são armazenadas e gerenciadas em um banco de dados PostgreSQL.

## Tecnologias Utilizadas

- **Backend**: Node.js, Express
- **Banco de Dados**: PostgreSQL
- **Frontend**: HTML, CSS, JavaScript
- **Outros**: Dotenv para gerenciamento de variáveis de ambiente

## Pré-requisitos

Antes de começar, você vai precisar ter as seguintes ferramentas instaladas em sua máquina:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- Gerenciador de pacotes como npm ou yarn
- (Opcional) [Postman](https://www.postman.com/) para testar as rotas da API

## Configuração do Banco de Dados

1. Instale o PostgreSQL em sua máquina.
2. Crie um banco de dados para a aplicação, por exemplo: `mybd`.
3. Atualize a variável `CONNECTION_STRING` no arquivo `.env` para refletir a conexão do PostgreSQL. Exemplo:

```bash
CONNECTION_STRING=postgres://username:password@localhost:5433/mybd
PORT=3000
```

## Instalação

1. Clone este repositório em sua máquina local.
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   ```

2. Entre na pasta do projeto.
   ```bash
   cd node-postgresql
   ```

3. Instale as dependências do projeto.
   ```bash
   npm install
   ```

4. Configure o arquivo `.env` na raiz do projeto, conforme indicado na seção **Configuração do Banco de Dados**.

## Executando o Projeto

1. Execute o servidor usando o seguinte comando:
   ```bash
   npm start
   ```

2. Acesse a aplicação no navegador no endereço:
   ```
   http://localhost:3000
   ```
   
## Endpoints da API

- **`GET /projetos`**: Retorna todos os projetos.
- **`GET /projetos/:id`**: Retorna um projeto específico.
- **`POST /projetos`**: Cria um novo projeto.
- **`PUT /projetos/:id`**: Atualiza um projeto existente.
- **`DELETE /projetos/:id`**: Deleta um projeto.

- **`GET /tarefas`**: Retorna todas as tarefas.
- **`GET /tarefas/:id`**: Retorna uma tarefa específica.
- **`POST /tarefas`**: Cria uma nova tarefa.
- **`PUT /tarefas/:id`**: Atualiza uma tarefa existente.
- **`DELETE /tarefas/:id`**: Deleta uma tarefa.

## Licença

Este projeto está sob a licença [MIT](https://opensource.org/licenses/MIT).
