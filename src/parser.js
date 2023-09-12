module.exports = function parseHTML(html) {
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
