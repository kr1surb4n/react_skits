# Graphql React+Apollo Tutorial Run


## Backend 
Currently the backend in this repository is not working with this frontend code. Yet.

For now, follow the tutorial's [instructions](https://www.howtographql.com/react-apollo/1-getting-started/)

Run this, it will download the backend code for this tutorial into the `server` folder:
```
curl https://codeload.github.com/howtographql/react-apollo/tar.gz/starter | tar -xz --strip=1 react-apollo-starter/server
```

Inside the `server` folder run those commands:
```
npm install
npx prisma generate
npm run dev
```

The GraphQL Playground will be under:
[http://localhost:4000](http://localhost:4000)

## Log



## TODO

### Translate the project to TypeSript
### Move special values from the constants.js to env variables
### Add linters, and formaters.
### Add tests. 
### Dockerize the frontend
### Add performance measurings