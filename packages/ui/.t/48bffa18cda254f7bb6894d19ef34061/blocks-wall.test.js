describe("Blocks/Wall", () => {
  describe("Composition", () => {
    it("smoke-test", async () => {
      const testFn = async () => {
        const context = {
          id: "blocks-wall--composition",
          title: "Blocks/Wall",
          name: "Composition"
        };
        if (globalThis.__sbPreVisit) {
          await globalThis.__sbPreVisit(page, context);
        }
        let result;
        try {
          result = await page.evaluate(({
            id,
            hasPlayFn
          }) => __test(id, hasPlayFn), {
            id: "blocks-wall--composition"
          });
        } catch (err) {
          if (err.toString().includes('Execution context was destroyed')) {
            throw err;
          } else {
            if (globalThis.__sbPostVisit) {
              await globalThis.__sbPostVisit(page, {
                ...context,
                hasFailure: true
              });
            }
            throw err;
          }
        }
        if (globalThis.__sbPostVisit) {
          await globalThis.__sbPostVisit(page, context);
        }
        if (globalThis.__sbCollectCoverage) {
          const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);
          if (!isCoverageSetupCorrectly) {
            throw new Error(`[Test runner] An error occurred when evaluating code coverage:
The code in this story is not instrumented, which means the coverage setup is likely not correct.
More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage`);
          }
          await jestPlaywright.saveCoverage(page);
        }
        return result;
      };
      try {
        await testFn();
      } catch (err) {
        if (err.toString().includes('Execution context was destroyed')) {
          console.log(`An error occurred in the following story, most likely because of a navigation: "${"Blocks/Wall"}/${"Composition"}". Retrying...`);
          await jestPlaywright.resetPage();
          await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
          await testFn();
        } else {
          throw err;
        }
      }
    });
  });
  describe("Composition Phone", () => {
    it("smoke-test", async () => {
      const testFn = async () => {
        const context = {
          id: "blocks-wall--composition-phone",
          title: "Blocks/Wall",
          name: "Composition Phone"
        };
        if (globalThis.__sbPreVisit) {
          await globalThis.__sbPreVisit(page, context);
        }
        let result;
        try {
          result = await page.evaluate(({
            id,
            hasPlayFn
          }) => __test(id, hasPlayFn), {
            id: "blocks-wall--composition-phone"
          });
        } catch (err) {
          if (err.toString().includes('Execution context was destroyed')) {
            throw err;
          } else {
            if (globalThis.__sbPostVisit) {
              await globalThis.__sbPostVisit(page, {
                ...context,
                hasFailure: true
              });
            }
            throw err;
          }
        }
        if (globalThis.__sbPostVisit) {
          await globalThis.__sbPostVisit(page, context);
        }
        if (globalThis.__sbCollectCoverage) {
          const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);
          if (!isCoverageSetupCorrectly) {
            throw new Error(`[Test runner] An error occurred when evaluating code coverage:
The code in this story is not instrumented, which means the coverage setup is likely not correct.
More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage`);
          }
          await jestPlaywright.saveCoverage(page);
        }
        return result;
      };
      try {
        await testFn();
      } catch (err) {
        if (err.toString().includes('Execution context was destroyed')) {
          console.log(`An error occurred in the following story, most likely because of a navigation: "${"Blocks/Wall"}/${"Composition Phone"}". Retrying...`);
          await jestPlaywright.resetPage();
          await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
          await testFn();
        } else {
          throw err;
        }
      }
    });
  });
  describe("Composition French", () => {
    it("smoke-test", async () => {
      const testFn = async () => {
        const context = {
          id: "blocks-wall--composition-french",
          title: "Blocks/Wall",
          name: "Composition French"
        };
        if (globalThis.__sbPreVisit) {
          await globalThis.__sbPreVisit(page, context);
        }
        let result;
        try {
          result = await page.evaluate(({
            id,
            hasPlayFn
          }) => __test(id, hasPlayFn), {
            id: "blocks-wall--composition-french"
          });
        } catch (err) {
          if (err.toString().includes('Execution context was destroyed')) {
            throw err;
          } else {
            if (globalThis.__sbPostVisit) {
              await globalThis.__sbPostVisit(page, {
                ...context,
                hasFailure: true
              });
            }
            throw err;
          }
        }
        if (globalThis.__sbPostVisit) {
          await globalThis.__sbPostVisit(page, context);
        }
        if (globalThis.__sbCollectCoverage) {
          const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);
          if (!isCoverageSetupCorrectly) {
            throw new Error(`[Test runner] An error occurred when evaluating code coverage:
The code in this story is not instrumented, which means the coverage setup is likely not correct.
More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage`);
          }
          await jestPlaywright.saveCoverage(page);
        }
        return result;
      };
      try {
        await testFn();
      } catch (err) {
        if (err.toString().includes('Execution context was destroyed')) {
          console.log(`An error occurred in the following story, most likely because of a navigation: "${"Blocks/Wall"}/${"Composition French"}". Retrying...`);
          await jestPlaywright.resetPage();
          await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
          await testFn();
        } else {
          throw err;
        }
      }
    });
  });
  describe("Composition French Phone", () => {
    it("smoke-test", async () => {
      const testFn = async () => {
        const context = {
          id: "blocks-wall--composition-french-phone",
          title: "Blocks/Wall",
          name: "Composition French Phone"
        };
        if (globalThis.__sbPreVisit) {
          await globalThis.__sbPreVisit(page, context);
        }
        let result;
        try {
          result = await page.evaluate(({
            id,
            hasPlayFn
          }) => __test(id, hasPlayFn), {
            id: "blocks-wall--composition-french-phone"
          });
        } catch (err) {
          if (err.toString().includes('Execution context was destroyed')) {
            throw err;
          } else {
            if (globalThis.__sbPostVisit) {
              await globalThis.__sbPostVisit(page, {
                ...context,
                hasFailure: true
              });
            }
            throw err;
          }
        }
        if (globalThis.__sbPostVisit) {
          await globalThis.__sbPostVisit(page, context);
        }
        if (globalThis.__sbCollectCoverage) {
          const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);
          if (!isCoverageSetupCorrectly) {
            throw new Error(`[Test runner] An error occurred when evaluating code coverage:
The code in this story is not instrumented, which means the coverage setup is likely not correct.
More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage`);
          }
          await jestPlaywright.saveCoverage(page);
        }
        return result;
      };
      try {
        await testFn();
      } catch (err) {
        if (err.toString().includes('Execution context was destroyed')) {
          console.log(`An error occurred in the following story, most likely because of a navigation: "${"Blocks/Wall"}/${"Composition French Phone"}". Retrying...`);
          await jestPlaywright.resetPage();
          await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
          await testFn();
        } else {
          throw err;
        }
      }
    });
  });
  describe("Brick", () => {
    it("smoke-test", async () => {
      const testFn = async () => {
        const context = {
          id: "blocks-wall--brick",
          title: "Blocks/Wall",
          name: "Brick"
        };
        if (globalThis.__sbPreVisit) {
          await globalThis.__sbPreVisit(page, context);
        }
        let result;
        try {
          result = await page.evaluate(({
            id,
            hasPlayFn
          }) => __test(id, hasPlayFn), {
            id: "blocks-wall--brick"
          });
        } catch (err) {
          if (err.toString().includes('Execution context was destroyed')) {
            throw err;
          } else {
            if (globalThis.__sbPostVisit) {
              await globalThis.__sbPostVisit(page, {
                ...context,
                hasFailure: true
              });
            }
            throw err;
          }
        }
        if (globalThis.__sbPostVisit) {
          await globalThis.__sbPostVisit(page, context);
        }
        if (globalThis.__sbCollectCoverage) {
          const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);
          if (!isCoverageSetupCorrectly) {
            throw new Error(`[Test runner] An error occurred when evaluating code coverage:
The code in this story is not instrumented, which means the coverage setup is likely not correct.
More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage`);
          }
          await jestPlaywright.saveCoverage(page);
        }
        return result;
      };
      try {
        await testFn();
      } catch (err) {
        if (err.toString().includes('Execution context was destroyed')) {
          console.log(`An error occurred in the following story, most likely because of a navigation: "${"Blocks/Wall"}/${"Brick"}". Retrying...`);
          await jestPlaywright.resetPage();
          await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
          await testFn();
        } else {
          throw err;
        }
      }
    });
  });
  describe("Zellige", () => {
    it("smoke-test", async () => {
      const testFn = async () => {
        const context = {
          id: "blocks-wall--zellige",
          title: "Blocks/Wall",
          name: "Zellige"
        };
        if (globalThis.__sbPreVisit) {
          await globalThis.__sbPreVisit(page, context);
        }
        let result;
        try {
          result = await page.evaluate(({
            id,
            hasPlayFn
          }) => __test(id, hasPlayFn), {
            id: "blocks-wall--zellige"
          });
        } catch (err) {
          if (err.toString().includes('Execution context was destroyed')) {
            throw err;
          } else {
            if (globalThis.__sbPostVisit) {
              await globalThis.__sbPostVisit(page, {
                ...context,
                hasFailure: true
              });
            }
            throw err;
          }
        }
        if (globalThis.__sbPostVisit) {
          await globalThis.__sbPostVisit(page, context);
        }
        if (globalThis.__sbCollectCoverage) {
          const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);
          if (!isCoverageSetupCorrectly) {
            throw new Error(`[Test runner] An error occurred when evaluating code coverage:
The code in this story is not instrumented, which means the coverage setup is likely not correct.
More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage`);
          }
          await jestPlaywright.saveCoverage(page);
        }
        return result;
      };
      try {
        await testFn();
      } catch (err) {
        if (err.toString().includes('Execution context was destroyed')) {
          console.log(`An error occurred in the following story, most likely because of a navigation: "${"Blocks/Wall"}/${"Zellige"}". Retrying...`);
          await jestPlaywright.resetPage();
          await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
          await testFn();
        } else {
          throw err;
        }
      }
    });
  });
  describe("Ridge", () => {
    it("smoke-test", async () => {
      const testFn = async () => {
        const context = {
          id: "blocks-wall--ridge",
          title: "Blocks/Wall",
          name: "Ridge"
        };
        if (globalThis.__sbPreVisit) {
          await globalThis.__sbPreVisit(page, context);
        }
        let result;
        try {
          result = await page.evaluate(({
            id,
            hasPlayFn
          }) => __test(id, hasPlayFn), {
            id: "blocks-wall--ridge"
          });
        } catch (err) {
          if (err.toString().includes('Execution context was destroyed')) {
            throw err;
          } else {
            if (globalThis.__sbPostVisit) {
              await globalThis.__sbPostVisit(page, {
                ...context,
                hasFailure: true
              });
            }
            throw err;
          }
        }
        if (globalThis.__sbPostVisit) {
          await globalThis.__sbPostVisit(page, context);
        }
        if (globalThis.__sbCollectCoverage) {
          const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);
          if (!isCoverageSetupCorrectly) {
            throw new Error(`[Test runner] An error occurred when evaluating code coverage:
The code in this story is not instrumented, which means the coverage setup is likely not correct.
More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage`);
          }
          await jestPlaywright.saveCoverage(page);
        }
        return result;
      };
      try {
        await testFn();
      } catch (err) {
        if (err.toString().includes('Execution context was destroyed')) {
          console.log(`An error occurred in the following story, most likely because of a navigation: "${"Blocks/Wall"}/${"Ridge"}". Retrying...`);
          await jestPlaywright.resetPage();
          await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
          await testFn();
        } else {
          throw err;
        }
      }
    });
  });
  describe("Plaster", () => {
    it("smoke-test", async () => {
      const testFn = async () => {
        const context = {
          id: "blocks-wall--plaster",
          title: "Blocks/Wall",
          name: "Plaster"
        };
        if (globalThis.__sbPreVisit) {
          await globalThis.__sbPreVisit(page, context);
        }
        let result;
        try {
          result = await page.evaluate(({
            id,
            hasPlayFn
          }) => __test(id, hasPlayFn), {
            id: "blocks-wall--plaster"
          });
        } catch (err) {
          if (err.toString().includes('Execution context was destroyed')) {
            throw err;
          } else {
            if (globalThis.__sbPostVisit) {
              await globalThis.__sbPostVisit(page, {
                ...context,
                hasFailure: true
              });
            }
            throw err;
          }
        }
        if (globalThis.__sbPostVisit) {
          await globalThis.__sbPostVisit(page, context);
        }
        if (globalThis.__sbCollectCoverage) {
          const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);
          if (!isCoverageSetupCorrectly) {
            throw new Error(`[Test runner] An error occurred when evaluating code coverage:
The code in this story is not instrumented, which means the coverage setup is likely not correct.
More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage`);
          }
          await jestPlaywright.saveCoverage(page);
        }
        return result;
      };
      try {
        await testFn();
      } catch (err) {
        if (err.toString().includes('Execution context was destroyed')) {
          console.log(`An error occurred in the following story, most likely because of a navigation: "${"Blocks/Wall"}/${"Plaster"}". Retrying...`);
          await jestPlaywright.resetPage();
          await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
          await testFn();
        } else {
          throw err;
        }
      }
    });
  });
  describe("Polaroid", () => {
    it("smoke-test", async () => {
      const testFn = async () => {
        const context = {
          id: "blocks-wall--polaroid",
          title: "Blocks/Wall",
          name: "Polaroid"
        };
        if (globalThis.__sbPreVisit) {
          await globalThis.__sbPreVisit(page, context);
        }
        let result;
        try {
          result = await page.evaluate(({
            id,
            hasPlayFn
          }) => __test(id, hasPlayFn), {
            id: "blocks-wall--polaroid"
          });
        } catch (err) {
          if (err.toString().includes('Execution context was destroyed')) {
            throw err;
          } else {
            if (globalThis.__sbPostVisit) {
              await globalThis.__sbPostVisit(page, {
                ...context,
                hasFailure: true
              });
            }
            throw err;
          }
        }
        if (globalThis.__sbPostVisit) {
          await globalThis.__sbPostVisit(page, context);
        }
        if (globalThis.__sbCollectCoverage) {
          const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);
          if (!isCoverageSetupCorrectly) {
            throw new Error(`[Test runner] An error occurred when evaluating code coverage:
The code in this story is not instrumented, which means the coverage setup is likely not correct.
More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage`);
          }
          await jestPlaywright.saveCoverage(page);
        }
        return result;
      };
      try {
        await testFn();
      } catch (err) {
        if (err.toString().includes('Execution context was destroyed')) {
          console.log(`An error occurred in the following story, most likely because of a navigation: "${"Blocks/Wall"}/${"Polaroid"}". Retrying...`);
          await jestPlaywright.resetPage();
          await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
          await testFn();
        } else {
          throw err;
        }
      }
    });
  });
  describe("Pinned Note", () => {
    it("smoke-test", async () => {
      const testFn = async () => {
        const context = {
          id: "blocks-wall--pinned-note",
          title: "Blocks/Wall",
          name: "Pinned Note"
        };
        if (globalThis.__sbPreVisit) {
          await globalThis.__sbPreVisit(page, context);
        }
        let result;
        try {
          result = await page.evaluate(({
            id,
            hasPlayFn
          }) => __test(id, hasPlayFn), {
            id: "blocks-wall--pinned-note"
          });
        } catch (err) {
          if (err.toString().includes('Execution context was destroyed')) {
            throw err;
          } else {
            if (globalThis.__sbPostVisit) {
              await globalThis.__sbPostVisit(page, {
                ...context,
                hasFailure: true
              });
            }
            throw err;
          }
        }
        if (globalThis.__sbPostVisit) {
          await globalThis.__sbPostVisit(page, context);
        }
        if (globalThis.__sbCollectCoverage) {
          const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);
          if (!isCoverageSetupCorrectly) {
            throw new Error(`[Test runner] An error occurred when evaluating code coverage:
The code in this story is not instrumented, which means the coverage setup is likely not correct.
More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage`);
          }
          await jestPlaywright.saveCoverage(page);
        }
        return result;
      };
      try {
        await testFn();
      } catch (err) {
        if (err.toString().includes('Execution context was destroyed')) {
          console.log(`An error occurred in the following story, most likely because of a navigation: "${"Blocks/Wall"}/${"Pinned Note"}". Retrying...`);
          await jestPlaywright.resetPage();
          await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
          await testFn();
        } else {
          throw err;
        }
      }
    });
  });
  describe("Shop Sign", () => {
    it("smoke-test", async () => {
      const testFn = async () => {
        const context = {
          id: "blocks-wall--shop-sign",
          title: "Blocks/Wall",
          name: "Shop Sign"
        };
        if (globalThis.__sbPreVisit) {
          await globalThis.__sbPreVisit(page, context);
        }
        let result;
        try {
          result = await page.evaluate(({
            id,
            hasPlayFn
          }) => __test(id, hasPlayFn), {
            id: "blocks-wall--shop-sign"
          });
        } catch (err) {
          if (err.toString().includes('Execution context was destroyed')) {
            throw err;
          } else {
            if (globalThis.__sbPostVisit) {
              await globalThis.__sbPostVisit(page, {
                ...context,
                hasFailure: true
              });
            }
            throw err;
          }
        }
        if (globalThis.__sbPostVisit) {
          await globalThis.__sbPostVisit(page, context);
        }
        if (globalThis.__sbCollectCoverage) {
          const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);
          if (!isCoverageSetupCorrectly) {
            throw new Error(`[Test runner] An error occurred when evaluating code coverage:
The code in this story is not instrumented, which means the coverage setup is likely not correct.
More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage`);
          }
          await jestPlaywright.saveCoverage(page);
        }
        return result;
      };
      try {
        await testFn();
      } catch (err) {
        if (err.toString().includes('Execution context was destroyed')) {
          console.log(`An error occurred in the following story, most likely because of a navigation: "${"Blocks/Wall"}/${"Shop Sign"}". Retrying...`);
          await jestPlaywright.resetPage();
          await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
          await testFn();
        } else {
          throw err;
        }
      }
    });
  });
});