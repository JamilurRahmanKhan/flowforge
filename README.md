# FlowForge

FlowForge is a multi-tenant SaaS project management platform built for teams and organizations to manage workspaces, projects, tasks, members, and activity in one place.

It supports workspace-based login, project-specific member access, task assignment, role-aware permissions, and responsive desktop/mobile usage.

---

## Overview

FlowForge is designed to solve a common team collaboration problem: managing projects and tasks across multiple organizations while keeping each organization’s data isolated and secure.

Instead of being a simple to-do app, FlowForge is a workspace-driven collaboration platform where:

- each organization has its own workspace
- users can belong to one or more workspaces
- projects belong to a workspace
- tasks belong to a project
- members can be assigned to specific projects
- permissions control who can view, create, update, assign, and manage

---

## Problem It Solves

Teams often struggle with:

- unclear task ownership
- poor project visibility
- scattered communication and work tracking
- permission confusion
- difficulty managing multiple organizations in one system

FlowForge solves these problems by providing:

- isolated workspaces for each organization
- project-level collaboration
- task assignment and status tracking
- member-based access control
- workspace switching
- activity visibility
- responsive user experience across devices

---

## Key Features

### Authentication and Workspace Access
- organization/workspace registration
- login with workspace slug, email, and password
- JWT-based authentication
- workspace switching for users with access to multiple workspaces
- profile and password management

### Workspace Management
- multi-tenant architecture
- workspace-based user isolation
- workspace member roles
- active workspace persistence

### Project Management
- create projects
- update project details
- archive and unarchive projects
- delete projects
- dynamic project statistics
- project overview, board, list, members, and activity tabs

### Project Membership
- assign members to a project
- remove members from a project
- view assigned members
- view available workspace members for assignment

### Task Management
- create tasks
- edit tasks
- delete tasks
- assign tasks to project members
- update task status
- track priority and due date
- view personal assigned tasks in **My Tasks**

### Activity Tracking
- project activity feed
- task and project updates
- recent actions visible in dedicated activity screens

### Permissions and Access Control
- workspace-level role checks
- project-level member checks
- task-level permission checks
- member-based visibility for projects and tasks
- friendly permission error messages

### Responsive UI
- desktop and mobile layouts
- mobile bottom navigation
- sticky sidebar
- project-specific desktop/mobile views
- clean dashboard UI

---

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React
- Vercel

### Backend
- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- Maven
- Railway

### Database
- PostgreSQL
- Neon

---

## Architecture

FlowForge follows a layered full-stack architecture.

### Frontend
The frontend handles:
- user interface
- routing
- responsive layouts
- form handling
- API communication
- token and workspace session management

### Backend
The backend handles:
- authentication
- authorization
- business logic
- validation
- database operations
- JWT generation and verification

### Database
The database stores:
- organizations
- users
- workspace memberships
- projects
- project memberships
- tasks

---

## Project Structure

### Frontend
Feature-oriented frontend structure, including modules like:

- auth
- dashboard
- projects
- tasks
- project-members
- profile
- activity
- settings

### Backend
Layered backend structure, including:

- controllers
- services
- repositories
- DTOs
- entities
- security config
- exception handling

---

## Authentication System

FlowForge uses a custom authentication system built with Spring Security and JWT.

### Login Flow
A user signs in using:
- workspace slug
- email
- password

The backend then:
1. validates the workspace slug
2. finds the user by email
3. verifies the user belongs to that workspace
4. checks the password using BCrypt
5. generates a JWT token

The frontend stores the token and includes it in authenticated API requests.

### Workspace Switching
If a user belongs to multiple workspaces:
1. the user selects a workspace
2. the backend verifies membership
3. the backend issues a new JWT token for that workspace context

---

## Security

FlowForge includes several security-focused mechanisms:

- Spring Security-based route protection
- JWT-based stateless authentication
- BCrypt password hashing
- CORS configuration for trusted frontend origins
- workspace-based tenant isolation
- role-aware and permission-aware backend checks
- request validation using Jakarta Validation
- exception handling for safe API responses

### Security Note
Secrets such as database passwords and JWT secrets should never be hardcoded. They must be provided through environment variables in local development and deployment platforms.

---

## Core Business Logic

### Multi-Tenant Isolation
Each workspace is treated as a separate tenant. Users only access data belonging to their current workspace.

### Membership-Based Visibility
Users do not only see projects they created. They can also see projects if they are members of them or if their role grants access.

### Assignee Validation
A task can only be assigned to a user who:
- belongs to the workspace
- is assigned to the project

### Permission Checks
Actions such as creating projects, managing members, editing tasks, or updating statuses depend on:
- workspace role
- project membership
- ownership
- assignment context

---

## Environment Variables

### Backend
Set these environment variables for the backend:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `APP_JWT_SECRET`

Example:

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://your-host:5432/your-db?sslmode=require
SPRING_DATASOURCE_USERNAME=your-db-user
SPRING_DATASOURCE_PASSWORD=your-db-password
APP_JWT_SECRET=your-long-random-secret