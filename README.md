# Stock-Insight

## Descrição
O Stock Insight é um backend desenvolvido para teste de uma vaga onde o requisito era desenvolver um sitema em Node para uma corretora de ações. Permitindo investidores avaliem o desempenho de ações em vários cenários. Este backend oferece funcionalidades para obter informações sobre o preço atual, preço histórico, comparação de preços com outras ações e projeção de ganhos com a compra em uma data específica.

## Requisitos Técnicos
- Implementado em Node.js, com suporte a HTTP.
- Formato de serialização das requisições e respostas em JSON.
- Testes automatizados.
- Uso da API Alpha Vantage para obter dados de ações.
- Integração com um frontend de uma single-page application (SPA).
- Tratamento de erros, com ênfase em casos que poderiam gerar erros ou duplicidades nos dados.

## APIs construídas

1. [Buscar cotação atual de uma ação](./docs/fetch-stock-quote.md) 
2. [Buscar preço histórico de uma ação](./docs/fetch-stock-history.md) 
3. [Comparar preço de uma ação com outras ações](./docs/fetch-stock-comparison.md)
4. [Calcular projeção de ganhos com a compra de uma ação em uma data específica](./docs/fetch-stock-gains.md)

## Diagramas de Classes

Esses diagramas destacam as principais classes e componentes envolvidos e suas interações, tornando fácil compreender a lógica central do sistema.
Eles também mostram como as tarefas estão divididas em camadas, como a camada de **Presentation**, **Domain**, **Interactions**, **Infra** e **Main** ajudando a entender quem faz o quê.

Você pode consultá-los em [**Diagrams.drawio**](https://drive.google.com/file/d/15SF0pyGC29hgEsqEkcvuI9sPGfElF8Xt/view?usp=sharing)

## Cache de Símbolos Ações da Nasdaq na API AlphaVantage

Ao iniciar o servidor, todos símbolos das ações cotadas na Nasdaq são automaticamente buscadas pela EODHD e salvas em cache. Essa iniciativa visa otimizar o uso dos recursos, economizando requisições à API AlphaVantage buscando símbolos de ações inválidos. 
*(***OBS***: Alguns símbolos não são encontrados na API EODHD, como por exemplo 'IBM', o que causa um erro de validação. Irei corrigir esse bug em breve)*

- **Inicialização do Servidor**: Ao iniciar o servidor, uma tarefa de busca é acionada para recuperar todas as ações cotadas na Nasdaq.

- **Chamada à API AlphaVantage**: A API AlphaVantage é consultada para obter uma lista completa de símbolos de ações na Nasdaq.

- **Armazenamento em Cache**: A lista de símbolos de ações obtida é armazenada no Redis.

- **Utilização nas Rotas**: Todas as rotas que exigem informações sobre ações podem validar em cache se o símbolo da ação realmente existe, eliminando a necessidade de requisições adicionais à API AlphaVantage.

### Vantagem:

- **Economia de Recursos**: Evita requisições desnecessárias à API AlphaVantage, economizando recursos e minimizando o uso da cota de chamadas à API.


## Princípios

- Single Responsibility Principle (SRP)
- Open Closed Principle (OCP)
- Liskov Substitution Principle (LSP)
- Interface Segregation Principle (ISP)
- Dependency Inversion Principle (DIP)
- Separation of Concerns (SOC)
- Don't Repeat Yourself (DRY)
- You Aren't Gonna Need It (YAGNI)
- Keep It Simple, Silly (KISS)
- Composition Over Inheritance
- Small Commits


## Design Patterns

- Factory
- Adapter
- Composite
- Decorator
- Proxy
- Dependency Injection
- Composition Root
- Builder
- Singleton


## Metodologias e Designs

- TDD
- Clean Architecture
- DDD
- Conventional Commits
- GitFlow
- Modular Design
- Dependency Diagrams
- Use Cases


## Bibliotecas e Ferramentas

- NPM
- Typescript
- Git
- Jest
- MongoDb
- Express
- Supertest
- Eslint
- Standard Javascript Style
- Sucrase
- In-Memory MongoDb Server
- Docker
- Axios
- Axios Mock Adapter
- Dotenv
- Ioredis
- Ioredis Mock
- Redis Memory Server
- Git Commit Msg Linter
- Module Alias


## Features do Node

- API Rest com Express
- Log de Erro
- CORS
- Middlewares


## Features do Git

- Alias
- Log Personalizado
- Branch
- Reset
- Tag
- Stash
- Merge


## Features do Typescript

- POO Avançado
- Interface
- TypeAlias
- Utility Types
- Modularização de Paths
- Configurações
- Build


## Features de Testes

- Testes Unitários
- Testes de Integração (API Rest)
- Cobertura de Testes
- Test Doubles
- Mocks
- Stubs
- Spies
- Fakes


## Features do MongoDb

- Connect e Reconnect
- Collections
- InsertOne
- ObjectId

## Pré-requisitos

É imprescindível que você tenha instalado em seu computador o Docker para que possa executar e testar este projeto.

- **Docker** - [https://www.docker.com/get-started/](https://www.docker.com/get-started/)

## Instalação

 Exemplo:

 Clone esse projeto em seu computador com o comando:

 ```
 	git clone [https://github.com/codedbylucas/stocks-insight.git]
 ```

 Acesse a pasta do projeto seu terminal:

 ```
 	cd [stocks-insight]
 ```

 Já pasta da aplicação em seu terminal, digite o seguinte comando:

 ```
 	docker compose up
 ```


## Execução

Após ter configurado o projeto e ter aguardado o container Docker ser criado, execute o comando:

```
 	npm start
```

Para executar todos os testes do projeto execute o comando:

 ```
 	npm test
 ```

Para executar apenas os testes unitários execute o comando:

 ```
 	npm run test:unit
 ```

Para executar apenas os testes de integração execute o comando:

 ```
 	npm run test:integration
 ```

Para visualizar a cobertura de testes do projeto execute o comando:

 ```
 	npm run test:ci
 ```


## Autor

- **Lucas Marques** - Desenvolvedor - [Github](https://github.com/codedbylucas) | [Linkedin](https://www.linkedin.com/in/codedbylucas/)
 
