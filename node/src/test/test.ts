import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { expect } from "chai";
import app from "../server";

let mongoServer;
const agent = request.agent(app); // This will help keep the session

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.disconnect();
  await mongoose.connect(mongoUri);
});

after(async () => {
  await mongoose.disconnect();
});

describe("GET /", () => {
  it("should return 200 OK", (done) => {
    request(app).get("/").expect(200, done);
  });
});

describe("POST /auth/signin", () => {
  const validCredentials = {
    email: process.env.COGNITO_TEST_EMAIL,
    password: process.env.COGNITO_TEST_PASSWORD,
  };

  it("should return 200 OK when valid credentials are provided", (done) => {
    agent
      .post("/auth/signin")
      .send(validCredentials)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("message", "User signed in successfully");
        expect(res.body).to.have.property("userData");
        done();
      });
  });
});

describe("GET /protected", () => {
  it("should return 401 Unauthorized when no cookie is provided", (done) => {
    request(app).get("/protected").expect(401, done);
  });

  it("should return 200 OK when a valid cookie is provided", (done) => {
    agent.get("/protected").expect(200, done);
  });
});

describe("GET /student_staff", () => {
  it("should return 422 when the page parameter is missing", (done) => {
    agent.get("/student_staff").expect(422, done);
  });

  it("should return 200 OK when fetching the student_staff on page 1", (done) => {
    agent
      .get("/student_staff?page=1")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("results");
        expect(res.body).to.have.property("page", 1);
        expect(res.body).to.have.property("pages");
        done();
      });
  });

  it("should return 200 OK when fetching student_staff using name filter", (done) => {
    agent
      .get("/student_staff?page=1&name=john")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("results");
        expect(res.body).to.have.property("page", 1);
        expect(res.body).to.have.property("pages");
        done();
      });
  });

  it("should return 200 OK when fetching student_staff using gender filter", (done) => {
    agent
      .get("/student_staff?page=1&gender=male")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("results");
        expect(res.body).to.have.property("page", 1);
        expect(res.body).to.have.property("pages");
        done();
      });
  });

  it("should return 200 OK when fetching student_staff using phone filter", (done) => {
    agent
      .get("/student_staff?page=1&phone=1234567890")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("results");
        expect(res.body).to.have.property("page", 1);
        expect(res.body).to.have.property("pages");
        done();
      });
  });

  it("should return 200 OK when fetching student_staff using multiple filters", (done) => {
    agent
      .get("/student_staff?page=1&name=john&gender=male&phone=1234567890")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("results");
        expect(res.body).to.have.property("page", 1);
        expect(res.body).to.have.property("pages");
        done();
      });
  });

  it("should return 422 when fetching student_staff with invalid gender filter", (done) => {
    agent.get("/student_staff?page=1&gender=wrongGender").expect(422, done);
  });
});

describe("GET /tasks", () => {
  it("should return 422 when the page parameter is missing", (done) => {
    agent.get("/tasks").expect(422, done);
  });

  it("should return 200 OK when fetching the tasks on page 1", (done) => {
    agent
      .get("/tasks?page=1")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("results");
        expect(res.body).to.have.property("page", 1);
        expect(res.body).to.have.property("pages");
        done();
      });
  });

  it("should return 200 OK when fetching tasks using userID filter", (done) => {
    agent
      .get("/tasks?page=1&userID=6565590b5ac3d1685259b698")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("results");
        expect(res.body).to.have.property("page", 1);
        expect(res.body).to.have.property("pages");
        done();
      });
  });

  it("should return 422 when fetching tasks using invalid mongoID userID filter", (done) => {
    agent.get("/tasks?page=1&userID=invalidUserID").expect(422, done);
  });

  it("should return 200 OK when fetching tasks using status filter", (done) => {
    agent
      .get("/tasks?page=1&status=completed")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("results");
        expect(res.body).to.have.property("page", 1);
        expect(res.body).to.have.property("pages");
        done();
      });
  });
});

describe("POST /task-create", () => {
  it("should return 422 when the title parameter is missing", (done) => {
    agent.post("/task-create").expect(422, done);
  });

  it("should return 422 when the description parameter is missing", (done) => {
    agent.post("/task-create").send({ title: "Task Title" }).expect(422, done);
  });

  it("should return 422 when the location parameter is missing", (done) => {
    agent.post("/task-create").send({ title: "Task Title", description: "Task Description" }).expect(422, done);
  });

  it("should return 422 when the assignedTo parameter is missing", (done) => {
    agent.post("/task-create").send({ title: "Task Title", description: "Task Description", location: "Task Location" }).expect(422, done);
  });

  it("should return 201 OK when creating a new task", (done) => {
    const requestBody = {
      title: "Task Title",
      description: "Task Description",
      location: "Task Location",
      assignedTo: ["6565590b5ac3d1685259b698"],
    };

    agent
      .post("/task-create")
      .set("Content-Type", "application/json")
      .send(requestBody)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("_id");
        done();
      });
  });
});
