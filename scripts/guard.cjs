// public/scripts/guard.cjs
require("dotenv").config({ path: ".env.local" });
require("dotenv").config({ path: ".env" });

if (!process.env.CHATBOT_API_KEY) {
  process.env.CHATBOT_API_KEY =
    process.env.CHATBOT_API_KEYS ||
    process.env.CHATBOT_API_KEY_1 ||
    process.env.OPENROUTER_API_KEY ||
    process.env.OPENROUTER_API_KEY_1;
}

require("@hackeryard/mandatory-guard").initGuard();