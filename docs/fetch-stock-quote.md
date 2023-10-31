# Obter o preço atual de uma ação

## Descrição

Esta funcionalidade permite aos usuários obter o preço na data atual de uma ação cotada na Nasdaq.

## Endpoint

`GET /stock/`***:stockName***`/quote`

## Parâmetros da Requisição

- ***stockName*** (string): O símbolo da ação que você deseja obter o preço atual.

### Exemplos de Requisições

- `GET /stock/AMZD/quote`
- `GET /stock/TSLA/quote`
- `GET /stock/AAPL/quote`

## Caso de sucesso
- ✅ Busca o símbolo da ação desejada em cache.
- ✅ Valida se o símbolo da ação existe.
- ✅ Busca o valor atual da ação na API (https://www.alphavantage.co).

### Resposta
- ✅ Código de status: **200 OK**
- ✅ Corpo da resposta: Um objeto JSON contendo o preço da ação na data atual.

Exemplo:

```json
{
  "name": "AAPL",
  "lastPrice": 150.50,
  "pricedAt": "2023-05-30"
}
```

## Casos de Exceção

### Respostas
- Código de status: **400 Not Found**
  - ✅ Se o símbolo da ação for inválido.
- Código de status: **404 Not Found**
  - ✅ Se o símbolo da ação não for encontrado.
- Código de status: **500 Internal Server Error**
  - ✅ Em caso de erro ao fazer busca do símbolo em cache.
  - ✅ Em caso de erro ao tentar conectar com a API (https://www.alphavantage.co).
  - ✅ Em caso de erro interno no servidor.