# Base image
FROM node:18-alpine

# App directory
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN npm install

# Disable ESLint during build
ENV NEXT_DISABLE_ESLINT=true

# Build the app
RUN npm run build

# Start the app
CMD ["npm", "start"] 