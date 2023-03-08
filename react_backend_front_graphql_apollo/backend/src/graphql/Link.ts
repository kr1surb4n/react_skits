import { extendType, nonNull, objectType, stringArg, intArg,idArg,  inputObjectType, enumType, arg, list } from "nexus";
import { Prisma } from "@prisma/client"

export const Feed = objectType({
    name: "Feed",
    definition(t) {
        t.nonNull.list.nonNull.field("links", { type: Link }); // what feed query returns
        t.nonNull.int("count"); // the count
        t.id("id");  // an id
    },
});


export const LinkOrderByInput = inputObjectType({
    name: "LinkOrderByInput",
    definition(t) {
        t.field("description", { type: Sort });
        t.field("url", { type: Sort });
        t.field("createdAt", { type: Sort });
    },
});

export const Sort = enumType({
    name: "Sort",
    members: ["asc", "desc"],
});

export const Link = objectType({                    // Type definition
    name: "Link",                                   // name of the type
    definition(t) {                                 // definition start:
        t.nonNull.id("id");                        //      id field 
        t.nonNull.string("description");            //      description field
        t.nonNull.string("url");                    //      url field 
        t.nonNull.dateTime("createdAt");            //      createdAt field
        t.field("postedBy", {                       //      postedBy field , can be null
            type: "User",
            resolve(parent, args, context) {        // resolver - get the link, and the user it belongs to 
                return context.prisma.link          // you need to get the current object first, the nested resolver doesnt know you want this exactly Link
                    .findUnique({ where: { id: parent.id } })
                    .postedBy();
            },
        });
        t.nonNull.list.nonNull.field("votes", {  // 1
            type: "Vote",
            resolve(parent, args, context) {
                const votes =  context.prisma.link
                .findUnique({ where: { id: parent.id } })
                .votes();
                console.log(votes);
                return votes;
            }
        });
    },
});

export const FeedQuery = extendType({  // extend the Query root type
    type: "Query",
    definition(t) {
        t.nonNull.field("feed", {   // add a filed feed to it
            type: "Feed",
            args: {
                filter: stringArg(),   // 1
                skip: intArg(),   // skip n-elements
                take: intArg(),   // take n-elements

                // it is a list -  allows to give more fields to the ordeby by clause
                // originally was a single element
                orderBy: arg({ type: list(nonNull(LinkOrderByInput)) }), 
            },
            async resolve(parent, args, context) { // resolver function - implementation of the filed
                // parent - the results of the parent query resolver
                // args - the arguments, an object
                // context - the context object injected by the apollo, can have goodies
                
                // info - the object with info that has following fields:
                // from: https://github.com/graphql/graphql-js/blob/f851eba93167b04d6be1373ff27927b16352e202/src/type/definition.ts#L891-L902
                // export interface GraphQLResolveInfo {
                //     readonly fieldName: string;
                //     readonly fieldNodes: ReadonlyArray<FieldNode>;
                //     readonly returnType: GraphQLOutputType;
                //     readonly parentType: GraphQLObjectType;
                //     readonly path: Path;
                //     readonly schema: GraphQLSchema;
                //     readonly fragments: ObjMap<FragmentDefinitionNode>;
                //     readonly rootValue: unknown;
                //     readonly operation: OperationDefinitionNode;
                //     readonly variableValues: { [variable: string]: unknown };
                // }

                // prisma returns a promise
                // apollo is handling the promises
                //this is how we can add filtering
                const where = args.filter   // 2
                    ? {
                          OR: [
                              { description: { contains: args.filter } },
                              { url: { contains: args.filter } },
                          ],
                      }
                    : {};

                // prisma returns a promise
                // apollo is handling the promises
                // prisma treats null as value, undefined is nothing
                const links = await context.prisma.link.findMany({  
                    where,
                    skip: args?.skip as number | undefined,    // pass the stuff to prisma
                    take: args?.take as number | undefined,    // welcome to the world of undefined
                    orderBy: args?.orderBy as Prisma.Enumerable<Prisma.LinkOrderByWithRelationInput> | undefined,
                });

                const count = await context.prisma.link.count({ where });  // do the count of all.
                const id = `main-feed:${JSON.stringify(args)}`;  // make the id
                  
                return {  // return the whole object
                    links,
                    count,
                    id,
                };
            },
        });
    },
});

export const LinkQuery = extendType({  // 2
    type: "Query",
    definition(t) {
        t.nonNull.field("link", {   // 3
            type: "Link",
            args: {
                id: nonNull(idArg())
            },
            resolve(parent, {id}, context, info) {    // 4
                const found = context.prisma.link.findUnique({
                    where: {
                      id: id,
                    },
                  })
                return found;
            },
        });
    },
});


export const LinkMutation = extendType({  // extend the Mutation type
    type: "Mutation",    
    definition(t) {
        t.nonNull.field("post", {  // name of the mutation is post on object Link, you cant return null and
            type: "Link",          // you have to return a Link
            args: {   // the arguments post(description: X, url: Y)
                description: nonNull(stringArg()),
                url: nonNull(stringArg()),
            },
              
            resolve(parent, args, context) {    
                const { description, url } = args;  // expand on arguments
                const { userId } = context;

                if (!userId) {  // 1
                    throw new Error("Cannot post without logging in.");
                }
                
                const newLink = context.prisma.link.create({   // do an insert
                    data: {
                        description: description,
                        url: url,
                        postedBy: { connect: { id: userId }},
                    },
                });
                
                // return just added object,do it 
                return newLink;
                    
            },
        });
        t.nonNull.field("updateLink", {  // 2
            type: "Link",  
            args: {   // 3
                id: nonNull(idArg()),
                url: nonNull(stringArg()),
                description: nonNull(stringArg()),
            },
            
            resolve(parent, { id, url, description }, context) {    

                const link = context.prisma.link.update({
                    where: {
                      id: id,
                    },
                    data: {
                        url: url,
                        description: description
                    },
                  })

                return link;
            },
        });
        t.field("deleteLink", {  // 2
            type: "Link",  
            args: {   // 3
                id:  nonNull(idArg()),
            },
            
            resolve(parent, {id}, context) {    


                const deletedLink = context.prisma.link.delete({
                    where: {
                      id:  id,
                    },
                  })
               
                return deletedLink;
            },
        });
    },
});

