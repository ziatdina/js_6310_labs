import { test, expect, jest } from "@jest/globals";

const runServerMock = jest.fn();
jest.unstable_mockModule("../src/server.js", () => ({ default: runServerMock }));

await import("../src/index.js");

test("index.js calls runServer()", () => {
  expect(runServerMock).toHaveBeenCalled();
});