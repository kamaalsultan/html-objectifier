const fs = require("fs");
const prune = require("json-prune");

exports.parseHTML = function parseHTML(html) {
  const htmlObject = {};

  const tagRegex = /<(?!!)(?!meta)([^/][^>]+)>/g;
  const attributeRegex = /(\S+)="([^"]+)"/g;
  const styleRegex = /style="([^"]+)"/;

  const stack = [htmlObject];
  let match;
  let lastIndex = 0;

  while ((match = tagRegex.exec(html))) {
    const tag = match[1];
    const parent = stack[stack.length - 1];

    if (tag.startsWith("/")) {
      stack.pop();
    } else {
      const element = { tag: tag.split(" ")[0] };

      let attrMatch;
      while ((attrMatch = attributeRegex.exec(tag))) {
        const [_, attr, value] = attrMatch;
        if (attr === "style") {
          const styleMatch = styleRegex.exec(tag);
          if (styleMatch) {
            const styleAttrs = styleMatch[1].split(";");
            styleAttrs.forEach((styleAttr) => {
              const [styleProp, styleValue] = styleAttr
                .split(":")
                .map((s) => s.trim());
              if (styleProp && styleValue) {
                element.style[styleProp] = styleValue;
              }
            });
          }
        } else {
          element[attr] = value;
        }
      }

      if (parent.children) parent.children.push(element);
      else parent.children = [element];
      stack.push(element);

      lastIndex = tagRegex.lastIndex;
      const textContent = html
        .substring(lastIndex, html.indexOf("<", lastIndex))
        .trim();
      if (textContent) {
        element.text = textContent;
      }
    }
  }

  return htmlObject.children[0];
};

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
