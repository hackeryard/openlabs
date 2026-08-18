// public/scripts/guard.cjs
process.env.DOTENV_CONFIG_QUIET = "true";
process.env.DOTENVX_LOG = "error";
process.env.BROWSERSLIST_IGNORE_OLD_DATA = "true";
require("dotenv").config({ path: ".env.local", quiet: true });
require("dotenv").config({ path: ".env", quiet: true });

if (!process.env.CHATBOT_API_KEY) {
  process.env.CHATBOT_API_KEY =
    process.env.CHATBOT_API_KEYS ||
    process.env.CHATBOT_API_KEY_1 ||
    process.env.OPENROUTER_API_KEY ||
    process.env.OPENROUTER_API_KEY_1;
}

require("@hackeryard/mandatory-guard").initGuard();