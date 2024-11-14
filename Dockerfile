# Use an official Node.js runtime as a parent image
FROM node:16.20.2-alpine3.18 AS build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json index.js ./

# Install dependencies
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Run the application
CMD ["nodemon", "index.js"]

# Expose the port the app runs on
EXPOSE 5000