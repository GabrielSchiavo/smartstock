<p align="center">
    <img width="300" src="./public/assets/images/logos/smartstock-logo-4.png" alt="Logo BookWise"/>
</p>

<h1 align="center">
    SmartStock - Gestão de Estoque
</h1>

<p align="center">
    <!-- <img src="https://img.shields.io/badge/Status-Conclu%C3%ADdo-brightgreen?style=for-the-badge"/> -->
    <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-orange?style=for-the-badge"/>
    <img src="https://img.shields.io/github/license/GabrielSchiavo/smartstock?color=blue&style=for-the-badge"/>
</p>

<p align="center">
    SmartStock é um sistema web com o principal objetivo de controlar de forma eficiente o estoque de produtos, principalmente produtos alimentícios.
</p>

## :hammer: Funcionalidades
- **Login com RBAC:**
  - `Login:` sistema de login com email e senha. 
  
  - `Níveis de acesso:` diferentes tipos de usuários podem acessar recursos distintos:
    - `Admin:` acesso a todos os recursos do sistema, incluindo controle e cadastro de novos usuários.
    - `Padrão:` acesso a cadastro e geração de relatórios.
    - `Cadastro:` acesso somente ao cadastro de produtos.
    - `Geração:` acesso somente a geração e visualização de relatórios.

- **Cadastro:**
  - `Cadastro de produtos alimentícios:` cadastro simples de produtos com os seguintes dados: Lote; Data Validade; Doador; Quantidade; Nome; Unidades de medida (Kg, L, g...); Grupo; Subgrupo; Data de recebimento.
  
  - `Cadastro de Usuários:` cadastro de usuários somente com: Nome, Email, Função/Área, Nível de Acesso.
  
- **Controle de Estoque:**
  - `Edição:` edição completa de produtos cadastrados.
  
  - `Exclusão:` exclusão de produtos cadastrados.

- **Controle de Usuários:**
    Somente o usuário administrador tem acesso ao Controle de Usuários

  - `Edição:` edição total de usuários, incluindo troca do nível de acesso.
  
  - `Exclusão:` exclusão de usuários antigos.
  
- **Geração de Relatórios**
  - `Visualização:` os relatórios ssão gerados dentro do sistema, onde é posível visualizar ou gerar novos.
  
  - `Impressão:` todos os relatórios gerados podem ser exportados como PDF ou impressos.
  
  - `Tipos:` estre os principais tipos de relatórios estão:
    - Produtos por data de validade;
    - Produtos doados ou comprados;
    - Inventário de todos os produtos cadastrados;

<!-- - **Alertas**
  - `Notificações e pop-ups:` alertas de produtos prestes a vencer e produtos com estoque baixo. -->

- **Organização**
   - `Dashboard:` tela inicial em formato Dashboard, onde pode ser visualizado total de estoque, produtos próximos do vencimento e alertas.

   - `Pesquisa e filtros:` é posivel pesquisar ou filtrar por algum registro específico presente nas tabelas, facilitando a busca por registros específicos.
  
   - `Organização:` os registros são separados por grupo, onde os registros deste grupo são organizados por lote e data de validade.
  

## :film_strip: Galeria
<!-- <p align="center">
  <img width="1000" src="./resources/assets/images/screenshots/" alt="Screenshot Dashboard"/>
  <img width="1000" src="./resources/assets/images/screenshots/" alt="Screenshot Cadastro de Livros"/>
  <img width="1000" src="./resources/assets/images/screenshots/" alt="Screenshot Acervo"/>
  <img width="250" src="./resources/assets/images/screenshots/" alt="Screenshot Dashboard Mobile"/>
</p> -->

## :file_folder: Acesso ao projeto
Você pode [acessar o código-fonte do projeto](https://github.com/GabrielSchiavo/smartstock) ou [baixá-lo](https://github.com/GabrielSchiavo/smartstock/archive/refs/heads/main.zip).

## 	:hammer_and_wrench: Abrir e rodar o projeto
Após baixar o projeto, deve verificar se possui os seguintes requisitos:

* Node.js >=22.15.0
* PostgreSQL >=17.4

`Configurando o projeto:`

1. `Baixar e atualizar dependências:` Na raiz do projeto abra um terminal e execute:
   
    - Pacotes JS:
      - Instala e atualiza pacotes para versão mais recente:
  
          ```bash
          npm update
          ```

      - Instala pacotes respeitando a versão fornecida:
  
          ```bash
          npm install
          ```

2. `Atualizar .env:` abra o arquivo `.env.example`, localizado na raiz do projeto e altere as configurações de DATABASE_URL para as configurações do seu Banco de Dados. Após, renomeie o arquivo para `.env`.

3. `Gerar AUTH_SECRET:` abra um terminal na raiz do projeto e execute o comando a seguir para configurar o Auth.js:
   
   - Gera um arquivo `.env.local` com a variável `AUTH_SECRET`, copie toda a variavel e susbtitua `AUTH_SECRET` no arquivo `.env`, após exclua o arquivo `.env.local`:
  
        ```bash
        npx auth secret
        ```

4. `Configura o Prisma Client e DB:` na raiz do projeto e execute os comandos a seguir. Sempre que alterar o arquivo `schema.prisma` execute novamente estes comandos:

   - Analisa o arquivo `schema.prisma` e gera o Prisma Client:
  
        ```bash
        npx prisma generate
        ```

   - Sincroniza o `schema.prisma` com o banco de dados:
  
        ```bash
        npx prisma db push
        ```

5. `Configurar geração e envio de email:` para o envio de email é necessário configurar:
   
   - Para `DESENVOLVIMENTO`: acesse `https://ethereal.email/create` para criar uma conta e gerar as credenciais de teste, altere as variáveis `ETHEREAL_USERNAME` e `ETHEREAL_PASSWORD` no arquivo `.env`. Agora com estas credenciais é possivel acessar sua conta Ethereal.
  
   - Para `PRODUÇÃO`: 
  
     - Usando `GMAIL`: acesse o arquivo `.env` e altere `GMAIL_SMTP_USER` e `GMAIL_SMTP_PASS` para as credenciais da sua conta do Google (é necessário criar uma 'Senha de App').
  
     - Usando `OUTRO PROVEDOR`: para usar outro provedor SMTP consulte a documentação do `NODEMAILER` e altere as configurações do mesmo em `lib/mail.ts`.

7. `TypeScript Type Check:` executa um script de verificação de tipo para verificar a segurança do tipo sem compilar o código:

    ```bash
    npm run type-check 
    ```

8. `Inicializar:` Para inicializar o projeto execute o comando a seguir:
    ```bash
    npm run dev
    ```

## :white_check_mark: Tecnologias utilizadas
* `TS`
* `Node.js - 22.15.0`
* `React.js - 19`
* `Tailwind CSS - 4.0`
* `shadcn/ui`
* `Next.js - 15.3.2`
* `PostgreSQL - 17.5`
* `Prisma - 6.7.0`
