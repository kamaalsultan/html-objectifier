const parser = require("./index");

describe("parseHTML", () => {
  it("should parse HTML string to an object", () => {
    const htmlString =
      '<div style="background-color: yellow;">Hello, world!</div>';
    const parsedObject = parser.parseHTML(htmlString);
    const expectedResult = {
      tag: "div",
      style: {
        "background-color": "yellow",
      },
      text: "Hello, world!",
    };
    expect(parsedObject).toEqual(expectedResult);
  });
});

jest.mock("fs");
const fs = require("fs");

describe("main", () => {
  it("should read an HTML file and parse it", () => {
    const mockHtmlContent = "<div>Hello, world!</div>";
    const mockParsedObject = {
      tag: "div",
      text: "Hello, world!",
    };
    fs.readFile.mockImplementation((filePath, encoding, callback) => {
      callback(null, mockHtmlContent);
    });

    const consoleLogSpy = jest.spyOn(console, "log");

    process.argv = ["node", "index.js", "markup.html"];

    parser();

    expect(consoleLogSpy).toHaveBeenCalledWith(
      JSON.stringify(mockParsedObject)
    );
  });
});
