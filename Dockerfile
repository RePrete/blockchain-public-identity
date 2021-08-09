FROM node:14-alpine
RUN apk add git python make alpine-sdk

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# add app
COPY . ./

# install app dependencies
RUN yarn

# start app
CMD ["yarn", "start"]