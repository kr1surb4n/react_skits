// get the prisma client
import { PrismaClient } from "@prisma/client";

// get the uuid generator
import { v4 as uuidv4 } from 'uuid';

// initiate it
const prisma = new PrismaClient();

// here we do the queries, i need to read the prisma docs
async function main() {
    console.log("Getting links");
    const allLinks = await prisma.link.findMany();

    for (const link of allLinks) {
      console.log("Updating: ", link);
      const updated_link = await prisma.link.update({
        where: { id: link.id },
        data: { id: uuidv4() },
      })
      console.log("Updated: ", updated_link);

    }

    console.log("Getting users");
    const allUsers = await prisma.user.findMany();

    for (const user of allUsers) {
      console.log("Updating: ", user);
      const updated_user = await prisma.user.update({
        where: { id: user.id },
        data: { id: uuidv4() },
      })
      console.log("Updated: ", updated_user);

    }
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