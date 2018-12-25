FROM alpine

# Create app directory
WORKDIR /usr/src/app

# Set up node
RUN apk add --update nodejs nodejs-npm yarn

# Set up python and packages needed to generate jwts for Apple Maps
RUN apk add --no-cache python3 py3-pip gcc python3-dev py3-cffi file file git curl autoconf automake py3-cryptography linux-headers musl-dev libffi-dev openssl-dev build-base
RUN pip3 install --upgrade pip
RUN pip3 install cffi
RUN pip3 install PyJWT

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 3000

CMD [ "yarn", "start" ]
