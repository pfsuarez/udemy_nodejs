import { validationResult } from "express-validator";

export const getPost = (req, res, next) => {
  return res.status(200).json({
    posts: [
      {
        _id: "12345",
        title: "First Post",
        content: "This is the first post!",
        imageUrl: "images/107-rafita.jpg",
        creator: {
          name: "QWERTY",
        },
        createdAt: new Date(),
      },
    ],
  });
};

export const createPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed. Entered data is incorrect.",
      errors: errors.array(),
    });
  }

  const title = req.body.title;
  const content = req.body.content;

  //Create Post in DB
  res.status(201).json({
    message: "Post created succesfully",
    post: {
      id: "123",
      title,
      content,
      creator: {
        name: "QWERTY",
      },
      createdAt: new Date(),
    },
  });
};
