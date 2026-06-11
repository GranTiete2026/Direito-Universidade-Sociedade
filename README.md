# Universidade e Sociedade — Plataforma Digital para Ampliação do Acesso à Justiça

Versão convertida para hospedagem gratuita com:

- **React + Vite** no frontend;
- **Supabase** para banco PostgreSQL, autenticação e APIs automáticas;
- **Cloudflare Pages, Netlify ou Vercel** para hospedagem estática;
- Área pública e área administrativa completas.

A versão anterior em .NET 10 + MySQL pode ser mantida como cópia de segurança. Esta versão foi pensada para reduzir custo de hospedagem e eliminar a necessidade de manter servidor próprio.

---

## 1. O que foi convertido

A aplicação deixa de ter backend próprio em .NET e passa a usar diretamente o Supabase pelo navegador.

### Site público

- Página inicial moderna com as cores azul e laranja/dourado da identidade visual.
- Imagem de referência desenvolvida pelos alunos na home e na página Sobre.
- Conteúdos jurídicos por área.
- Página de detalhe de conteúdo jurídico.
- Busca de advogados.
- Órgãos e serviços úteis.
- Eventos jurídicos e acadêmicos.
- Banco de estágios.
- Formulário de contato.

### Área administrativa

- Login com Supabase Auth.
- Controle de acesso por tabela `admin_profiles`.
- Painel administrativo.
- Gerenciamento de:
  - configurações da plataforma;
  - áreas jurídicas;
  - conteúdos jurídicos;
  - advogados;
  - órgãos e serviços;
  - estágios;
  - eventos;
  - mensagens recebidas.

---

## 2. Estrutura do projeto

```txt
GranTieteAcessoJusticaSupabase/
├── public/
│   ├── images/
│   │   └── referencia-alunos.jpeg
│   └── _redirects
├── src/
│   ├── admin/
│   ├── components/
│   ├── lib/
│   ├── pages/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── supabase/
│   └── schema.sql
├── .env.example
├── package.json
├── vercel.json
└── README.md
```

---

## 3. Requisitos

Instale na máquina local:

- Node.js 20 ou superior;
- npm;
- uma conta no Supabase;
- uma conta em Cloudflare Pages, Netlify ou Vercel para publicação.

---

## 4. Criar o projeto no Supabase

1. Acesse o Supabase.
2. Crie um novo projeto.
3. Escolha uma senha forte para o banco.
4. Aguarde a criação do projeto.
5. No menu lateral, acesse **SQL Editor**.
6. Clique em **New query**.
7. Copie todo o conteúdo do arquivo:

```txt
supabase/schema.sql
```

8. Cole no editor SQL do Supabase.
9. Execute o script.

Esse script cria:

- tabelas;
- índices;
- função de verificação de administrador;
- políticas de segurança RLS;
- dados iniciais da plataforma.

---

## 5. Criar o primeiro administrador

A área administrativa usa o **Supabase Auth**. Portanto, não existe mais senha fixa gravada no código.

### 5.1 Criar o usuário

No painel do Supabase:

1. Acesse **Authentication**.
2. Entre em **Users**.
3. Clique em **Add user**.
4. Crie um usuário, por exemplo:

```txt
E-mail: 
Senha: 
```

Para ambiente de teste, você pode marcar o usuário como confirmado ou desativar temporariamente a confirmação de e-mail nas configurações de autenticação.

### 5.2 Liberar o usuário como administrador

Depois de criar o usuário, volte em **SQL Editor** e execute:

```sql
insert into public.admin_profiles (id, name, role, is_active)
select id, 'Administrador', 'Administrador', true
from auth.users
where email = 'admin@grantiete.edu.br'
on conflict (id) do update
set name = excluded.name,
    role = excluded.role,
    is_active = true;
```

Troque o e-mail caso tenha usado outro usuário.

---

## 6. Obter as chaves do Supabase

No painel do Supabase:

1. Acesse **Project Settings**.
2. Entre em **API**.
3. Copie:
   - **Project URL**;
   - **anon public key**.

Esses dados serão usados no arquivo `.env.local`.

---

## 7. Configurar o projeto local

Na pasta do projeto, crie uma cópia do arquivo de exemplo:

```bash
cp .env.example .env.local
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Edite o arquivo `.env.local`:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLICA
```

Importante: a chave `anon public` pode ficar no frontend. A segurança do sistema é feita pelas políticas RLS criadas no banco.

---

## 8. Executar localmente

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm run dev
```

Acesse o endereço exibido no terminal, normalmente:

```txt
http://localhost:5173
```

Área administrativa:

```txt
http://localhost:5173/admin/login
```

---

## 9. Teste essencial antes da publicação

Antes de publicar, teste:

1. A página inicial carrega sem erro.
2. Os conteúdos jurídicos aparecem.
3. O formulário de contato salva mensagem.
4. O login administrativo funciona.
5. A área administrativa permite cadastrar um conteúdo.
6. O conteúdo cadastrado aparece no site público quando estiver publicado.
7. Um conteúdo despublicado não aparece para o público.
8. Uma área, serviço, evento, advogado ou estágio inativo não aparece no site público.

---

## 10. Gerar versão de produção

Execute:

```bash
npm run build
```

A pasta de publicação será criada em:

```txt
dist/
```

Para testar localmente a versão final:

```bash
npm run preview
```

---

## 11. Hospedar gratuitamente na Cloudflare Pages

Esta é a opção recomendada.

### 11.1 Enviar o projeto para GitHub

Crie um repositório no GitHub e envie os arquivos do projeto.

Exemplo:

```bash
git init
git add .
git commit -m "Versão Supabase da plataforma Universidade e Sociedade"
git branch -M main
git remote add origin URL_DO_REPOSITORIO
git push -u origin main
```

### 11.2 Criar o site na Cloudflare Pages

1. Acesse a Cloudflare.
2. Vá em **Workers & Pages**.
3. Clique em **Create application**.
4. Escolha **Pages**.
5. Conecte ao GitHub.
6. Selecione o repositório.
7. Configure:

```txt
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Root directory: deixe vazio, se o projeto estiver na raiz
```

### 11.3 Configurar variáveis de ambiente na Cloudflare

Em **Settings > Environment variables**, adicione:

```txt
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Use os mesmos valores do `.env.local`.

