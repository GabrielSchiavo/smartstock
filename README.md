<div align="center">
    <img width="300" src="./public/assets/images/brand/combo-mark-full.png" alt="Logo SmartStock"/>
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

- **Cadastro:**
  - `Cadastro de produtos alimentícios:` Cadastro simples de produtos com os seguintes dados: Lote; Data de Validade; Doador; Quantidade; Nome; Unidades de medida (Kg, L, G, UN...); Grupo; Subgrupo; Data de recebimento.
  
  - `Cadastro de Usuários:` Cadastro de usuários somente com: Nome, Email, Função/Área, Nível de Acesso.
  
- **Controle de Estoque:**
  - `Edição:` Edição completa de produtos cadastrados.
  
  - `Exclusão:` Exclusão de produtos cadastrados.

- **Controle de Usuários:**
    Somente o usuário administrador tem acesso ao Controle de Usuários.

  - `Edição:` Edição total de usuários, incluindo troca do nível de acesso.
  
  - `Exclusão:` Exclusão de usuários antigos.
  
- **Geração de Relatórios:**
  - `Visualização:` Os relatórios são gerados dentro do sistema, onde é possível visualizar ou gerar novos.
  
  - `Impressão:` Todos os relatórios gerados podem ser exportados como PDF ou impressos.
  
  - `Tipos:` Entre os principais tipos de relatórios estão:
    - Produtos por data de validade;
    - Produtos doados;
    - Produtos comprados;
    - Inventário de todos os produtos cadastrados.

- **Alertas:**
  - `Alertas simples:` Alerta de produtos prestes a vencer e vencidos. O sistema verifica os alertas quando o usuário abre o sistema e também verifica de forma automática a cada hora.
  
  - `Aviso:` Quando o usuário abre o sistema pela primeira vez, é disparado um aviso com o total de alertas não lidos e, quando um novo alerta é encontrado, também é disparado um aviso para o usuário.
  
  - `Lidos/Não Lidos:` Organização dos alertas em lidos e não lidos.

- **Organização:**
   - `Dashboard:` Tela inicial em formato Dashboard, onde pode ser visualizado total de estoque, produtos próximos do vencimento e alertas.

   - `Pesquisa e filtros:` É possível pesquisar ou filtrar por algum registro específico presente nas tabelas, facilitando a busca por registros específicos.
  
   - `Separação:` Os registros são separados por grupo, onde os registros deste grupo são organizados por lote e data de validade.
  
- **Dispositivos Móveis:**
   - `Otimização:` O sistema é totalmente otimizado para permitir uso em dispositivos móveis.
  

## 🎞️ Galeria
<div align="center">
  <img width="1000" src="./public/assets/images/screenshots/doc/screenshot-dashboard.png" alt="Screenshot Dashboard"/>
  <img width="1000" src="./public/assets/images/screenshots/doc/screenshot-stock.png" alt="Screenshot Tabela Estoque"/>
  <img width="1000" src="./public/assets/images/screenshots/doc/screenshot-cadastre.png" alt="Screenshot Cadastro"/>
  <img width="1000" src="./public/assets/images/screenshots/doc/screenshot-receiver.png" alt="Screenshot Relatórios"/>
</div>

## ⚙️ Setup e Configuração
### ⚠️ Pré-requisitos:

- **Node.js** >= 22.17.0
- **Docker**
- **Docker Compose**

### 🔧 Setup:

1. `Instalar e atualizar dependências:`
      - Instalar e atualizar pacotes:
          ```bash
          npm update
          ```

      - Instalar pacotes respeitando a versão fornecida:
          ```bash
          npm install
          ```

2. `Configurar Banco de Dados:`
    ```bash
      docker-compose up -d
    ```

3. `Configurar as variáveis de ambiente:` renomeie o arquivo `.env.example` para `.env` e garanta que o arquivo contenha esta variável:
    ```env
      DATABASE_URL="postgresql://root:12345@localhost:5432/smartstock?schema=public"
    ```

4. `Configurar Auth.js:`
    ```bash
      npx auth secret
    ```

    - Será gerado um arquivo `.env.local` com a variável `AUTH_SECRET`, copie toda a variável e substitua `AUTH_SECRET` no arquivo `.env`, após exclua o arquivo `.env.local`:

5. `Configura o Prisma Client:` 
   - Gera o Prisma Client:
      ```bash
        npx prisma generate
      ```

   - Executa as migrations no Banco de Dados:
      ```bash
        npx prisma migrate deploy
      ```

6. `Configurar geração e envio de email:`
   
   - Para `DESENVOLVIMENTO`: acesse `https://ethereal.email/create` para criar uma conta e gerar as credenciais de teste, altere as variáveis `ETHEREAL_USERNAME` e `ETHEREAL_PASSWORD` no arquivo `.env`. Agora com estas credenciais é possível acessar sua conta Ethereal.
  
   - Para `PRODUÇÃO`: 
  
     - Usando `GMAIL`: acesse o arquivo `.env` e altere `GMAIL_SMTP_USER` e `GMAIL_SMTP_PASS` para as credenciais da sua conta do Google (é necessário criar uma 'Senha de App').
  
     - Usando `OUTRO PROVEDOR`: para usar outro provedor SMTP consulte a documentação do `NODEMAILER` e altere as configurações do mesmo em `lib/mail.ts`.
  
   - `Remetente dos emails:` A variável `MAIL_FROM` (definida no arquivo .env) especifica o endereço que aparecerá como remetente em todos os envios.
     - Se você atribuir um valor a MAIL_FROM, esse será usado como remetente.

     - Se MAIL_FROM não for definida, o remetente padrão será o usuário SMTP configurado (valor de GMAIL_SMTP_USER ou ETHEREAL_USERNAME).

7.  `Executar o projeto:`
    ```bash
      npm run dev
    ```

## ⚡ Scripts Disponíveis
- `npm run dev` - Executa o servidor em modo de desenvolvimento com Turbopack
- `npm run build` - Compila o projeto para produção
- `npm run start` - Inicia o servidor em modo de produção
- `npm run lint` - Executa o linter ESLint
- `npm run type-check` - Executa a verificação de tipos TypeScript em modo watch
- `npx prisma generate` - Gera o Prisma Client
- `npx prisma migrate deploy` - Executa as migrations já criadas ou as pendentes
- `npx prisma migrate dev` - Cria e executa uma nova migration
- `npx prisma migrate status` - Verifica quais migrations foram aplicadas no banco atual
- `npx prisma migrate reset` - Reseta o banco e aplica todas as migrations

## ✅ Tecnologias Utilizadas
* `TypeScript`
* `Node.js - 22.17.0`
* `React.js - 19.1.0`
* `Next.js - 15.4.6`
* `PostgreSQL - 17.5`
* `Prisma - 6.9.0`
* `Auth.js - 5.0.0`
* `Nodemailer - 6.10.1`
* `jsPDF - 3.0.1`
* `Zod`
* `Tailwind CSS - 4.1`
* `shadcn/ui`