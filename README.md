<p align="center">
    <img width="300" src="./public/assets/images/logos/smartstock-logo-4.png" alt="Logo SmartStock"/>
</p>

<h1 align="center">
    SmartStock - Gestão de Estoque
</h1>

<p align="center">
    <img src="https://img.shields.io/badge/Status-Conclu%C3%ADdo-brightgreen?style=for-the-badge"/>
    <!-- <img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-orange?style=for-the-badge"/> -->
    <img src="https://img.shields.io/github/license/GabrielSchiavo/smartstock?color=blue&style=for-the-badge"/>
</p>

<p align="center">
    SmartStock é um sistema web com o principal objetivo de controlar de forma eficiente o estoque de produtos, principalmente produtos alimentícios.
</p>

## :hammer: Funcionalidades
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
  

## :film_strip: Galeria
<p align="center">
  <img width="1000" src="./public/assets/images/screenshots/screenshot-2.png" alt="Screenshot Dashboard"/>
  <img width="1000" src="./public/assets/images/screenshots/screenshot-3.png" alt="Screenshot Tabela Estoque"/>
  <img width="1000" src="./public/assets/images/screenshots/screenshot-4.png" alt="Screenshot Cadastro"/>
  <img width="1000" src="./public/assets/images/screenshots/screenshot-5.png" alt="Screenshot Relatórios"/>
</p>

## :file_folder: Acesso ao projeto
Você pode [acessar o código-fonte do projeto](https://github.com/GabrielSchiavo/smartstock) ou [baixá-lo](https://github.com/GabrielSchiavo/smartstock/archive/refs/heads/main.zip).

## 	:hammer_and_wrench: Abrir e rodar o projeto
Após baixar o projeto, deve verificar se possui os seguintes requisitos:

* Node.js >=22.17.0
* PostgreSQL >=17.5

`Configurando o projeto:`

1. `Baixar e atualizar dependências:` Na raiz do projeto, abra um terminal e execute:
   
    - Pacotes JS:
      - Instala e atualiza pacotes para versão mais recente:
  
          ```bash
          npm update
          ```

      - Instala pacotes respeitando a versão fornecida:
  
          ```bash
          npm install
          ```

2. `Configurar .env:` Renomeie o arquivo `.env.example` para `.env`.

3. `Configurar Banco de Dados:` Configure a URL do Banco de Dados:
   
   - No arquivo `.env` na raiz do projeto, altere as configurações da variável `DATABASE_URL` para as configurações do seu Banco de Dados.

4. `Gerar AUTH_SECRET:` Abra um terminal na raiz do projeto e execute o comando a seguir para configurar o Auth.js:
   
   - Gera um arquivo `.env.local` com a variável `AUTH_SECRET`, copie toda a variável e substitua `AUTH_SECRET` no arquivo `.env`, após exclua o arquivo `.env.local`:
  
        ```bash
        npx auth secret
        ```

4. `URL Base do sistema:` Configure a URL base do sistema:
   
   - No arquivo `.env` altere a variável `BASE_URL` caso use uma URL personalizada. Caso deixe a variável em branco, será usada por padrão esta URL: "http://localhost:3000".

5. `Configura o Prisma Client:` Na raiz do projeto e execute os comandos a seguir. Sempre que alterar o arquivo `schema.prisma` execute novamente estes comandos:

   - Analisa o arquivo `schema.prisma` e gera o Prisma Client:
  
        ```bash
        npx prisma generate
        ```

   - Sincroniza o `schema.prisma` com o banco de dados:
  
        ```bash
        npx prisma db push
        ```

6. `Configurar geração e envio de email:` Para o envio de email, é necessário configurar:
   
   - Para `DESENVOLVIMENTO`: acesse `https://ethereal.email/create` para criar uma conta e gerar as credenciais de teste, altere as variáveis `ETHEREAL_USERNAME` e `ETHEREAL_PASSWORD` no arquivo `.env`. Agora com estas credenciais é possível acessar sua conta Ethereal.
  
   - Para `PRODUÇÃO`: 
  
     - Usando `GMAIL`: acesse o arquivo `.env` e altere `GMAIL_SMTP_USER` e `GMAIL_SMTP_PASS` para as credenciais da sua conta do Google (é necessário criar uma 'Senha de App').
  
     - Usando `OUTRO PROVEDOR`: para usar outro provedor SMTP consulte a documentação do `NODEMAILER` e altere as configurações do mesmo em `lib/mail.ts`.
  
   - `Remetente dos emails:` A variável `MAIL_FROM` (definida no arquivo .env) especifica o endereço que aparecerá como remetente em todos os envios.
     - Se você atribuir um valor a MAIL_FROM, esse será usado como remetente.

     - Se MAIL_FROM não for definida, o remetente padrão será o usuário SMTP configurado (valor de GMAIL_SMTP_USER ou ETHEREAL_USERNAME).

7. `TypeScript Type Check:` Executa um script de verificação de tipo para verificar a segurança do tipo sem compilar o código:

    ```bash
    npm run type-check 
    ```

8. `Inicializar:` Para inicializar o projeto, execute o comando a seguir:
   
    ```bash
    npm run dev
    ```

## :white_check_mark: Tecnologias utilizadas
* `TypeScript`
* `Node.js - 22.17.0`
* `React.js - 19.1.0`
* `Next.js - 15.3.3`
* `PostgreSQL - 17.5`
* `Prisma - 6.9.0`
* `Auth.js - 5.0.0`
* `Nodemailer - 6.10.1`
* `Tailwind CSS - 4.1.10`
* `shadcn/ui`
