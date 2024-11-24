# Projeto de Autenticação com AWS Lambda, API Gateway, Cognito e PostgreSQL

Este projeto implementa uma função AWS Lambda em Node.js que autentica um usuário com base no CPF e senha, consultando um banco de dados PostgreSQL. A autenticação é exposta via API Gateway e utiliza AWS Cognito para gerenciamento de usuários.

## Executando o Projeto: 

- Instale as dependências do Node.js.
- Configure o banco de dados PostgreSQL.
- Empacote a função Lambda.
- Faça o deploy com o Serverless Framework ou Terraform.

## Dependências

Certifique-se de instalar as dependências necessárias:

```sh
npm install pg bcrypt serverless serverless-offline
```

## Deploy local:

Para fazer o deploy da função Lambda e do API Gateway, execute:

```sh
serverless deploy
```

Para testar localmente, você pode usar o plugin serverless-offline:

```sh
serverless offline
```

------------------------------------------------------
## Terraform

Empacotamento da Função Lambda: 
Crie um arquivo lambda.zip contendo o arquivo handler.js e a pasta node_modules:

```sh
zip -r lambda.zip handler.js node_modules
```

terraform: 


```sh
terraform init
```
```sh
terraform apply
```