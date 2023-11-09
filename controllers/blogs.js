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
    const body = request.body;
    const user = request.user;
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id,
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
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

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, url, author, likes },
    { new: true }
  );

  response.json(updatedBlog);
});

module.exports = blogsRouter;
