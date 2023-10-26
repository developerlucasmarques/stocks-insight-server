# Comparar o preço atual de uma ação com outras ações

## Descrição

Esta funcionalidade permite aos usuários comparar o preço atual de uma ação com o preço de outras ações.

## Endpoint

`GET /stocks/`***:stockName***`/compare?stocksToCompare=`***stockCompare1***`,`***stockCompare2***

## Parâmetros da Requisição

- ***stockName*** (string): O símbolo da ação que você deseja comparar com outras ações.

## Query Param da Requisição
- **stocksToCompare** (string array): Os símbolos das ações que serão comparadas.
  - **stockCompare1** (string): Símbolo de uma ação a ser comparada.
  - **stockCompare2** (string): Símbolo de uma ação a ser comparada.

### Exemplos de Requisições

- `GET /stocks/IBM/compare?stocksToCompare=GOOGL,MSFT`
- `GET /stocks/TSLA/compare?stocksToCompare=GOOGL,MSFT`
- `GET /stocks/AAPL/compare?stocksToCompare=GOOGL,MSFT`

## Caso de sucesso
- ❌ Busca o símbolo das ações a comparar em cache.
- ❌ Valida se os símbolos das ações existem.
- ❌ Busca os dados das ações a comparar na API (https://www.alphavantage.co).

### Resposta
- ❌ Código de status: **200 OK**
- ❌ Corpo da resposta: Um objeto JSON contendo os dados da ação no período especificado.

Exemplo:

```json
{
  "lastPrices": [
    {
      "name": "AAPL",
      "lastPrice": 150.50,
      "pricedAt": "2023-05-30"
    },
    {
      "name": "GOOGL",
      "lastPrice": 180.99,
      "pricedAt": "2023-05-30"
    },
    {
      "name": "MSFT",
      "lastPrice": 160.22,
      "pricedAt": "2023-05-30"
    },
    // ...
  ]
}
```

## Casos de Exceção

### Respostas
- Código de status: **404 Not Found**
  - ❌ Se algum dos símbolos das ações não for encontrado.
- Código de status: **500 Internal Server Error**
  - ❌ Em caso de erro ao fazer busca dos símbolos em cache.
  - ❌ Em caso de erro ao tentar conectar com a API (https://www.alphavantage.co).
  - ❌ Em caso de erro interno no servidor.