const { autenticar } = require('./handler');

describe('autenticar - integração', () => {
  it('deve retornar 401 se o usuário não for encontrado', async () => {
    const event = {
      body: JSON.stringify({ cpf: '00000000000', email: 'naoexiste@example.com' }),
    };

    const result = await autenticar(event);

    expect(result.statusCode).toBe(401);
    expect(JSON.parse(result.body).message).toBe('Usuário não encontrado');
  });

  it('deve retornar 200 se a autenticação for bem-sucedida', async () => {
    const event = {
      body: JSON.stringify({ cpf: '12345678900', email: 'teste@example.com' }),
    };

    const result = await autenticar(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).message).toBe('Autenticação bem-sucedida');
  });
});