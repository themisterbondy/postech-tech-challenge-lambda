const { Client } = require('pg');
const { autenticar } = require('./handler');
const { mockDeep } = require('jest-mock-extended');

jest.mock('pg', () => {
  const mClient = mockDeep<Client>();
  return { Client: jest.fn(() => mClient) };
});

describe('autenticar', () => {
  let client;

  beforeEach(() => {
    client = new Client();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar 401 se o usuário não for encontrado', async () => {
    client.connect.mockResolvedValueOnce();
    client.query.mockResolvedValueOnce({ rows: [] });

    const event = {
      body: JSON.stringify({ cpf: '12345678900', email: 'teste@example.com' }),
    };

    const result = await autenticar(event);

    expect(result.statusCode).toBe(401);
    expect(JSON.parse(result.body).message).toBe('Usuário não encontrado');
  });

  it('deve retornar 200 se a autenticação for bem-sucedida', async () => {
    client.connect.mockResolvedValueOnce();
    client.query.mockResolvedValueOnce({ rows: [{ cpf: '12345678900', email: 'teste@example.com' }] });

    const event = {
      body: JSON.stringify({ cpf: '12345678900', email: 'teste@example.com' }),
    };

    const result = await autenticar(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).message).toBe('Autenticação bem-sucedida');
  });

  it('deve retornar 500 em caso de erro no banco de dados', async () => {
    client.connect.mockRejectedValueOnce(new Error('Erro ao conectar ao banco de dados'));

    const event = {
      body: JSON.stringify({ cpf: '12345678900', email: 'teste@example.com' }),
    };

    const result = await autenticar(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).message).toBe('Erro interno do servidor');
  });
});