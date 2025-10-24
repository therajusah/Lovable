FROM e2bdev/code-interpreter:latest 

WORKDIR /home/user

RUN apt-get update && apt-get install -y tree

RUN npm create vite-react-ai@latest react-app && \
    cd react-app && \
    npm install

WORKDIR /home/user/react-app