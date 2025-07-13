# 🎭 Event Management System API

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

**Scalable backend API for cultural event management with advanced features**

</div>

## 📖 Description

A robust backend API system built with NestJS and TypeScript for managing cultural events. The system provides comprehensive REST API endpoints for event management, user authentication, and data processing with modern development practices and containerized deployment.

## ✨ Core Features

- **REST API** with comprehensive endpoints
- **Authentication & Authorization** with session management
- **File Upload & Management** for event media
- **Database Management** with Prisma ORM
- **API Documentation** with Swagger/OpenAPI
- **Containerized Deployment** with Docker
- **Redis Session Storage** for scalability
- **Static File Serving** for media content

## 🏗️ Architecture & Technologies

### Backend Stack
- **Framework:** NestJS 11.0.10
- **Language:** TypeScript 5.1.3
- **Runtime:** Node.js 18+
- **Database ORM:** Prisma 6.4.1
- **Web Server:** Fastify
- **Validation:** Zod 3.24.2
- **Documentation:** Swagger/OpenAPI

### Database & Infrastructure
- **Database:** PostgreSQL
- **Cache & Sessions:** Redis
- **Containerization:** Docker & Docker Compose
- **Static Files:** Local file system
- **Package Manager:** Yarn

### Development Tools
- **Testing:** Jest 29.5.0
- **Linting:** ESLint 9.21.0 with TypeScript support
- **Code Quality:** Prettier, Husky, Commitlint
- **Build:** TypeScript compiler, ts-node

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Yarn package manager
- PostgreSQL database
- Redis server (for session storage)
- (Optional) Docker & Docker Compose for containerized deployment

### 1. Clone Repository
```aiignore
bash git clone ssh://git@gitverse.ru:2222/studentlabs/theater_platform_backend.git cd theater_platform_backen
cd theater_platform_backend
```

### 2. Environment Setup
Create a `.envrc` file based on the example: and execute `direnv allow`

```
export DATABASE_TYPE="postgres"
export DATABASE_HOST="localhost"
export DATABASE_PORT="5432"
export DATABASE_USERNAME="postgres"
export DATABASE_NAME="pure"
export DATABASE_PASSWORD="your_password"
export PGDATA="/data/pg-data"
export BACKEND_PORT="3000"

export DATABASE_URL="postgresql://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}"

export SESSION_SECRET="your_secure_session_secret"

export REDIS_PORT="6379"
export SESSION_FOLDER="user-session"
export REDIS_URI="redis://localhost:6379"


export MULTIPART_FILE_SIZE="104857600"
export MULTIPART_FIELD_SIZE="2097152"
export MULTIPART_PARTS="100"
export MULTIPART_FILES="5"
export MULTIPART_FIELD_NAME_SIZE="1000"

export SESSION_COOKIE_SAME_SITE="lax"
export SESSION_COOKIE_HTTP_ONLY="true"
export SESSION_COOKIE_SECURE="false"
export SESSION_COOKIE_MAX_AGE=""
export CONNECTION_TIMEOUT="300000"
export BODY_LIMIT="104857600"

```
### 3. Installation
Install dependencies:

```bash
yarn install
```

### 4. Database Setup

```
yarn prisma migrate dev
yarn prisma generate
```


### 5. Running the Application
   Start the development server:

```aiignore
yarn start:dev
```

## 🐳 Docker Deployment (Alternative)
If you prefer containerized deployment:
``` bash
docker-compose up -d
```
This will start:
- **PostgreSQL database** - Primary data storage
- **Redis server** - Session management and caching
- **NestJS application** - Main API server

## 🛠️ Development Commands

| Command | Description |
| --- | --- |
| `yarn build` | Compile TypeScript to JavaScript |
| `yarn start` | Run production server |
| `yarn start:dev` | Run development server with hot reload |
| `yarn test` | Run unit tests |
| `yarn test:e2e` | Run end-to-end tests |
| `yarn test:cov` | Run tests with coverage |
| `yarn lint` | Run linter |
| `yarn format` | Format code with Prettier |
| `yarn prisma studio` | Launch Prisma Studio for database management |
### Quick Development Workflow
``` bash
# Development with hot reload
yarn start:dev

# Run tests
yarn test

# Check code quality
yarn lint && yarn format

# Database management
yarn prisma studio
```

