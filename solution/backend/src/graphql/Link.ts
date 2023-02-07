import { extendType, nonNull, objectType, stringArg, intArg } from "nexus";   
import { NexusGenObjects } from "../../nexus-typegen";  
const _ = require('lodash');

export const Link = objectType({
    name: "Link", // 1 
    definition(t) {  // 2
        t.nonNull.int("id"); // 3 
        t.nonNull.string("description"); // 4
        t.nonNull.string("url"); // 5 
    },
});

const links: NexusGenObjects["Link"][]= [   // 1
    {
        id: 1,
        url: "www.howtographql.com",
        description: "Fullstack tutorial for GraphQL",
    },
    {
        id: 2,
        url: "graphql.org",
        description: "GraphQL official website",
    },
];

export const FeedQuery = extendType({  // 2
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("feed", {   // 3
            type: "Link",
            resolve(parent, args, context, info) {    // 4
                return links;
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
                const found = _.find(links, (item) => { return item.id == id;});
                console.log(found);
                return found;
            },
        });
    },
});


export const LinkMutation = extendType({  // 1
    type: "Mutation",    
    definition(t) {
        t.nonNull.field("post", {  // 2
            type: "Link",  
            args: {   // 3
                description: nonNull(stringArg()),
                url: nonNull(stringArg()),
            },
            
            resolve(parent, args, context) {    
                const { description, url } = args;  // 4
                
                const idCount = links.length + 1;  // 5
                const link = {
                    id: idCount,
                    description: description,
                    url: url,
                };
                links.push(link);
                return link;
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
                const link = _.find(links,{'id': id});

                link.url = url;
                link.description = description;
                
                return link;
            },
        });
        t.field("deleteLink", {  // 2
            type: "Link",  
            args: {   // 3
                id:  nonNull(intArg()),
            },
            
            resolve(parent, {id}, context) {    
                const removed_links = _.remove(links, function(link) {
                    return link.id == id
                 });

                if (removed_links.length == 1) {
                    return removed_links[0];
                }
               
                return removed_links;
            },
        });
    },
});

