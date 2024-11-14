# Use an official Node.js runtime as a parent image
FROM node:20-alpine3.19

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json index.js ./

# Install dependencies
RUN npm install

# Run the application
CMD ["nodemon", "index.js"]

# Expose the port the app runs on
EXPOSE 5000