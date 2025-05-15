const fs = require("fs");
const path = require("path");

const seedDataDir = path.join(__dirname, "seedData");

function deepFixDates(obj) {
  if (Array.isArray(obj)) {
    return obj.map(deepFixDates);
  } else if (obj !== null && typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      if (typeof obj[key] === "string" && key.toLowerCase().includes("date")) {
        const date = new Date(obj[key]);
        newObj[key] = date.toISOString();
      } else {
        newObj[key] = deepFixDates(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

fs.readdirSync(seedDataDir).forEach(file => {
  const filePath = path.join(seedDataDir, file);
  if (file.endsWith(".json")) {
    const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const fixedContent = deepFixDates(content);
    fs.writeFileSync(filePath, JSON.stringify(fixedContent, null, 2), "utf-8");
    console.log(`Fixed dates in ${file}`);
  }
});
