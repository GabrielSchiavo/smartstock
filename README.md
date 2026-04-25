<div align="center">
    <img width="300" src="./src/assets/images/brand/combo-mark-full.png" alt="Logo SmartStock"/>
</div>

<div align="center">

# SmartStock - Gestão de Estoque

</div>

<div align="center">
    <img src="https://img.shields.io/badge/Status-Conclu%C3%ADdo-brightgreen?style=for-the-badge"/>
    <!-- <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-orange?style=for-the-badge"/> -->
    <img src="https://img.shields.io/github/license/GabrielSchiavo/smartstock?color=blue&style=for-the-badge"/>
</div>

<div align="center">

SmartStock é um sistema web com o principal objetivo de controlar de forma eficiente o estoque de produtos, principalmente produtos alimentícios.

</div>

## 🎯 Funcionalidades Principais

- **Login com RBAC:**
  - `Login:` Sistema de login com email e senha.
  - `Verificação de conta:` Envio de email para verificação de conta.
  - `Recuperação de senha:` Envio de email para recuperação de senha.
  - `Níveis de acesso:` Diferentes tipos de usuários podem acessar recursos distintos:
    - `Admin:` Acesso a todos os recursos do sistema, incluindo controle e cadastro de novos usuários.
    - `Padrão:` Acesso a cadastro e geração de relatórios.
    - `Cadastro:` Acesso somente ao cadastro de produtos.
    - `Geração:` Acesso somente a geração e visualização de relatórios.

- **Controle de Estoque:**
  - `Produto Mestre:` Cadastro mestre dos produtos com informações comuns como categoria, grupo, subgrupo e unidade de medida base.

  - `Entradas:` Cadastros de entradas dos produtos a partir de um Produto Mestre.

  - `Saídas:` Cadastro de saídas a partir do cadastro do produto com validação de estoque disponível.

  - `Ajustes:` Cadastro ajustes positivos e negativos para correção de estoque.
  - `Edição:` Edição total de produtos mestres e edição parcial de produtos.
  - `Exclusão:` Exclusão de produtos e produtos mestres.

  - `Visualização:` Os registros de produtos mestres são organizados em tabela com agrupamento por categorias. Visualização completa de todos os produtos cadastrados em uma única tabela com agrupamento por categorias.

- **Controle de Usuários:**
  - `Cadastro:` Cadastro de usuários somente com: Nome, Email, Nível de Acesso.

  - `Edição:` Edição total de usuários, incluindo troca do nível de acesso.
  - `Exclusão:` Exclusão de usuários.

- **Geração de Relatórios:**
  - `Visualização:` Os relatórios são gerados dentro do sistema, onde é possível visualizar ou gerar novos.
  - `Impressão:` Todos os relatórios gerados podem ser exportados como PDF ou impressos.
  - `Tipos:` Entre os principais tipos de relatórios estão:
    - Produtos por data de validade;
    - Produtos doados;
    - Produtos comprados;
    - Produtos por recebedor;
    - Produtos por fornecedor;
    - Inventário de todos os produtos cadastrados;
    - Entradas de todos as entradas;
    - Saídas de todos as saídas;
    - Ajustes de todos os ajustes.

- **Alertas:**
  - `Funcionamento:` O sistema verifica os alertas quando é aberto e de forma automática a 30 minutos.
  - `Controle de validades:` Alerta de produtos prestes a vencer e vencidos.
  - `Quantidade em estoque:` Alerta de produtos com estoque zerado.
  - `Aviso:` Quando o sistema pela primeira vez, é disparado um aviso com o total de alertas não lidos e, quando um novo alerta é encontrado, também é disparado um aviso.
  - `Lidos/Não Lidos:` Organização dos alertas em lidos e não lidos.

- **Sistema de Logs:**
  - `Geração de Logs:` Logs de interação do usuário com as principais partes do sistema como criação, edição e exclusão de registros.

  - `Visualização:` Painel para visualização de todos os logs gerados pelo sistema separados por Entradas, Saídas, Ajustes e Diversos.

- **Organização:**
  - `Dashboard:` Tela inicial em formato Dashboard, onde pode ser visualizado total de estoque, produtos próximos do vencimento e alertas.

  - `Pesquisa e filtros:` É possível pesquisar ou filtrar por algum registro específico presente nas tabelas, facilitando a busca por registros específicos.
  - `Separação:` Os registros são separados por grupo ou categoria, onde os registros deste grupo são organizados por lote e data de validade.

- **Dispositivos Móveis:**
  - `Otimização:` O sistema é totalmente otimizado para permitir uso em dispositivos móveis.

## 🎞️ Galeria

<div align="center">
  <img width="1000" src="./public/assets/images/screenshots/doc/login.png" alt="Screenshot Login"/>
  <img width="1000" src="./public/assets/images/screenshots/doc/dashboard.png" alt="Screenshot Dashboard"/>
  <img width="1000" src="./public/assets/images/screenshots/doc/stock.png" alt="Screenshot Tabela Estoque"/>
  <img width="1000" src="./public/assets/images/screenshots/doc/report.png" alt="Screenshot Relatórios"/>
