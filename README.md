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
- **Media dataloader** for cards
- **Database Management** with Prisma ORM
- **API Documentation** with Swagger/OpenAPI
- **Containerized Deployment** with Docker
- **Redis Session Storage** for scalability
- **Static File Serving** for media content

## 🏗️ Architecture & Technologies

### Backend Stack
- **Framework:** NestJS
- **Language:** TypeScript
- **Runtime:** Node.js
- **Database ORM:** Prisma
- **Web Server:** Fastify
- **Validation:** Zod
- **Documentation:** Swagger/OpenAPI

### Database & Infrastructure
- **Database:** PostgreSQL
- **Cache & Sessions:** Redis
- **Containerization:** Docker & Docker Compose
- **Static Files:** Local file system
- **Package Manager:** Yarn

### Development Tools
- **Testing:** Jest
- **Linting:** ESLint 9.21.0 with TypeScript support
- **Code Quality:** Prettier, Husky, Commitlint, Stylelint
- **Build:** nest js

## 🚀 Quick Start

### Prerequisites
- Installed direnv
- Node.js 18+
- Yarn package manager
- PostgreSQL database
- Redis server (for session storage)
- (Optional) Docker & Docker Compose for containerized deployment

```aiignore
sudo apt install direnv -y
sudo zypper install direnv
sudo pacman -Syu direnv
sudo dnf install direnv
sudo yum install direnv
```

### 1. Clone Repository
```aiignore
bash git clone ssh://git@gitverse.ru:2222/studentlabs/theater_platform_backend.git cd theater_platform_backen
cd theater_platform_backend
```

### 2. Environment Setup
Create a `.envrc` file based on the example: and execute `direnv allow`

```
export DATABASE_TYPE=""
export DATABASE_HOST=""
export DATABASE_PORT=""
export DATABASE_USERNAME=""
export DATABASE_NAME=""
export DATABASE_PASSWORD=""
export PGDATA=""
export BACKEND_PORT=""

export DATABASE_URL="postgresql://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}"

export SESSION_SECRET=""

export REDIS_PORT=""
export SESSION_FOLDER=""
export REDIS_URI=""


export MULTIPART_FILE_SIZE=""
export MULTIPART_FIELD_SIZE=""
export MULTIPART_PARTS=""
export MULTIPART_FILES=""
export MULTIPART_FIELD_NAME_SIZE=""

export SESSION_COOKIE_SAME_SITE=""
export SESSION_COOKIE_HTTP_ONLY=""
export SESSION_COOKIE_SECURE=""
export SESSION_COOKIE_MAX_AGE=""
export CONNECTION_TIMEOUT=""
export BODY_LIMIT=""
export SESSION_SECRET="your_very_long_secret__at_least_32_chars_long"
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
