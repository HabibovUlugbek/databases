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

	async insert() {
		const data = await this.coinAPI.fetch();
		const documents = [];

		Object.entries(data.bpi).forEach((entry) => {
			documents.push({
				date: entry[0],
				value: entry[1],
			});
		});

		return this.collection.insertMany(documents);
	}

	async getMax() {
		return this.collection.findOne({}, { sort: { value: -1 } });
	}

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

		console.time("insert");
		const insertResults = await this.insert();
		console.log(insertResults);
		console.timeEnd("insert");

		console.time("max");
		const max = await this.getMax();
		console.log(max);
		console.timeEnd("max");

		console.info("Disconnecting to mongoDB");
		await this.disconnect();
	}
}

module.exports = MongoBackend;
