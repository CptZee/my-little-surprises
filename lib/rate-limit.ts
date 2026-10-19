
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const submissionRateLimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(3, "1 h"),
    prefix: "my-little-surprises:submissions",
});
