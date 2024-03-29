const MongoBackend = require("./services/backend/MongoBackend");
const RedisBackend = require("./services/backend/RedisBackend");

async function runRedis() {
	const redisBackend = new RedisBackend();
	return redisBackend.max();
}
async function runMongo() {
	const mongoBackend = new MongoBackend();
	return mongoBackend.max();
}

runRedis()
	.then((result) => {
		console.log(result);
	})
	.catch((err) => console.error(err));
