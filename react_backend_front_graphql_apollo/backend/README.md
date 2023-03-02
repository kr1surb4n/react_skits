# React/Typescript/GraphQL/Apollo/Prism Playground


Here I play with all the tools above. The goal is to have
a productive chasis that will be used later. I am using the
GraphQL tutorial frontend and backend as the base, and I am 
going to move forward from here.

Frontend has to be translated to Typescript. Some of the tooling
is missing. The backend you get from the tutorial is not exactly
the one used by the frontend tutorial, so this has to be fixed. 

This backed has been ported to be exact as the backend used for the
frontend tutorial. 

About the example Prism schema. The IDs for User and the Link are defined as UUID ver 4. In terms of SQL db it is not ok, a plain string as an id. For an example it is ok. Postgresql has uuid() type. Mysql will use varchar. Sqlite has TEXT. In terms of graphql this is an example for using the globally universal id.