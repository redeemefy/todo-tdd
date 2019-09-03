const request = require('supertest')
const app = require('../../app')
const newTodo = require('../mock-data/new-todo.json')
const singleTodo = require('../mock-data/single-todo.json')

const endpointUrl = '/todos'
const testData = { title: 'Make integration test for PUT', done: true }
let firstTodo

describe(`${endpointUrl}`, () => {
	it(`GET ${endpointUrl}`, async () => {
		const response = await request(app)
		.get(endpointUrl)
		
		expect(response.statusCode).toBe(200)
		expect(Array.isArray(response.body)).toBeTruthy()
		expect(response.body[0].title).toBeDefined()
		expect(response.body[0].done).toBeDefined()
		firstTodo = response.body[0]
	})
	it(`GET by id in ${endpointUrl}/:todoId`, async () => {
		const response = await request(app)
		.get(`${endpointUrl}/${firstTodo._id}`)
		
		expect(response.statusCode).toBe(200)
		expect(response.body.title).toBe(firstTodo.title)
		expect(response.body.done).toBe(firstTodo.done)
	})
	it(`GET todoById doesnt exist in ${endpointUrl}`, async () => {
		const response = await request(app)
		.get(`${endpointUrl}/5d6d5c695707df5c3c93a709`)
		
		expect(response.statusCode).toBe(404)
	})
	it(`should create resource at ${endpointUrl}`, async () => {
		const response = await request(app)
		.post(endpointUrl)
		.send(newTodo)
		expect(response.statusCode).toBe(201)
		expect(response.body.title).toBe(newTodo.title)
		expect(response.body.done).toBe(newTodo.done)
	})
	it(`should return error 500 on malformed data on POST ${endpointUrl}`, async () => {
		const response = await request(app)
		.post(endpointUrl)
		.send({ title: 'Missing done property' })
		
		expect(response.statusCode).toBe(500)
		expect(response.body).toStrictEqual({ message: 'Todo validation failed: done: Path `done` is required.' })
	})
	it(`PUT ${endpointUrl}`, async () => {
		const response = await request(app)
		.put(`${endpointUrl}/${firstTodo._id}`)
		.send(testData)
		
		expect(response.statusCode).toBe(200)
		expect(response.body.title).toBe(testData.title)
		expect(response.body.done).toBe(testData.done)
	})
	it(`DELETE ${endpointUrl}`, async () => {
		const response = await request(app)
			.delete(`${endpointUrl}/${firstTodo._id}`)

		expect(response.body.title).toBe(testData.title)

		const secondResponse = await request(app)
			.delete(`${endpointUrl}/${firstTodo._id}`)
		
		expect(secondResponse.statusCode).toBe(404)
	})
})
