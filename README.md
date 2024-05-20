# Task Management API
The Task Management API is a simple RESTful API for managing tasks. It includes features such as user authentication, CRUD operations for tasks, data persistence using PostgreSQL, and input validation with Zod.

## Features
- User Authentication with JWT
- CRUD operations for tasks
- Input validation using Zod
- Data persistence with PostgreSQL
- Comprehensive API documentation with Swagger
## Project structure
```bash
src
 ┣ auth
 ┃ ┣ dto
 ┃ ┃ ┣ index.ts
 ┃ ┃ ┣ login.dto.ts
 ┃ ┃ ┗ register.dto.ts
 ┃ ┣ auth.controller.spec.ts
 ┃ ┣ auth.controller.ts
 ┃ ┣ auth.module.ts
 ┃ ┣ auth.service.spec.ts
 ┃ ┣ auth.service.ts
 ┃ ┗ jwt.guard.ts
 ┣ db
 ┃ ┣ database.module.ts
 ┃ ┗ queries.ts
 ┣ tasks
 ┃ ┣ dto
 ┃ ┃ ┣ create-task.dto.ts
 ┃ ┃ ┣ index.ts
 ┃ ┃ ┗ update-task.dto.ts
 ┃ ┣ tasks.controller.spec.ts
 ┃ ┣ tasks.controller.ts
 ┃ ┣ tasks.gateway.ts
 ┃ ┣ tasks.module.ts
 ┃ ┣ tasks.service.spec.ts
 ┃ ┗ tasks.service.ts
 ┣ users
 ┃ ┣ users.controller.spec.ts
 ┃ ┣ users.controller.ts
 ┃ ┣ users.module.ts
 ┃ ┣ users.service.spec.ts
 ┃ ┗ users.service.ts
 ┣ app.controller.spec.ts
 ┣ app.controller.ts
 ┣ app.module.ts
 ┣ app.service.ts
 ┣ main.ts
 ┣ types.d.ts
 ┗ zod-validation.pipe.ts

```

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

```

## Documentation
1. Start your server:
```
pnpm run dev
```
2. Navigate to http://localhost:3000/api/docs to view the generated Swagger documentation.


## Design flow

![](./diagrams/data-flow.png)
