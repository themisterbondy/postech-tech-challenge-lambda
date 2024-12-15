# Postech FIAP Serverless

Este projeto implementa uma aplicação serverless usando **Azure Functions** e **Node.js**. Ele é estruturado para autenticar clientes usando CPF, validá-los com a biblioteca `cpf-cnpj-validator` e buscar clientes em um banco de dados PostgreSQL. O fluxo completo de CI/CD está configurado com **GitHub Actions**.

## Visão Geral

O projeto é uma API serverless hospedada na **Azure Function App** para autenticação de clientes. Ele contém:

- **Camada de banco de dados**: Conexão com PostgreSQL.
- **Validação de CPF**: Utiliza `cpf-cnpj-validator`.
- **Pipeline CI/CD**: Configuração automatizada com **GitHub Actions**.
- **Autenticação de cliente**: Endpoint que valida e autentica o cliente através de consultas no banco de dados.

## Pré-requisitos

Certifique-se de que você tenha os seguintes requisitos instalados/configurados:

- **Node.js** (versão 20 ou superior)
- **npm** (gerenciador de pacotes do Node.js)
- **Azure Account** (possui acesso ao portal do Azure).
- **PostgreSQL** (instância local ou gerenciada no Azure).
- **Azure Functions Core Tools** (para execução local das funções).

Variáveis de ambiente exigidas:

- `DB_HOST`: Endereço do host do banco de dados.
- `DB_PORT`: Porta do banco de dados.
- `DB_NAME`: Nome do banco de dados.
- `DB_USER`: Usuário do banco de dados.
- `DB_PASSWORD`: Senha do banco de dados.

## Configuração

1. **Clonar o repositório**:

   ```bash
   git clone https://github.com/themisterbondy/postech-tech-challenge-lambda
   cd postech-tech-challenge-lambda
   ```

2. **Instalar dependências**:

   ```bash
   npm install
   ```

3. **Configurar banco de dados**:

   Atualize as variáveis de ambiente mencionadas acima no arquivo `.env`.

4. **Tabela a ser usada no PostgreSQL**

   ```sql
   CREATE TABLE "Customers" (
       "Id" SERIAL PRIMARY KEY,
       "Name" VARCHAR(255) NOT NULL,
       "Cpf" VARCHAR(14) UNIQUE NOT NULL
   );
   ```

## Deploy no Azure

O **GitHub Actions** está configurado para automatizar o build e o deploy no Azure quando um PR for feito para a main:

- As secrets no repositório:
    - `AZUREAPPSERVICE_CLIENTID`
    - `AZUREAPPSERVICE_TENANTID`
    - `AZUREAPPSERVICE_SUBSCRIPTIONID`

Isso acionará o pipeline no GitHub Actions definido em `main_postech-fiap-serverless.yml`, que realizará o deploy diretamente no Azure Function App.

## Endpoints Implementados

### 1. **`POST` customer-authentication**
- **Descrição**: Autentica o cliente através do CPF.
- **URL**: `/api/customer-authentication`
- **Request Body**:

  ```json
  {
    "cpf": "12345678909"
  }
  ```

- **Respostas**:
    - `200 OK`: Cliente encontrado, retorna dados do cliente.
         ```json
      {
          "Id": "guid",
          "Name": "string",
          "Email": "string",
          "Cpf": "string"
      }
      ```
    - `400 Bad Request`: CPF fornecido é inválido.
    - `401 Unauthorized`: Cliente não encontrado.
    - `500 Internal Server Error`: Problema na conexão com o banco.
