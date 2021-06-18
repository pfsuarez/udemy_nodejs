import { expect } from "chai";
import sinon from "sinon";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/is-auth.js";

describe("Auth Middleware", () => {
  it("should throw  an error if not authorization header is present", () => {
    const req = {
      get: (header) => {
        return null;
      },
    };

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      "Not authenticated"
    );
  });

  it("should throw an error if the authorization header is only one string", () => {
    const req = {
      get: (header) => {
        return "xyz";
      },
    };

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw("");
  });

  it("should throw an error if the token cannot be verified", () => {
    const req = {
      get: (header) => {
        return "Bearer xyz";
      },
    };

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw("");
  });

  it("should yield a userId after decoding the token", () => {
    const req = {
      get: (header) => {
        return "Bearer xyz";
      },
    };

    sinon.stub(jwt, "verify");
    jwt.verify.returns({
      userId: "abc"
    });

    authMiddleware(req, {}, () => {});
    expect(req).to.have.property("userId");
    expect(req).to.have.property("userId", "abc");
    expect(jwt.verify.called).to.be.true;

    jwt.verify.restore();
  });
});
