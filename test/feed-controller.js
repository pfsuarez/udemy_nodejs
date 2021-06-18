import { expect } from "chai";
import sinon from "sinon";
import mongoose from "mongoose";

import User from "../models/user.js";
import Post from "../models/post.js";
import * as configuration from "../helper/configuration.js";
import * as authController from "../controller/auth.js";
import * as feedController from "../controller/feed.js";

describe("Feed Controller", () => {
  before(function (done) {
    mongoose
      .connect(configuration.MONGODB_URI, { useNewUrlParser: true })
      .then(() => {
        const user = new User({
          _id: "5c0f66b979af55031b34728a",
          email: "test@test.com",
          password: "tester",
          name: "Test",
          posts: [],
        });

        return user.save();
      })
      .then(() => {
        done();
      })
      .catch((err) => console.log("MongoDb Error", err));
  });

  it("should add a created post to the posts of the creator", (done) => {
    const req = {
      body: {
        title: "test post",
        content: "qwert",
      },
      file: {
        path: "qwerty",
      },
      userId: "5c0f66b979af55031b34728a",
    };

    const res = {
      status: function (code) {
        return this;
      },
      json: function (data) {
      },
    };

    feedController
      .createPost(req, res, () => {})
      .then((savedUser) => {
        expect(savedUser).to.have.property("posts");
        expect(savedUser.posts).to.have.length(1);
        done();
      });
  });

  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return Post.deleteMany({});
      })
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
