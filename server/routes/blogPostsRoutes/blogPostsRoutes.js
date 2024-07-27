const { blogPosts_delete1 } = require("../../controller/blogPostsController/deleteOneBlogPost/deleteOneBlogPost");
const { blogPosts_edit1 } = require("../../controller/blogPostsController/editOneBlogPost/editOneBlogPost");
const { blogPosts_getAll } = require("../../controller/blogPostsController/getAllBlogPosts/getAllBlogposts");
const { blogPosts_get1 } = require("../../controller/blogPostsController/getOneBlogPost/getOneBlogpost");
const { blogPosts_post1 } = require("../../controller/blogPostsController/postOneBlogPost/postOneBlogPost");
const { loggedIn, loggedInADM, } = require("../../controller/studentsController/loggedInAuth/loggedInAuth");

const blogPostsRoutes = [
  {
    method: "get",
    path: "/blogposts",
    middlewares: [loggedIn],
    handler: blogPosts_getAll,
  },
  {
    method: "get",
    path: "/blogpost/:id",
    middlewares: [loggedIn],
    handler: blogPosts_get1,
  },
  {
    method: "post",
    path: "/blogposts",
    middlewares: [loggedIn],
    handler: blogPosts_post1,
  },
  {
    method: "put",
    path: "/blogposts/:id",
    middlewares: [loggedIn, loggedInADM],
    handler: blogPosts_edit1,
  },
  {
    method: "delete",
    path: "/blogposts/:id",
    middlewares: [loggedIn, loggedInADM],
    handler: blogPosts_delete1,
  },
];

module.exports = { blogPostsRoutes };
