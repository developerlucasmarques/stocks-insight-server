# Salvar todos os símbolos em cache

## Descrição

Esta funcionalidade permite melhorar o desempenho da aplicação e economizar recursos salvando em cache todos os símbolos de todas as ações cotadas na Nasdaq, para que quando o usuário digite um símbolo incorreto não seja gasto uma requisição na Api Alpha Vantage, tornando assim o custo do sistema menor.
Este caso de uso é executado assim que o servidor é iniciado.


## Caso de sucesso
- ✅ Busca todos os símbolos de ações na API (https://www.alphavantage.co).
- ✅ Salva todos em cache utilizando o Redis.

## Casos de Exceção

### Respostas
- Código de status: **500 Internal Server Error**
  - ✅ Em caso de erro ao fazer busca do símbolo na API (https://www.alphavantage.co).
  - ✅ Em caso de erro ao tentar salvar os símbolos em no Redis.
  - ✅ Em caso de erro interno no servidor.