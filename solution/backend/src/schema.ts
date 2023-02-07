import { makeSchema } from 'nexus'
import { join } from 'path'
import * as types from "./graphql";

export const schema = makeSchema({
  types: types, // types definitions 
  outputs: {
    schema: join(process.cwd(), "schema.graphql"), // this is the graphql schema file
    typegen: join(process.cwd(), "nexus-typegen.ts"), // nexus typegen file - types for TS
  },
})