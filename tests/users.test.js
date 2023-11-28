const request = require("supertest");
const database = require("../database");

afterAll(() => database.end());

const app = require("../src/app");

describe("GET /api/users", () => {
	it("should return all users", async () => {
		const response = await request(app).get("/api/users");

		expect(response.headers["content-type"]).toMatch(/json/);

		expect(response.status).toEqual(200);
	});
});

describe("GET /api/users/:id", () => {
	it("should return one user", async () => {
		const response = await request(app).get("/api/users/1");

		expect(response.headers["content-type"]).toMatch(/json/);

		expect(response.status).toEqual(200);
	});

	it("should return no user", async () => {
		const response = await request(app).get("/api/users/0");

		expect(response.status).toEqual(404);
	});
});
const crypto = require("node:crypto");

describe("POST /api/users", () => {
	it("should return created user", async () => {
		const newUser = {
			firstname: "Marie",
			lastname: "Martin",
			email: `${crypto.randomUUID()}@wild.co`,
			city: "Paris",
			language: "French",
		};
		const response = await request(app).post("/api/users").send(newUser);
		expect(response.status).toEqual(201);
		expect(response.body).toHaveProperty("id");
		expect(typeof response.body.id).toBe("number");
		const [result] = await database.query(
			"SELECT * FROM users WHERE id=?",

			response.body.id
		);
		const [userInDatabase] = result;

		expect(userInDatabase).toHaveProperty("id");

		expect(userInDatabase).toHaveProperty("firstname");

		expect(userInDatabase).toHaveProperty("lastname");

		expect(userInDatabase).toHaveProperty("email");

		expect(userInDatabase).toHaveProperty("city");

		expect(userInDatabase).toHaveProperty("language");

		expect(userInDatabase.firstname).toStrictEqual(newUser.firstname);
	});
});

describe("PUT /api/users/:id", () => {
	it("should edit user", async () => {
		const newUser = {
			firstname: "Vincent",
			lastname: "Louvart",
			email: `${crypto.randomUUID()}@wild.co`,
			city: "Nantes",
			language: "French",
		};

		const [result] = await database.query(
			"INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
			[
				newUser.firstname,
				newUser.lastname,
				newUser.email,
				newUser.city,
				newUser.language,
			]
		);

		const id = result.insertId;

		const updatedUser = {
			firstname: "Vince",
			lastname: "Louv",
			email: `${crypto.randomUUID()}@wild.co`,
			city: "Nantes",
			language: "French",
		};

		const response = await request(app)
			.put(`/api/users/${id}`)
			.send(updatedUser);

		expect(response.status).toEqual(204);

		const [results] = await database.query(
			"SELECT * FROM users WHERE id=?",
			id
		);

		const [userInDatabase] = results;

		expect(userInDatabase).toHaveProperty("id");
		expect(userInDatabase.firstname).toStrictEqual(updatedUser.firstname);
		expect(userInDatabase.lastname).toStrictEqual(updatedUser.lastname);
		expect(userInDatabase.email).toStrictEqual(updatedUser.email);
		expect(userInDatabase.city).toStrictEqual(updatedUser.city);
		expect(userInDatabase.language).toStrictEqual(updatedUser.language);
	});

	it("should return an error", async () => {
		const userWithMissingProps = { firstname: "Eric" };

		const response = await request(app)
			.put(`/api/users/1`)
			.send(userWithMissingProps);

		expect(response.status >= 500 && response.status < 600).toBe(true);
	});

	it("should return no user", async () => {
		const newUser = {
			firstname: "Vincent",
			lastname: "Louvart",
			email: `${crypto.randomUUID()}@wild.co`,
			city: "Nantes",
			language: "French",
		};

		const response = await request(app).put("/api/users/0").send(newUser);

		expect(response.status).toEqual(404);
	});
});
describe("DELETE /api/users/:id", () => {
	it("should delete one user", async () => {
		const response = await request(app).delete("/api/users/1");

		expect(response.headers["content-type"]).toMatch(/json/);

		expect(response.status).toEqual(204);
	});

	it("should return no user", async () => {
		const response = await request(app).delete("/api/users/0");

		expect(response.status).toEqual(404);
	});
});