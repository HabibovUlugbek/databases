/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */
const { MongoClient } = require("mongodb");

const CoinAPI = require("../CoinAPI");

class MongoBackend {
	constructor() {
		this.coinAPI = new CoinAPI();
		this.mongoUrl = "mongodb://localhost:37017/maxcoin";
		this.client = null;
		this.collection = null;
	}

	async connect() {
		const mongoClient = new MongoClient(this.mongoUrl);

		this.client = await mongoClient.connect();
		this.collection = this.client.db("maxcoin").collection("values");
		return this.client;
	}

	async disconnect() {
		if (this.client) {
			return this.client.close();
		}
		return false;
	}

	async insert() {}

	async getMax() {}

	async max() {
		console.info("Connecting to mongoDB");
		console.time("mongo");
		const client = await this.connect();
		if (client) {
			console.log("success to mongo");
		} else {
			throw new Error("connection failed to mongo");
		}
		console.timeEnd("mongo");
	}
}

module.exports = MongoBackend;
