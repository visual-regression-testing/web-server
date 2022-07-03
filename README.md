Web Server

# Introduction

This is the web server that currently contains the visual UI, as well as the API endpoints that Percy CLI uses.

Working with Percy 1.5.1

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Before running the tests in your project, set the env var below so that Percy CLI will point to your server.

```
export PERCY_CLIENT_API_URL=http://localhost:3000/api/v1
```
