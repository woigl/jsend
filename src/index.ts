/** jSend success object. */
export type JSendSuccess = {
  /** Should always be set to "success". */
  status: "success";
  /** Wrapper for data of any data type. No data should be set to null.  */
  data: any;
};

/** jSend fail object. */
export type JSendFail = {
  /** Should always be set to "fail". */
  status: "fail";
  /** Wrapper for data of any data type. This data should specify why the rquest failed.  */
  data: any;
};

/** jSend error object. */
export type JSendError = {
  /** Should always be set to "error". */
  status: "error";
  /** A meaningful, end-user-readable (or at the least log-worthy) message, explaining what went wrong. */
  message: string;
  /** A numeric code corresponding to the error, if applicable. */
  code?: number;
  /** A generic container for any other information about the error, i.e. the conditions that caused the error, stack traces, etc. */
  data?: any;
};

/** Union of `JSendSuccess`, `JSendFail`, and `JSendError`. */
export type JSend = JSendSuccess | JSendFail | JSendError;

/** The jSend object containing all functions. */
const jSend = {
  /**
   * Creates a **successful** jSend object.
   * @param data Wrapper for data of any data type. No data should be set to null.
   * @returns Returns a successful jSend object.
   */
  success: function (data: any): JSendSuccess {
    return {
      status: "success",
      data,
    };
  },

  /**
   * Creates a **failed** jSend object.
   * @param data Wrapper for data of any data type. This data should specify why the rquest failed.
   * @returns Returns a failed jSend object.
   */
  fail: function (data: any): JSendFail {
    return {
      status: "fail",
      data,
    };
  },

  /**
   * Creates an **error** jSend object.
   * @param message A meaningful, end-user-readable (or at the least log-worthy) message, explaining what went wrong.
   * @param optional Additional optional information of the error.
   * @returns
   */
  error: function (
    message: string,
    optional?: {
      /** A numeric code corresponding to the error, if applicable. */
      code?: number;
      /** A generic container for any other information about the error, i.e. the conditions that caused the error, stack traces, etc. */
      data?: any;
    }
  ): JSendError {
    return {
      status: "error",
      message,
      ...(optional?.code && { code: optional.code }),
      ...(optional?.data && { data: optional.data }),
    };
  },

  /**
   * Testing if the `ref` parameter is a valid jSend success object.
   * @param ref The `ref` parameter to be tested.
   * @returns True if the `ref` parameter is a valid jSend success object, otherwise false;
   */
  isSuccess: function (ref: any): ref is JSendSuccess {
    return (
      typeof ref === "object" &&
      typeof ref.status === "string" &&
      ref.status === "success" &&
      ref.data !== undefined
    );
  },

  /**
   * Testing if the `ref` parameter is a valid jSend failed object.
   * @param ref The `ref` parameter to be tested.
   * @returns True if the `ref` parameter is a valid jSend failed object, otherwise false;
   */
  isFail: function (ref: any): ref is JSendFail {
    return (
      typeof ref === "object" &&
      typeof ref.status === "string" &&
      ref.status === "fail" &&
      ref.data !== undefined
    );
  },

  /**
   * Testing if the `ref` parameter is a valid jSend error object.
   * @param ref The `ref` parameter to be tested.
   * @returns True if the `ref` parameter is a valid jSend error object, otherwise false;
   */
  isError: function (ref: any): ref is JSendError {
    return (
      typeof ref === "object" &&
      typeof ref.status === "string" &&
      ref.status === "error" &&
      typeof ref.message === "string" &&
      (ref.code === undefined || typeof ref.message === "number")
    );
  },

  /**
   * Testing if the `ref` parameter is one of [{@link jSend.isSuccess}, {@link jSend.isFail}, {@link jSend.isError}].
   * @param ref The `ref` parameter to be tested.
   * @returns True if the `ref` parameter is one of [{@link jSend.isSuccess}, {@link jSend.isFail}, {@link jSend.isError}], otherwise false.
   */
  isValid: function (ref: any): ref is JSend {
    return this.isSuccess(ref) || this.isFail(ref) || this.isError(ref);
  },
};

export default jSend;
