const fs = require("fs");
const path = require("path");

describe("service-worker precache list", () => {
  const swSrc = fs.readFileSync(
    path.join(__dirname, "../public/service-worker.js"),
    "utf8"
  );

  it("includes currencies.json in the PRECACHE_FILES array", () => {
    expect(swSrc).toMatch(/currencies\.json/);
  });

  it("includes root index.html", () => {
    expect(swSrc).toMatch(/index\.html/);
  });
}); 