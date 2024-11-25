const { Client } = require('pg');

module.exports.autenticar = async (event) => {
    const { cpf, email } = JSON.parse(event.body);

    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD, 
        port: process.env.DB_PORT,
    });

    try {
        await client.connect();

        const res = await client.query('SELECT * FROM Customer WHERE cpf = $1 OR email = $2', [cpf, email]);

        if (res.rows.length === 0) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Usuário não encontrado' }),
            };
        }
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Autenticação bem-sucedida' }),
        };
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Erro interno do servidor' }),
        };
    } finally {
        await client.end();
    }
};