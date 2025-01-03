FROM node:18-bullseye-slim as base

# Install dependencies required for build
RUN apt-get update && apt-get install -y openssl

# Set working directory
RUN mkdir /app
WORKDIR /app

FROM base as build

# Copy project files
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install dependencies and generate Prisma client
RUN npm install
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

FROM base as production

# Set NODE_ENV for production
ENV NODE_ENV production

# Copy build files and node_modules from build stage
COPY --from=build /app /app

# Expose the app's default port
EXPOSE 3000

# Start the application
CMD [ "bash", "-c", "npx prisma db push && npm run start" ]