Depois, faça um novo deploy.

---

## 12. Hospedar na Netlify

1. Envie o projeto para o GitHub.
2. Acesse a Netlify.
3. Clique em **Add new site**.
4. Escolha **Import an existing project**.
5. Selecione o repositório.
6. Configure:

```txt
Build command: npm run build
Publish directory: dist
```

7. Em **Environment variables**, cadastre:

```txt
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

O arquivo `public/_redirects` já está incluído para permitir que rotas como `/admin/login` funcionem ao atualizar a página.

---

## 13. Hospedar na Vercel

1. Envie o projeto para o GitHub.
2. Acesse a Vercel.
3. Clique em **Add New Project**.
4. Importe o repositório.
5. Configure:

```txt
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

6. Adicione as variáveis:

```txt
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

O arquivo `vercel.json` já está incluído para redirecionar as rotas internas para o React.

---

## 14. Segurança configurada

O banco usa RLS, ou seja, cada tabela possui regras de acesso.

### Visitante não logado pode:

- visualizar configurações públicas;
- visualizar áreas ativas;
- visualizar conteúdos publicados;
- visualizar advogados ativos;
- visualizar eventos ativos;
- visualizar estágios ativos;
- visualizar serviços ativos;
- enviar mensagem de contato.

### Administrador pode:

- cadastrar, editar e excluir dados;
- visualizar mensagens;
- marcar mensagens como lidas;
- gerenciar conteúdos publicados ou ocultos.

### Visitante não pode:

- acessar mensagens recebidas;
- criar conteúdos;
- editar dados;
- excluir registros;
- acessar registros inativos ou despublicados.

---

## 15. Como adicionar novos administradores

1. Crie o usuário no Supabase Auth.
2. Execute o SQL abaixo trocando o e-mail:

```sql
insert into public.admin_profiles (id, name, role, is_active)
select id, 'Nome do Administrador', 'Administrador', true
from auth.users
where email = 'email@exemplo.com'
on conflict (id) do update
set name = excluded.name,
    role = excluded.role,
    is_active = true;
```

Para bloquear um administrador:

```sql
update public.admin_profiles
set is_active = false
where id in (
  select id from auth.users where email = 'email@exemplo.com'
);
```

---

## 16. Observações importantes

### 16.1 Dados jurídicos

Os textos iniciais são apenas exemplos informativos. Antes da publicação oficial, recomenda-se revisão por professor responsável, coordenação do curso ou profissional habilitado.

### 16.2 Formulário de contato

O formulário registra mensagens na tabela `contact_messages`. Ele não deve ser tratado como consulta jurídica automática.

### 16.3 Imagens

A imagem enviada pelos alunos está em:

```txt
public/images/referencia-alunos.jpeg
```

Para trocar a imagem, substitua esse arquivo mantendo o mesmo nome, ou altere as referências nos componentes `Home.jsx` e `About.jsx`.

### 16.4 Custo

Dentro dos limites gratuitos das plataformas, esta versão pode funcionar sem mensalidade. O custo provável será apenas domínio próprio, caso a faculdade decida usar um endereço personalizado.

---

## 17. Problemas comuns

### Tela branca ao abrir o site

Verifique se as variáveis foram configuradas corretamente:

```txt
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Depois reinicie o servidor local ou refaça o deploy.

### Login funciona, mas volta para a tela de login

O usuário existe no Supabase Auth, mas provavelmente não foi inserido na tabela `admin_profiles`.

Execute novamente:

```sql
insert into public.admin_profiles (id, name, role, is_active)
select id, 'Administrador', 'Administrador', true
from auth.users
where email = 'admin@grantiete.edu.br'
on conflict (id) do update
set name = excluded.name,
    role = excluded.role,
    is_active = true;
```

### Erro de permissão ao salvar dados

Confirme se:

1. o usuário está logado;
2. o usuário está em `admin_profiles`;
3. `is_active` está como `true`;
4. o script `supabase/schema.sql` foi executado por completo.

### Rotas funcionam localmente, mas não no site publicado

Confirme se:

- na Cloudflare/Netlify, o arquivo `public/_redirects` foi publicado;
- na Vercel, o arquivo `vercel.json` está no repositório.

---

## 18. Próximas melhorias sugeridas

- Cadastro de imagens para conteúdos via Supabase Storage.
- Campo para anexar cartilhas em PDF.
- Filtros avançados por cidade e especialidade na busca de advogados.
- Página específica para parceiros institucionais.
- Trilhas educativas de direitos fundamentais.
- Dashboard com estatísticas de mensagens e conteúdos mais acessados.
- Auditoria de alterações administrativas.
