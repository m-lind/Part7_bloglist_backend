const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post(
  "/",
  middleware.userExtractor,
  async (request, response, next) => {
    const { title, author, url, likes } = request.body;
    const blog = new Blog({
      title,
      author,
      url,
      likes: likes ? likes : 0,
    });

    const user = request.user;

    if (!user) {
      return response.status(401).json({ error: "operation not permitted" });
    }

    blog.user = user._id;

    let createdBlog = await blog.save();

    user.blogs = user.blogs.concat(createdBlog._id);
    await user.save();

    createdBlog = await Blog.findById(createdBlog._id).populate("user");

    response.status(201).json(createdBlog);
  }
);

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response, next) => {
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).json({ error: "blog not found" });
    }

    const user = request.user;
    if (blog.user.toString() === user.id.toString()) {
      await Blog.findByIdAndRemove(request.params.id);
      response.status(204).end();
    } else {
      response.status(401).json({
        error: "invalid username",
      });
    }
  }
);

blogsRouter.put("/:id", async (request, response) => {
  const { title, url, author, likes } = request.body;

  let updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, url, author, likes },
    { new: true }
  );

  updatedBlog = await Blog.findById(updatedBlog._id).populate("user");

  response.json(updatedBlog);
});

module.exports = blogsRouter;
