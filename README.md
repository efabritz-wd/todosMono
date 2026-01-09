# Simple ToDo List - React App

A simple **ToDo List** application built with **React**. This project demonstrates a modern frontend setup with a **DevContainer**, Docker-based development, and a **BaaS** backend using **Supabase**. 

The project is organized in a **monorepository** with an orchestrating `docker-compose.yml` file, extending the Supabase service configuration.

---

## Features

- React frontend with DevContainer setup for consistent development environment
- Backend powered by **Supabase** (self-hosted)
- Local email testing with **Mailpit** container
- Monorepo structure for orchestration
- Development workflow using **docker-compose**

---

## Repository Structure
```
project-root
│
├─ /frontend # React app
│ └─ .devcontainer # VS Code DevContainer setup with Dockerfile
│
├─ /supabase # Self-hosted Supabase setup
│ └─ docker-compose.yml
│
└─ docker-compose.yml # Orchestrates frontend, Supabase, and Mailpit
```

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/) installed and running.
- [Node.js](https://nodejs.org/) (optional if using DevContainers).

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd todos-mono
   ```

2. **Set up environment variables:**
   Copy the example environment files to their active locations:
   ```bash
   # For the frontend
   cp frontend/.env.example frontend/.env

   # For the Supabase backend
   cp supabase/docker/.env.example supabase/docker/.env
   ```

3. **Start the services:**
   Run the following command in the project root:
   ```bash
   docker-compose up -d
   ```
   This will start the Supabase backend, the frontend application, and the Mailpit service.

4. **Access the application:**
   - **Frontend:** [http://localhost:5173](http://localhost:5173)
   - **Supabase Dashboard:** [http://localhost:8000](http://localhost:8000)
   - **Mailpit:** [http://localhost:8025](http://localhost:8025)

## Troubleshooting

- **Port in use:** Ensure that ports `5173`, `8000`, `8025`, and `5432` are not being used by other applications.
- **Docker Compose:** Make sure you are using a recent version of Docker Compose (v2+).
