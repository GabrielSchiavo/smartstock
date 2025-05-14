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
  - `Visualização:` os relatórios ssão gerados dentro do sistema, onde é posível visualizar relatórios já emitidos ou gerar novos.
  
  - `Impressão:` todos os relatórios gerados podem ser exportados como PDF para impressão.
  
  - `Tipos:` estre os principais tipos de relatórios estão:
    - Produtos que vão vencer daqui a 1 mês;
    - Produtos por data de validade;
    - Quantidade por doador;
    - Total de produtos recebidos.

- **Alertas**
  - `Notificações e pop-ups:` alertas de produtos prestes a vencer e produtos com estoque baixo.

- **Organização**
   - `Dashboard:` tela inicial em formato Dashboard, onde pode ser visualizado total de estoque, produtos próximos do vencimento e alertas.

   - `Pesquisa e filtros:` é posivel pesquisar ou filtrar por algum registro específico presente nas tabelas, facilitando a busca por registros específicos.
  
   - `Organização:` os registros são separados por grupo, onde os registros deste grupo são organizados por lote e data de validade.
  

<!-- ## :film_strip: Galeria
<p align="center">
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

`Configurando o projeto:`

1. `Baixar e atualizar dependências:` Na raiz do projeto abra um terminal e execute:
   
    - Pacotes JS:
      - Instala e atualiza pacotes para versão mais recente:
          ```bash
          npm update
          ```

      - Instala pacotes respeitaremos a versão fornecida:
          ```bash
          npm install
          ```
2. `Inicializar:` Para inicializar o projeto execute o comando a seguir:
    ```bash
    npm run dev
    ```

<!-- TODO: Organizar comandos abaixo para rodar projeto -->
npm run dev, npx prisma init, npx prisma generate, npx prisma db push, npx auth secret

crate account in resend for add API Key of resend for sending email

## :white_check_mark: Tecnologias utilizadas
* `TS`
* `Node.js - `
* `React.js - `
* `Tailwind CSS - `
* `shadcn/ui`
* `Next.js - `
* `PostgreSQL - `
* `Prisma -`
