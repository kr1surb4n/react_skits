import { objectType } from "nexus";

// Example Photo object
// {
//     "id": "yiOhyqGmHMY",
//     "description": string|null,
//     "url": "https://images.unsplash.com/photo-1578955684819-51ebe1668d1b?crop=entropy&cs=srgb&fm=jpg&ixid=MnwzNDE2fDB8MXxyYW5kb218fHx8fHx8fHwxNjQyNjg0OTgz&ixlib=rb-1.2.1&q=85",
//     "link": "https://unsplash.com/photos/yiOhyqGmHMY",
//     "topics": [
//       "architecture"
//     ],
//     "user": "dG6lZyj-wvM"
//   },

export const Photo = objectType({
    name: "Photo", // 1 
    definition(t) {  // 2
        t.nonNull.id("id"); // 3 
        t.string("description"); // 4
        t.nonNull.string("url"); // 5 
        t.nonNull.string("link"); // 5 
        t.nonNull.string("user"); // 5 
        t.list.string("topics");
    },
});

