FROM node:10

# Create app directory
WORKDIR /usr/src/app

# COPY /node_backend/package*.json ./

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
# RUN "add-apt-repository 'deb [arch=amd64] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse'"
# RUN  apt install mongodb-org
# RUN  systemctl enable mongod
# RUN  systemctl start mongod
WORKDIR /usr/src/app/node_backend
RUN npm install

EXPOSE 3080
CMD [ "npm", "run", "serverstart" ]
