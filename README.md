# 🎭 Event Management System API

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

*Scalable backend API for cultural event management with advanced features*

</div>

## 📖 Description

A robust backend API system built with NestJS and TypeScript for managing cultural events. The system provides
comprehensive REST API endpoints for event management, user authentication, and data processing with modern development
practices and containerized deployment.

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

- **Framework**: NestJS 11.0.10
- **Language**: TypeScript 5.1.3
- **Runtime**: Node.js 18+
- **Database ORM**: Prisma 6.4.1
- **Web Server**: Fastify
- **Validation**: Zod 3.24.2
- **Documentation**: Swagger/OpenAPI

### Database & Infrastructure

- **Database**: PostgreSQL with Bitnami image
- **Cache & Sessions**: Redis
- **Containerization**: Docker & Docker Compose
- **Static Files**: Local file system with volume mounting
- **Package Manager**: Yarn

### Development Tools

- **Testing**: Jest 29.5.0
- **Linting**: ESLint 9.21.0 with TypeScript support
- **Code Quality**: Prettier, Husky, Commitlint
- **Build**: TypeScript compiler, ts-node

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Yarn package manager

### 1. Clone Repository

```aiignore
git clone ssh://git@gitverse.ru:2222/studentlabs/theater_platform_backend.git cd theater_platform_backend
```

### 2. Environment Setup

Set up the following environment variables:

```aiignore
export DATABASE_TYPE="postgres"
export DATABASE_HOST="localhost"
export DATABASE_PORT="5432"
export DATABASE_USERNAME="postgres"
export DATABASE_NAME="pure"
export DATABASE_PASSWORD="12345678"
export PGDATA="/data/pg-data"
export BACKEND_PORT="3000"


export DATABASE_URL="${DATABASE_TYPE}://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}"

export SESSION_SECRET="qweqwewqewqeqwqweqweqweqweqweqweqweqweqweqweqweqweqweqweqweqweqweqweqweqweqweqweqweeqewwqeqewqweqweqweqweqweqweqweqweqweqweqweqweqweqweqweqweqweqweqweqwewqeqweqwqwe"

export REDIS_PORT="6379"
export SESSION_FOLDER="user-session"
export REDIS_URI="redis://redis:6379"


export IMAGE_TAG="main"
export REDIS_IMAGE=""
export NESTAPI_IMAGE=""
export PG_IMAGE="bitnami/postgresql"
export IMAGE_TAG_PG="latest"
```

### 3. Docker Deployment

#### Start All Services

```aiignore
docker-compose up -d
```
