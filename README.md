# Stock-Insight

## Descrição

Stock Insight é um sistema backend desenvolvido em teste para uma vaga de desenvolvedor Node, onde o requisito era desenvolver uma API em Node para uma corretora de ações, permitindo investidores avaliem o desempenho de ações em vários cenários. Este backend oferece funcionalidades para obter informações sobre o preço atual, preço histórico, comparação de preços com outras ações e projeção de ganhos com a compra em uma data específica.


## Requisitos Técnicos

- Implementado em Node.js, com suporte a HTTP.
- Formato de serialização das requisições e respostas em JSON.
- Testes automatizados.
- Uso da API Alpha Vantage para obter dados de ações.
- Integração com um frontend de uma single-page application (SPA).
- Tratamento de erros, com ênfase em casos que poderiam gerar erros ou duplicidades nos dados.


## Casos de Usos Construídos

1. [Buscar cotação atual de uma ação](./docs/fetch-stock-quote.md) 
2. [Buscar preço histórico de uma ação](./docs/fetch-stock-history.md) 
3. [Comparar preço de uma ação com outras ações](./docs/fetch-stock-comparison.md)
4. [Calcular projeção de ganhos com a compra de uma ação em uma data específica](./docs/fetch-stock-gains.md)
5. [Salva todos os símbolos de ações listadas em cache](./docs/add-all-stock-symbols.md)



## Diagramas de Classes

Esses diagramas destacam as principais classes e componentes envolvidos e suas interações, tornando fácil compreender a lógica central do sistema.
Eles também mostram como as tarefas estão divididas em camadas, como a camada de **Presentation**, **Domain**, **Interactions**, **Infra** e **Main** ajudando a entender quem faz o quê.

Você pode consultá-los em [**Diagrams.drawio**](https://drive.google.com/file/d/15SF0pyGC29hgEsqEkcvuI9sPGfElF8Xt/view?usp=sharing)


## Cache de Símbolos de Ações

Ao iniciar o servidor, todos símbolos das ações cotadas são automaticamente buscados na API AlphaVantage e salvos em no Redis. Essa iniciativa visa otimizar o uso dos recursos, diminuinto o tempo de validação em caso de símbolo de ação inexistente além de economizar requisições à API AlphaVantage quando buscado símbolos de ações inválidos.

- **Inicialização do Servidor**: Ao iniciar o servidor, uma tarefa de busca é acionada para recuperar todas as ações cotadas na Nasdaq.

- **Chamada à API AlphaVantage**: A API AlphaVantage é consultada para obter uma lista completa de símbolos de ações na Nasdaq.

- **Armazenamento em Cache**: A lista de símbolos de ações obtida é armazenada no Redis.

- **Utilização nas Rotas**: Todas as rotas que exigem informações sobre ações podem validar em cache se o símbolo da ação realmente existe, eliminando a necessidade de requisições adicionais à API AlphaVantage.

### Vantagem:

- **Economia de Recursos**: Evita requisições desnecessárias à API AlphaVantage, economizando recursos e minimizando o uso da cota de chamadas à API.


### Log de Erros:

O design pattern Decorator foi utilizado para decorar Controllers, que em caso de alguma exceção, registar o erro no MongoDB. Isso envolve encapsular a execução dos controladores em uma classe decoradora que capturam e registram exceções, incluindo data, nome do erro e a stack. Essa prática melhora a confiabilidade do sistema e oferece histórico detalhado de erros para análises e melhorias.


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
- Rimraf
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

Todas depedências para rodar o projeto como Node, MongoDB e Redis estão configuradas no docker compose, então não é necessário instalar nada além de que o Docker.


## Variáveis de Ambiente

Você deverá criar um arquivo .env na raiz do projeto. Poderá usar os dados das variáveis a baixo para setar em seu arquivo:

Para conseguir sua ***ALPHA_VANTAGE_API_KEY*** acesse: [https://www.alphavantage.co/](https://www.alphavantage.co/)

Cada chave possui um limite de 25 acessos diários a Alpha Vantage, porém o IP da máquina também possui este limite. Então é necessário trocar de chave quando o chegar em 25 acessos e usar uma VPN para mudar o IP da máquina.

- Você pode usar estas chaves gratuitas:
	- R8E76FACZ1GBC7IA
	- MKV74ROUOC0OGWAL
	- 5IXWXRK9CTS3EQ8T
	- XLC9YFQ0F4RVMW8W

```m
ALPHA_VANTAGE_API_KEY=SUA_API_KEY
REDIS_PASSWORD=
REDIS_PORT=6379
REDIS_HOST=redis
SERVER_PORT=5050
SERVER_HOST=localhost
DB_PORT=27017
DB_NAME=stocks
DB_USERNAME=root
DB_PASSWORD=password
MONGO_URL=mongodb://db:27017/stocks-insight
```


## Instalação e Execução

 **Exemplo**:

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
 	npm run up
 ```
 Este comando irá criar a pasta dist com os arquivos do projeto em JavaScript, instalará as dependências, subirá os containers docker e iniciará o servidor.


## Execução de Testes

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


## Erros

Caso não consiga rodar o projeto, me contate pelo Linkedin a baixo.


## Autor

- **Lucas Marques** - Desenvolvedor - [Github](https://github.com/codedbylucas) | [Linkedin](https://www.linkedin.com/in/codedbylucas/)
 
