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

## Services

| Service        | URL                   |
|----------------|----------------------|
| Frontend       | [http://localhost:5173](http://localhost:5173) |
| Supabase API   | [http://localhost:8000](http://localhost:8000) |
| Mailpit        | [http://localhost:8025](http://localhost:8025) |

---
