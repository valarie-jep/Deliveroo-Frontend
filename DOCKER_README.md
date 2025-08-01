# Docker Setup for Deliveroo Frontend

This project is now containerized with Docker for easy development and deployment.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Quick Start

### Production Build

1. **Build and run the production container:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Open your browser and go to `http://localhost:3000`

### Development Build

1. **Build and run the development container:**
   ```bash
   docker-compose --profile dev up --build
   ```

2. **Access the development application:**
   - Open your browser and go to `http://localhost:3001`
   - Hot reloading is enabled for development

## Docker Commands

### Build the Docker image
```bash
docker build -t deliveroo-frontend .
```

### Run the container
```bash
docker run -p 3000:80 deliveroo-frontend
```

### Development with hot reloading
```bash
docker build -f Dockerfile.dev -t deliveroo-frontend-dev .
docker run -p 3001:3000 -v $(pwd):/app deliveroo-frontend-dev
```

### Using Docker Compose

**Production:**
```bash
# Start production service
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down
```

**Development:**
```bash
# Start development service
docker-compose --profile dev up

# Start in background
docker-compose --profile dev up -d
```

## Environment Variables

The application uses environment variables for configuration. You can set them in several ways:

1. **Using a .env file:**
   ```bash
   # Create .env file
   REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
   REACT_APP_API_BASE_URL=https://your-api-url.com
   ```

2. **Using Docker Compose environment section:**
   ```yaml
   environment:
     - REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

3. **Using docker run:**
   ```bash
   docker run -p 3000:80 -e REACT_APP_GOOGLE_MAPS_API_KEY=your_key deliveroo-frontend
   ```

## Docker Configuration Files

### Dockerfile
- Multi-stage build for optimized production image
- Uses Node.js 18 Alpine for smaller image size
- Builds the React app and serves it with Nginx

### Dockerfile.dev
- Single-stage build for development
- Includes all dependencies for development
- Enables hot reloading

### nginx.conf
- Custom Nginx configuration for React Router support
- Includes security headers and compression
- Handles SPA routing with fallback to index.html

### docker-compose.yml
- Production service on port 3000
- Development service on port 3001 (optional profile)
- Health checks and restart policies

## Health Checks

The production container includes health checks:
- Checks the `/health` endpoint every 30 seconds
- Container will be marked as unhealthy if health checks fail

## Security Features

The Nginx configuration includes:
- Security headers (X-Frame-Options, X-XSS-Protection, etc.)
- Content Security Policy
- Proper caching headers for static assets

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using the port
   lsof -i :3000
   
   # Use a different port
   docker run -p 3001:80 deliveroo-frontend
   ```

2. **Build fails:**
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker build --no-cache -t deliveroo-frontend .
   ```

3. **Environment variables not working:**
   - Ensure variables are prefixed with `REACT_APP_`
   - Rebuild the container after changing environment variables

### Logs

```bash
# View container logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View specific service logs
docker-compose logs deliveroo-frontend
```

## Production Deployment

For production deployment, consider:

1. **Using a reverse proxy (Nginx/Traefik)**
2. **Setting up SSL/TLS certificates**
3. **Configuring proper environment variables**
4. **Setting up monitoring and logging**
5. **Using Docker volumes for persistent data**

## Development Workflow

1. **Start development environment:**
   ```bash
   docker-compose --profile dev up
   ```

2. **Make changes to your code**
   - Changes will automatically reload in the browser

3. **Build for production:**
   ```bash
   docker-compose up --build
   ```

4. **Test production build locally:**
   ```bash
   docker-compose up
   ```

## Performance Optimization

The Docker setup includes:
- Multi-stage builds to reduce image size
- Nginx for serving static files efficiently
- Gzip compression for faster loading
- Proper caching headers for static assets
- Alpine Linux base images for smaller size 