</div>

## ⚙️ Setup e Configuração

### ⚠️ Pré-requisitos:

- **Node.js** >= 22
- **PNPM** >= 10
- **Docker**
- **Docker Compose**

### 🔧 Setup:

1.  `Instalar e atualizar dependências:`
    - Instalar e atualizar pacotes:

      ```bash
      pnpm update
      ```

    - Instalar pacotes respeitando a versão fornecida:
      ```bash
      pnpm install
      ```

2.  `Configurar as variáveis de ambiente globais:` renomeie o arquivo `.env.example` para `.env`

3.  `Configurar Banco de Dados:`
    - `Criar Banco de Dados:` execute o comando abaixo para iniciar e executar o banco de dados utilizando o Docker:
      ```bash
        docker-compose up -d
      ```
    - `Credenciais (Opcional):` caso necessite alterar as credenciais de acesso ao Banco de Dados altere esta variável no arquivo `.env`:
      ```env
        DATABASE_URL="postgresql://root:12345@localhost:5432/smartstock?schema=public"
      ```

4.  `Configurar Auth.js:`

    ```bash
      pnpm dlx auth secret
    ```

    - Será gerado um arquivo `.env.local` com a variável `AUTH_SECRET`, copie toda a variável e substitua `AUTH_SECRET` no arquivo `.env`, após exclua o arquivo `.env.local`:

5.  `Configura o Prisma Client:`
    - Gera o Prisma Client:

      ```bash
        pnpm dlx prisma generate
      ```

    - Executa as migrations no Banco de Dados:
      ```bash
        pnpm dlx prisma migrate deploy
      ```

6.  `Configurar geração e envio de email:`
    - Para `DESENVOLVIMENTO`: acesse `https://ethereal.email/create` para criar uma conta e gerar as credenciais de teste, altere as variáveis `ETHEREAL_USERNAME` e `ETHEREAL_PASSWORD` no arquivo `.env`. Agora com estas credenciais é possível acessar sua conta Ethereal.
    - Para `PRODUÇÃO`:
      - Usando `GMAIL`: acesse o arquivo `.env` e altere `GMAIL_SMTP_USER` e `GMAIL_SMTP_PASS` para as credenciais da sua conta do Google (é necessário criar uma 'Senha de App').
      - Usando `OUTRO PROVEDOR`: para usar outro provedor SMTP consulte a documentação do `NODEMAILER` e altere as configurações do mesmo em `lib/mail.ts`.

    - `Remetente dos emails:` A variável `MAIL_FROM` (definida no arquivo .env) especifica o endereço que aparecerá como remetente em todos os envios.
      - Se você atribuir um valor a MAIL_FROM, esse será usado como remetente.

      - Se MAIL_FROM não for definida, o remetente padrão será o usuário SMTP configurado (valor de GMAIL_SMTP_USER ou ETHEREAL_USERNAME).

7.  `Executar o projeto:`
    ```bash
      pnpm dev
    ```

## ⚡ Scripts Disponíveis

- `docker-compose up -d` - Cria e executa o container docker necessário
- `pnpm dev` - Executa o servidor em modo de desenvolvimento com Turbopack
- `pnpm build` - Compila o projeto para produção
- `pnpm start` - Inicia o servidor em modo de produção
- `pnpm lint` - Executa o linter ESLint
- `pnpm format:check` - Executa a verificação de formatação dos arquivos utilizando Prettier
- `pnpm format` - Executa a formatação somente de arquivos .ts e .tsx utilizando Prettier
- `pnpm format:all` - Executa a formatação de todos os arquivos utilizando Prettier
- `pnpm type-check` - Executa a verificação de tipos TypeScript em modo watch
- `pnpm prepare` - Executa manualmente as verificações do Husky
- `pnpm dlx prisma generate` - Gera o Prisma Client
- `pnpm dlx prisma migrate deploy` - Executa as migrations já criadas ou as pendentes
- `pnpm dlx prisma migrate dev` - Cria e executa uma nova migration (executar novamente sempre que alterar o schema.prisma)
- `pnpm dlx prisma migrate status` - Verifica quais migrations foram aplicadas no banco atual
- `pnpm dlx prisma migrate reset` - Reseta o banco e aplica todas as migrations

## ✅ Tecnologias Utilizadas

- `TypeScript`
- `Node.js - 24`
- `React.js - 19`
- `Next.js - 16`
- `Next.js Server Actions`
- `PostgreSQL - 18`
- `Prisma - 7`
- `Auth.js - 5`
- `Nodemailer - 8`
- `jsPDF - 3`
- `Zod - 4`
- `Tailwind CSS - 4`
- `shadcn/ui`
