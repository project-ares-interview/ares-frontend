# Stage 1: Build the Expo for Web application
FROM node:18-alpine AS builder

WORKDIR /app

# Install dotenvx
RUN npm install -g @dotenvx/dotenvx --save

# Copy package files and install dependencies
RUN yarn install

# Copy the rest of the application source code
COPY . .

# Build the application for production
# The DOTENV_PRIVATE_KEY_STAGING for the frontend must be injected during the build process (e.g., in CI/CD)
# Example: docker build --build-arg DOTENV_PRIVATE_KEY_STAGING="..." -t my-frontend .
ARG DOTENV_PRIVATE_KEY_STAGING
# Set the DOTENV_PRIVATE_KEY_STAGING as an environment variable only for the scope of this RUN command.
# This prevents the key from being baked into the image layer, resolving the security warning.
RUN DOTENV_PRIVATE_KEY_STAGING=${DOTENV_PRIVATE_KEY_STAGING} dotenvx run -f .env.staging -- npx expo export -p web

# Stage 2: Serve the application with Nginx
FROM nginx:1.25-alpine

# Copy the build output from the builder stage
# The output of 'npx expo export -p web' is in the 'dist' directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
