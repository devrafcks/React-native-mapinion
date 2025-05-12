# 🧠 Mapinion Backend

Backend do Mapinion: uma API feita em Node.js para registro, login, postagem e avaliação de lugares com imagens hospedadas no Cloudinary.

---

## ⚙️ Tecnologias

| Camada        | Tecnologia             |
|---------------|------------------------|
| Servidor      | Node.js + Express      |
| Banco de Dados| MongoDB + Mongoose     |
| Autenticação  | JWT                    |
| Uploads       | Cloudinary             |
| Outros        | dotenv, cors, cron     |

---

## 📁 Estrutura do Projeto

| Caminho               | Função                                         |
|------------------------|------------------------------------------------|
| `index.js`             | Ponto de entrada do servidor                  |
| `routes/`              | Rotas de autenticação e postagens             |
| `models/`              | Schemas do Mongoose para `User` e `Post`      |
| `middleware/auth.md.js`| Verificação de token JWT                      |
| `lib/cloudinary.js`    | Configuração da SDK do Cloudinary             |
| `lib/db.js`            | Conexão com o MongoDB                         |
| `lib/cron.js`          | Tarefas agendadas                             |

---

## 🔐 Autenticação

- Baseada em **JWT**.
- Token válido por **15 dias**.
- Necessário enviar o token nas rotas privadas:

---

## 🔗 Endpoints

### 🧾 Auth

| Método | Rota                 | Proteção | Função                    |
|--------|----------------------|----------|---------------------------|
| POST   | `/api/auth/register` | ❌        | Cria novo usuário         |
| POST   | `/api/auth/login`    | ❌        | Login e geração de token  |

---

### 🖼️ Posts

| Método | Rota                | Proteção | Função                                 |
|--------|---------------------|----------|----------------------------------------|
| POST   | `/api/posts`        | ✅        | Cria um novo post com imagem e nota    |
| GET    | `/api/posts`        | ✅        | Lista posts paginados de todos os usuários |
| GET    | `/api/posts/user`   | ✅        | Lista posts do usuário autenticado     |
| PUT    | `/api/posts/:id`    | ✅        | Atualiza um post                       |
| DELETE | `/api/posts/:id`    | ✅        | Deleta um post e sua imagem associada  |

---

##  Upload de Imagens

- Feito via [Cloudinary](https://cloudinary.com).
- Uploads exigem uma imagem em formato base64 no corpo da requisição.
- A imagem é armazenada na nuvem e o link é salvo no MongoDB.

---

## 📌 Observações

- Avatares gerados automaticamente com DiceBear baseado no `username`.
- Notas (rating) vão de 1 a 5.
- Todas as entradas são validadas no backend.
- Não segue padrão REST estrito (sem HATEOAS ou versionamento).

---

## 🧪 Requisitos

- Node.js v18+
- MongoDB Atlas (ou local)
- Conta no Cloudinary
- Variáveis de ambiente `.env` com:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`

---

## 🔗 Repositório do App com React Native(expo)

[github.com/devrafcks/React-native-mapinion-app](https://github.com/devrafcks/React-native_mapinion-app)

