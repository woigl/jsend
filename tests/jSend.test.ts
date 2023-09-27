import jSend from "../src";

// test("adds two numbers correctly", () => {
//   const result = add(2, 3);
//   expect(result).toBe(5);
// });

test("check the function isSuccess", () => {
  const obj = {
    status: "success",
    data: null,
  };

  const isJSendSuccess = jSend.isSuccess(obj);

  expect(isJSendSuccess).toBeTruthy();
});
