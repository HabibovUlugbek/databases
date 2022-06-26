/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */
const Redis = require("ioredis");

const CoinAPI = require("../CoinAPI");

class RedisBackend {
	constructor() {
		this.coinAPI = new CoinAPI();
		this.client = null;
	}

	async connect() {
		this.client = new Redis(7379);
		return this.client;
	}

	async disconnect() {
		this.client.disconnect();
	}

	async insert() {
		const data = await this.coinAPI.fetch();
		const values = [];
		Object.entries(data.bpi).forEach((entries) => {
			values.push(entries[1]);
			values.push(entries[0]);
		});

		return this.client.zadd("maxcoin", values);
	}

	async getMax() {
		return this.client.zrange("maxcoin:values", -1, -1, "WITHSCORES");
	}

	async max() {
		console.info("Connecting to Redis");
		console.time("redis");
		const client = this.connect();
		if (client) {
			console.log("success to redis");
		} else {
			throw new Error("connection failed to redis");
		}
		console.timeEnd("redis");

		console.time("insert");
		const insertResults = await this.insert();
		console.log(insertResults);
		console.timeEnd("insert");

		console.time("max");
		const max = await this.getMax();
		console.log(max);
		console.timeEnd("max");

		console.info("Disconnecting to Redis");
		await this.disconnect();
		return max;
	}
}

module.exports = RedisBackend;
