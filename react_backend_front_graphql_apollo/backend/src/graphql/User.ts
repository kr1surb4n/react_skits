import { extendType, nonNull, objectType, stringArg, intArg } from "nexus";   

export const User = objectType({
    name: "User",
    definition(t) {
        t.nonNull.id("id");
        t.nonNull.string("name");
        t.nonNull.string("email");
        t.nonNull.list.nonNull.field("links", {    // this is field with all the links of the user
            type: "Link",
            resolve(parent, args, context) {   // write a resolver for the links
                return context.prisma.user  // get the user by parent id and his all links by using the relation
                    .findUnique({ where: { id: parent.id } })
                    .links();
            },
        }); 
    },
});