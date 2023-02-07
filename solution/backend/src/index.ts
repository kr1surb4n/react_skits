import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";



// 1. Get the schema 
import { schema } from "./schema";
import { context } from "./context";   

// 2. Put the schema into ApolloServer
export const server = new ApolloServer({
    schema,
    context,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],

});

// 3. Start the server
const port = 3000;
server.listen({port}).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
