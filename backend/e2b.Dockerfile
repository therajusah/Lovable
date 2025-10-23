FROM e2bdev/code-interpreter:latest 

# Set working directory
WORKDIR /home/user

# Install Vite (React template) and TailwindCSS
RUN npm create vite@latest . -- --template react && \
    npm install
