export type JSendSuccess = {
  status: "success";
  data: any;
};

export type JSendFail = {
  status: "fail";
  data: any;
};

export type JSendError = {
  status: "error";
  message: string;
  code?: number;
  data?: any;
};

export type JSend = JSendSuccess | JSendFail | JSendError;

const jSend = {
  success: function (data: any): JSendSuccess {
    return {
      status: "success",
      data,
    };
  },

  fail: function (data: any): JSendFail {
    return {
      status: "fail",
      data,
    };
  },

  error: function (
    message: string,
    optional?: { code?: number; data?: any }
  ): JSendError {
    return {
      status: "error",
      message,
      ...(optional?.code && { code: optional.code }),
      ...(optional?.data && { data: optional.data }),
    };
  },

  isSuccess: function (ref: any): ref is JSendSuccess {
    return (
      typeof ref === "object" &&
      typeof ref.status === "string" &&
      ref.status === "success" &&
      ref.data !== undefined
    );
  },

  isFail: function (ref: any): ref is JSendFail {
    return (
      typeof ref === "object" &&
      typeof ref.status === "string" &&
      ref.status === "fail" &&
      ref.data !== undefined
    );
  },

  isError: function (ref: any): ref is JSendError {
    return (
      typeof ref === "object" &&
      typeof ref.status === "string" &&
      ref.status === "error" &&
      typeof ref.message === "string" &&
      (ref.code === undefined || typeof ref.message === "number")
    );
  },

  isValid: function (ref: any): ref is JSend {
    return this.isSuccess(ref) || this.isFail(ref) || this.isError(ref);
  },
};

export default jSend;
