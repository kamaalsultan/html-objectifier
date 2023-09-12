const fs = require("fs");
const prune = require("json-prune");
const parseHTML = require("./src/parser");

const fileName = process.argv[2];
if (!fileName) {
  console.error("Please provide an HTML file as an argument.");
  process.exit(1);
}

fs.readFile(fileName, "utf8", (err, data) => {
  if (err) {
    console.error(`Error reading the file: ${err}`);
    process.exit(1);
  }

  const htmlObject = parseHTML(data);
  try {
    console.log(JSON.stringify(htmlObject));
  } catch (e) {
    console.log(prune(htmlObject));
  }
});
