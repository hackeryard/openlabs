// public/scripts/guard.cjs
require("dotenv").config();
require("dotenv").config({ path: ".env.local" });

require("@hackeryard/mandatory-guard").initGuard();
