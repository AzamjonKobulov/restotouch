const { copyFileSync, existsSync } = require("fs");
const { join } = require("path");

const indexPath = join(__dirname, "..", "public", "index.html");
const homePath = join(__dirname, "..", "public", "home.html");

if (!existsSync(indexPath)) {
  console.error("copy-home: public/index.html not found");
  process.exit(1);
}

copyFileSync(indexPath, homePath);
console.log("copy-home: public/home.html created from index.html");
