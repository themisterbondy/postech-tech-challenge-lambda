
# Projeto Postech Tech Challenge Lambda

## Visão Geral

Este projeto é uma aplicação serverless desenvolvida utilizando Azure Functions. O objetivo principal é fornecer um serviço de autenticação de clientes baseado em CPF.

## Estrutura do Projeto

```
.
├── .funcignore
├── .github/
│   └── workflows/
│       └── main_postech-fiap-serverless.yml
├── .gitignore
├── .vscode/
│   ├── extensions.json
│   ├── launch.json
│   ├── settings.json
│   └── tasks.json
├── host.json
├── package.json
└── src/
    ├── functions/
    │   └── customer-authentication.js
    └── index.js
```

## Dependências

As principais dependências do projeto são:

- `@azure/functions`: Biblioteca para desenvolvimento de Azure Functions.

cpf-cnpj-validator

Biblioteca para validação de CPF e CNPJ.
- Biblioteca para conexão com o banco de dados PostgreSQL.

## Scripts

Os scripts disponíveis no ***package.json***

 são:

- `start`: Inicia o servidor de funções do Azure.
- `test`: Executa os testes (atualmente não há testes implementados).

## Configurações do VSCode

### Extensões Recomendadas

Arquivo: ***extensions.json***

```json
{
  "recommendations": [
    "ms-azuretools.vscode-azurefunctions"
  ]
}
```

### Tarefas

Arquivo: ***tasks.json***

```json
{
	"version": "2.0.0",
	"tasks": [
		{
			"type": "func",
			"label": "func: host start",
			"command": "host start",
			"problemMatcher": "$func-node-watch",
			"isBackground": true,
			"dependsOn": "npm install (functions)"
		},
		{
			"type": "shell",
			"label": "npm install (functions)",
			"command": "npm install"
		},
		{
			"type": "shell",
			"label": "npm prune (functions)",
			"command": "npm prune --production",
			"problemMatcher": []
		}
	]
}
```

### Configurações

Arquivo: ***settings.json***

```json
{
    "azureFunctions.deploySubpath": ".",
    "azureFunctions.postDeployTask": "npm install (functions)",
    "azureFunctions.projectLanguage": "JavaScript",
    "azureFunctions.projectRuntime": "~4",
    "debug.internalConsoleOptions": "neverOpen",
    "azureFunctions.projectLanguageModel": 4,
    "azureFunctions.preDeployTask": "npm prune (functions)"
}
```

### Configurações de Debug

Arquivo: ***launch.json***


```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Attach to Node Functions",
            "type": "node",
            "request": "attach",
            "restart": true,
            "port": 9229,
            "preLaunchTask": "func: host start"
        }
    ]
}
```

## Fluxo de Autenticação

O fluxo de autenticação é implementado na função customer-authentication localizada em ***customer-authentication.js***

### Passos do Fluxo de Autenticação

1. **Recepção da Requisição**:
   - A função é acionada via HTTP POST.
   - O CPF é extraído do corpo da requisição.

2. **Validação do CPF**:
   - O CPF é validado utilizando a biblioteca 


3. **Conexão com o Banco de Dados**:
   - Uma conexão com o banco de dados PostgreSQL é estabelecida utilizando a biblioteca `pg`.

4. **Consulta ao Banco de Dados**:
   - Uma consulta SQL é executada para verificar se o CPF existe na tabela `Customers`.

5. **Resposta**:
   - Se o CPF for encontrado, os dados do cliente são retornados.
   - Se o CPF não for encontrado, uma mensagem de erro é retornada.
   - Em caso de erro na conexão ou na consulta, uma mensagem de erro é retornada.

## Deploy

O deploy é realizado utilizando GitHub Actions conforme definido no arquivo **main_postech-fiap-serverless.yml**


### Passos do Deploy

1. **Build**:
   - Checkout do código.
   - Instalação das dependências.
   - Execução dos testes (se houver).
   - Criação do artefato de release.

2. **Deploy**:
   - Download do artefato de release.
   - Login no Azure.
   - Deploy da aplicação no Azure Functions.
