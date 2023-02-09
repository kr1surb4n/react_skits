// get the prisma client
import { PrismaClient } from "@prisma/client";

// initiate it
const prisma = new PrismaClient();

// here we do the queries, i need to read the prisma docs
async function main() {
    const newLink1 = await prisma.link.create({
        data: {
          description: 'F tutorial for GraphQL',
          url: 'www.howtographql.com/asd',
        },
      })

      const newLink2 = await prisma.link.create({
        data: {
        url: "graphql.org",
        description: "GraphQL official website",        },
      })

      const newLink3 = await prisma.link.create({
        data: {
            url: "www.howtographql.com",
            description: "Fullstack tutorial for GraphQL",
        },
      })
    const allLinks = await prisma.link.findMany();
    console.log(allLinks);
}

// call the function
main()
    .catch((e) => {
        throw e;
    })
    // 5
    .finally(async () => {
        await prisma.$disconnect();
    });