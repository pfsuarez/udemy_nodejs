export const getPost = (req, res, next) => {
  return res.status(200).json({
    posts: [
      {
        title: "First Post",
        content: "This is the first post!",
      },
    ],
  });
};

export const createPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;

  //Create Post in DB
  res.status(201).json({
    message: "Post created succesfully",
    post: {
      id: new Date().toISOString(),
      title,
      content,
    },
  });
};
