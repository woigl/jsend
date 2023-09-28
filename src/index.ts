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

/** Definition of the JSend Middleware. */
export type JSendMiddleware = {
  /**
   *
   * @param jSendObject
   * @param httpStatusCode The HTTP status code to be used. If not defined then the default based on the type of the jSendObject will be used.
   */
  send: (jSendObject: JSend, httpStatusCode?: number) => void;

  /**
   * Creates and sends a **successful** jSend object.
   * @param data Wrapper for data of any data type. No data should be set to null.
   * @param httpStatusCode The HTTP status code (suppose to be in the 2xx range). If not defined then 200 will be used.
   */
  sendSuccess: (data: any, httpStatusCode?: number) => void;

  /**
   * Creates and sends a **failed** jSend object.
   * @param data Wrapper for data of any data type. This data should specify why the rquest failed.
   * @param httpStatusCode The HTTP status code (suppose to be in the 4xx range). If not defined then 400 will be used.
   */
  sendFail: (data: any, httpStatusCode?: number) => void;

  /**
   * Creates and sends an **error** jSend object.
   * @param message A meaningful, end-user-readable (or at the least log-worthy) message, explaining what went wrong.
   * @param optional Additional optional information of the error.
   * @param httpStatusCode The HTTP status code (suppose to be in the 5xx range). If not defined then 500 will be used.
   */
  sendError: (
    message: string,
    optional?: { code?: number; data?: any },
    httpStatusCode?: number
  ) => void;
};

/** The jSend object containing all functions. */
export const jSend = {
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

  middleware: function (_req: any, res: any, next: any) {
    const middleware: JSendMiddleware = {
      send: function (jSendObject: JSend, httpStatusCode?: number) {
        console.log("Calling Global");
        // res.status(httpStatusCode || 200).json(jSendObject);
        if (jSend.isSuccess(jSendObject)) {
          res.status(httpStatusCode || 200).json(jSendObject);
        } else if (jSend.isFail(jSendObject)) {
          res.status(httpStatusCode || 400).json(jSendObject);
        } else if (jSend.isError(jSendObject)) {
          res.status(httpStatusCode || 500).json(jSendObject);
        }
      },

      sendSuccess: function (data: any, httpStatusCode?: number) {
        console.log("Calling Success");
        res.status(httpStatusCode || 200).json(jSend.success(data));
      },

      sendFail: function (data: any, httpStatusCode?: number) {
        console.log("Calling Fail");
        res.status(httpStatusCode || 400).json(jSend.fail(data));
      },

      sendError: function (
        message: string,
        optional?: { code?: number; data?: any },
        httpStatusCode?: number
      ) {
        console.log("Calling Error");
        res.status(httpStatusCode || 500).json(jSend.error(message, optional));
      },
    };

    res.jSend = middleware;

    next();
  },
};
