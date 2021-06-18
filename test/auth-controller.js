import { expect } from "chai";
import sinon from "sinon";
import mongoose from "mongoose";

import User from "../models/user.js";
import * as configuration from "../helper/configuration.js";
import * as authController from "../controller/auth.js";
import * as feedController from "../controller/feed.js";

describe("Auth Controller - Login", () => {
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

  it("should thrown an error with code 500 if accessing the database fails", function (done) {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        email: "test@test.com",
        password: "123",
      },
    };

    authController
      .login(req, {}, () => {})
      .then((result) => {
        //console.log("", result);
        expect(result).to.be.an("error");
        expect(result).to.have.property("statusCode", 500);
        done();
      });

    User.findOne.restore();
  });

  it("should send a response with a valid user status for an existing user", (done) => {
    const req = {
      userId: "5c0f66b979af55031b34728a",
    };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      },
    };

    feedController
      .getStatus(req, res, () => {})
      .then(() => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.userStatus).to.be.equal("I'm new");

        done();
      });
  });

  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
