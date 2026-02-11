# Software Architecture Project

This project consists of various microservices: an Auth Service, a Command Service, and a Query Service, all built with Node.js and Express. API Gateway built with Kong and UI built with Typescript and React. Each service runs independently and can be containerized using Docker.

## Services

- **Command Service**: Handles command operations and listens on port 3002.
- **Query Service**: Handles query operations and listens on port 3001.
- **API Gateway**: Acts as a single entry point for clients, routing requests to the appropriate service. Listens on port 8000.
- **UI**: A simple user interface that interacts with the API Gateway to perform operations on both services. Listens on port 80.

## Key Patterns

- CQRS Architecture
- API Gateway Pattern
