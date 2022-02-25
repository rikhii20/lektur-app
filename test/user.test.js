jest.setTimeout(30000);
const app = require("../app");
const supertest = require("supertest");
const { User } = require("../models");

afterAll(async () => {
  await User.destroy({
    where: {
      email: "rikhi@gmail.com",
    },
  });
});
afterAll(async () => {
  await User.destroy({
    where: {
      email: "rikhis@gmail.com",
    },
  });
});
afterAll(async () => {
  await User.destroy({
    where: {
      email: "rikhiso@gmail.com",
    },
  });
});

test("POST /api/v1/user/register (Student)", async () => {
  const user = {
    fullName: "Rikhi Sobari",
    email: "rikhi@gmail.com",
    password: "Rikhi123!",
    role: "student",
  };
  await supertest(app)
    .post("/api/v1/user/register")
    .send(user)
    .expect(201)
    .then((res) => {
      expect(res.body.status).toBe("Success");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
test("POST /api/v1/user/register (teacher)", async () => {
  const user = {
    fullName: "Rikhi Sobari",
    email: "rikhis@gmail.com",
    password: "Rikhi123!",
    role: "teacher",
  };
  await supertest(app)
    .post("/api/v1/user/register")
    .send(user)
    .expect(201)
    .then((res) => {
      expect(res.body.status).toBe("Success");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
test("POST /api/v1/user/register", async () => {
  const user = {
    fullName: "Rikhi Sobari",
    email: "rikhiso@gmail.com",
    password: "Rikhi123!",
    role: "kang cilok",
  };
  await supertest(app)
    .post("/api/v1/user/register")
    .send(user)
    .expect(400)
    .then((res) => {
      expect(res.body.status).toBe("Bad Request");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
test("POST /api/v1/user/register (Bad Request: Teacher email already exists)", async () => {
  const user = {
    fullName: "jajang",
    email: "jajang@gmail.com",
    password: "Rikhi123!",
    role: "teacher",
  };
  await supertest(app)
    .post("/api/v1/user/register")
    .send(user)
    .expect(400)
    .then((res) => {
      expect(res.body.status).toBe("Bad Request");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
test("POST /api/v1/user/register (Bad Request: Student email already exists )", async () => {
  const user = {
    fullName: "nurul",
    email: "nurul@gmail.com",
    password: "Rikhi123!",
    role: "student",
  };
  await supertest(app)
    .post("/api/v1/user/register")
    .send(user)
    .expect(400)
    .then((res) => {
      expect(res.body.status).toBe("Bad Request");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
test("POST /api/v1/user/login", async () => {
  const user = {
    email: "rikhi@gmail.com",
    password: "Rikhi123!",
  };
  await supertest(app)
    .post("/api/v1/user/login")
    .send(user)
    .expect(200)
    .then((res) => {
      expect(res.body.status).toBe("Success");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
test("POST /api/v1/user/login (Unauthorized: Invalid Email)", async () => {
  const user = {
    email: "rikh@gmail.com",
    password: "Rikhi123!",
  };
  await supertest(app)
    .post("/api/v1/user/login")
    .send(user)
    .expect(401)
    .then((res) => {
      expect(res.body.status).toBe("Unauthorized");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
test("POST /api/v1/user/login (Unauthorized: Invalid Password)", async () => {
  const user = {
    email: "rikhi@gmail.com",
    password: "rikhi123!",
  };
  await supertest(app)
    .post("/api/v1/user/login")
    .send(user)
    .expect(401)
    .then((res) => {
      expect(res.body.status).toBe("Unauthorized");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
test("GET /api/v1/user/profile", async () => {
  const user = {
    email: "rikhi@gmail.com",
    password: "Rikhi123!",
  };
  const res = await supertest(app).post("/api/v1/user/login").send(user);
  await supertest(app)
    .get("/api/v1/user/profile")
    .set("Authorization", `Bearer ${res.body.result.token}`)
    .expect(200)
    .then((res) => {
      expect(res.body.status).toBe("Success");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
test("PUT /api/v1/user/edit", async () => {
  const user = {
    email: "rikhi@gmail.com",
    password: "Rikhi123!",
  };
  const res = await supertest(app).post("/api/v1/user/login").send(user);
  const update = {
    fullName: "Rikhi Sobari",
  };
  await supertest(app)
    .put("/api/v1/user/edit")
    .set("Authorization", `Bearer ${res.body.result.token}`)
    .send(update)
    .expect(200)
    .then((res) => {
      expect(res.body.status).toBe("Success");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
test("PUT /api/v1/user/upload", async () => {
  const user = {
    email: "rikhi@gmail.com",
    password: "Rikhi123!",
  };
  const res = await supertest(app).post("/api/v1/user/login").send(user);
  await supertest(app)
    .put("/api/v1/user/upload")
    .set("Authorization", `Bearer ${res.body.result.token}`)
    .attach("image", "public/image.jpg")
    .expect(200)
    .then((res) => {
      expect(res.body.status).toBe("Success");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
test("DELETE /api/v1/user/delete-image", async () => {
  const user = {
    email: "rikhi@gmail.com",
    password: "Rikhi123!",
  };
  const res = await supertest(app).post("/api/v1/user/login").send(user);
  console.log(res.body.result.token);
  await supertest(app)
    .delete("/api/v1/user/delete-image")
    .set("Authorization", `Bearer ${res.body.result.token}`)
    .expect(200)
    .then((res) => {
      expect(res.body.status).toBe("Success");
      expect(res.body.message).toBeTruthy();
      expect(res.body.result).toBeTruthy();
    });
});
