# Calcular projeção de ganhos com a compra de ações

## Descrição

Esta funcionalidade permite aos usuários calcular a projeção de ganhos ou perdas que ocorreriam se eles tivessem comprado uma determinada quantidade de ações de uma empresa em uma data específica.

## Endpoint

`GET /stocks/`***:stockName***`/gains?purchasedAt=`***YYYY-MM-DD***`&purchasedAmount=`***Amount***

## Parâmetro da Requisição

- ***stockName*** (string): O símbolo da ação que você deseja calcular a projeção de ganhos.

## Querys Params da Requisição
- **purchasedAt** (string): A data da possível compra no formato "YYYY-MM-DD".
- **purchasedAmount** (string): O valor que seria investido em determinada ação.

### Exemplos de Requisições

- `GET /stocks/IBM/gains?purchasedAt=2023-01-01&purchasedAmount=1000`
- `GET /stocks/TSLA/gains?purchasedAt=2022-05-20&purchasedAmount=5000`
- `GET /stocks/AAPL/gains?purchasedAt=2021-09-10&purchasedAmount=34000`

## Caso de sucesso
- ✅ Busca o símbolo da ação desejada em cache.
- ✅ Valida se o símbolo da ação existe.
- ✅ Valida a data da possível compra.
- ✅ Valida o valor que seria investido.
- ✅ Calcula os ganhos ou perdas que ocorreriam se tivesse sido feito o investimento.
- ✅ Busca os dados da ação no período determinado na API (https://www.alphavantage.co).

### Resposta
- ✅ Código de status: **200 OK**
- ✅ Corpo da resposta: Um objeto JSON contendo os dados da ação no período especificado.

Exemplo:

```json
{
  "name": "IBM",
  "lastPrice": 150.50,
  "priceAtDate": 140.50,
  "purchasedAmount": 9975.50,
  "purchasedAt": "2023-01-30",
  "capitalGains": 710
}
```

## Casos de Exceção

### Respostas
- Código de status: **400 Bad Request**
  - ✅ Se o símbolo da ação for inválido.
  - ✅ Se a data da possível compra for inválida.
  - ✅ Se o valor que seria investido for inválido.
- Código de status: **404 Not Found**
  - ✅ Se o símbolo da ação não for encontrado.
  - ✅ Se não houver dados disponíveis para o período especificado.
- Código de status: **500 Internal Server Error**
  - ✅ Em caso de erro ao fazer busca do símbolo em cache.
  - ✅ Em caso de erro ao tentar conectar com a API (https://www.alphavantage.co).
  - ✅ Em caso de erro interno no servidor.