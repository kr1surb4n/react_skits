import { extendType } from "nexus";

export const InfoQuery = extendType({  // extend the Query root type
    type: "Query",
    definition(t) {
        t.nonNull.field("info", {   // add a filed feed to it
            type: "String",
            async resolve(parent, args, context) { 
                // resolver function - implementation of the filed
                // parent - the results of the parent query resolver
                // args - the arguments, an object
                // context - the context object injected by the apollo, can have goodies

                const info_string = "This is an example message";
                
                return info_string;
            },
        });
    },
});
