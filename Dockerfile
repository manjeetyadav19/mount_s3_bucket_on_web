FROM node:14

WORKDIR /app

# Install application dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY server.js .
COPY index.html .

# Set AWS credentials
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY

# Expose port
EXPOSE 8081

# Start the server
CMD ["node", "server.js"]

