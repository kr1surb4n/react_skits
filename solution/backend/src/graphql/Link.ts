import { extendType, nonNull, objectType, stringArg, intArg } from "nexus";   
import { NexusGenObjects } from "../../nexus-typegen";  
import * as _ from "lodash";

export const Link = objectType({                    // Type definition
    name: "Link",                                   // name of the type
    definition(t) {                                 // definition start:
        t.nonNull.int("id");                        //      id field 
        t.nonNull.string("description");            //      description field
        t.nonNull.string("url");                    //      url field 
    },
});

export const FeedQuery = extendType({  // extend the Query root type
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("feed", {   // add a filed feed to it
            type: "Link",
            resolve(parent, args, context, info) {    // resolver function - implementation of the filed
                // parent - the results of the parent query resolver
                // args - the arguments, an object
                // context - the context object injected by the apollo, can have goodies


                // prisma returns a promise
                // apollo is handling the promises
                return context.prisma.link.findMany();
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

                const newLink = context.prisma.link.create({   // do an insert
                    data: {
                        description: description,
                        url: url,
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

