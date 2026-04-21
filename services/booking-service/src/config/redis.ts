import Redis from "ioredis";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL not defined");
}

const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,

  retryStrategy: (times) => {
    console.log(`🔁 Redis reconnect attempt ${times}`);
    return Math.min(times * 100, 2000);
  },
});

redis.on("connect", () => {
  console.log("🔗 Redis Connecting...");
});

redis.on("ready", () => {
  console.log("✅ Redis Ready");
});

redis.on("error", (err) => {
  console.error("❌ Redis Error:", err.message);
});

export default redis;