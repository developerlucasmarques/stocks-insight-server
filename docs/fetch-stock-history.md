# Obter o preço histórico de uma ação

## Descrição

Esta funcionalidade permite aos usuários obter o preço histórico de uma ação financeira cotada na Nasdaq ao longo de um período específico.

## Endpoint

`GET /stocks/`***:stockName***`/history?from=`***YYYY-MM-DD***`&to=`***YYYY-MM-DD***

## Parâmetro da Requisição

- ***stockName*** (string): O símbolo da ação que você deseja obter o preço histórico.

## Querys Params da Requisição
- **from** (string): A data de início do período desejado no formato "YYYY-MM-DD".
- **to** (string): A data de término do período desejado no formato "YYYY-MM-DD".

### Exemplos de Requisições

- `GET /stocks/AMZN/history?from=2023-01-01&to=2023-01-31`
- `GET /stocks/TSLA/history?from=2023-02-20&to=2023-03-20`
- `GET /stocks/AAPL/history?from=2015-03-01&to=2023-03-01`

## Caso de sucesso
- ✅ Busca o símbolo da ação desejada em cache.
- ✅ Valida se o símbolo da ação existe.
- ✅ Valida a data de início do período desejado.
- ✅ Valida a data de término do período desejado.
- ✅ Busca os dados da ação no período determinado na API (https://www.alphavantage.co).

### Resposta
- ✅ Código de status: **200 OK**
- ✅ Corpo da resposta: Um objeto JSON contendo os dados da ação no período especificado.

Exemplo:

```json
{
  "name": "AMZN",
  "prices": [
    {
      "opening": 139.09,
      "low": 138.29,
      "high": 141.10,
      "closing": 140.50,
      "pricedAt": "2023-01-02",
      "volume": 9200
    },
    // ...
  ]
}
```

## Casos de Exceção

### Respostas
- Código de status: **400 Bad Request**
  - ✅ Se o símbolo da ação for inválido.
  - ✅ Se a data de início do período desejado for inválida.
  - ✅ Se a data de término do período desejado for inválida.
- Código de status: **404 Not Found**
  - ✅ Se o símbolo da ação não for encontrado.
  - ✅ Se não houver dados disponíveis para o período especificado.
- Código de status: **500 Internal Server Error**
  - ✅ Em caso de erro ao fazer busca do símbolo em cache.
  - ✅ Em caso de erro ao tentar conectar com a API (https://www.alphavantage.co).
  - ✅ Em caso de erro interno no servidor.
