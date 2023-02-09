import { extendType, nonNull, objectType, stringArg, intArg, inputObjectType, enumType, arg, list } from "nexus";
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
        t.nonNull.int("id");                        //      id field 
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
        t.nonNull.list.nonNull.field("voters", {  // 1
            type: "User",
            resolve(parent, args, context) {
                return context.prisma.link
                    .findUnique({ where: { id: parent.id } })
                    .voters();
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
                orderBy: arg({ type: list(nonNull(LinkOrderByInput)) }),  // 1
            },
            async resolve(parent, args, context) { // resolver function - implementation of the filed
                // parent - the results of the parent query resolver
                // args - the arguments, an object
                // context - the context object injected by the apollo, can have goodies


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
                id: nonNull(intArg())
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
                id: nonNull(intArg()),
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
                id:  nonNull(intArg()),
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

