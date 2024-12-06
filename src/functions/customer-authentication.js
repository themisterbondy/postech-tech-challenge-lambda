const { app } = require('@azure/functions');
const { Pool } = require('pg');
const { cpf: cpfValidator } = require('cpf-cnpj-validator');

// Conectando ao banco de dados
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl: true
});


app.http('customer-authentication', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        // Log de início da requisição
        context.info('Iniciando autenticação de cliente.');

        // Obtendo o CPF do corpo da requisição
        const { cpf } = await request.json();
        context.info(`CPF recebido para autenticação: ${cpf}`);

        // Validação do CPF
        if (!cpfValidator.isValid(cpf)) {
            context.error(`CPF inválido: ${cpf}`);
            return {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: 'CPF inválido' }),
            };
        }

        try {

            context.info('Tentando conexão ao banco de dados...');
            const client = await pool.connect();
            context.info('Conexão ao banco de dados realizada com sucesso.')

            // Executando consulta SQL
            context.info(`Executando consulta no banco para CPF: ${cpf}`);
            const query = 'SELECT * FROM "Customers" WHERE "Cpf" = $1';
            const res = await client.query(query, [cpf]);

            if (res.rows.length === 0) {
                context.error(`Nenhum usuário encontrado com o CPF: ${cpf}`);
                return {
                    status: 401,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message: 'Usuário não encontrado' }),
                };
            }
            // Usuário encontrado
            const customer = res.rows[0];
            context.info(`Usuário encontrado com sucesso: ${JSON.stringify(customer)}`);


            return {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ customer }),
            };

            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ customer }),
            };

        } catch (error) {
            // Tratamento de erro e log do erro
            context.error('Erro durante o processamento da requisição:', error);
            throw error;
        } finally {
            client.release();
        }
    }
});