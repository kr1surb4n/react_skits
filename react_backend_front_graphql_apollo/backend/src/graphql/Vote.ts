import { objectType, extendType, nonNull, idArg } from "nexus";
import { User } from "@prisma/client";

export const Vote = objectType({  // union type of Link and User
    name: "Vote",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.field("link", { 
            type: "Link", 
            resolve(parent, args, context) {   // write a resolver for the links
                return context.prisma.vote     // the parten is the vote
                    .findUnique({ where: { id: parent.id }})  // so, hey get me, and then my related object
                    .link();
            }
        });
        t.nonNull.field("user", {  
            type: "User",
            resolve(parent, args, context) {   // write a resolver for the user
                return context.prisma.vote     // the parent is the vote
                    .findUnique({ where: { id: parent.id }})
                    .user();
            }
        });
    },
});

export const VoteMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.field("vote", {
            type: "Vote",
            args: {
                linkId: nonNull(idArg()),
            },
            async resolve(parent, args, context) {
                const { userId } = context;
                const { linkId } = args;

                if (!userId) {  // 1 
                    throw new Error("Cannot vote without logging in.");
                }

                const vote = await context.prisma.vote.findUnique({
                    where: {
                      linkId_userId: {
                        linkId: linkId,
                        userId: userId
                      }
                    }
                  });
                
                  if (vote) {
                    throw new Error(
                      `Already voted for link: ${linkId}`
                    );
                  }



                const new_vote = context.prisma.vote.create({   // do an insert
                    data: {
                        link: { connect: { id: linkId } },
                        user: { connect: { id: userId } }
                    },
                });

                return new_vote;
            }
        })
    }
})
