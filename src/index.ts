/** jSend success object. */
export type JSendSuccess = {
    /** Should always be set to "success". */
    status: 'success';
    /** Wrapper for data of any data type. No data should be set to null.  */
    data: any;
};

/** jSend fail object. */
export type JSendFail = {
    /** Should always be set to "fail". */
    status: 'fail';
    /** Wrapper for data of any data type. This data should specify why the rquest failed.  */
    data: any;
};

/** jSend error object. */
export interface JSendErrorData {
    /** A meaningful, end-user-readable (or at the least log-worthy) message, explaining what went wrong. */
    message: string;
    /** A numeric code corresponding to the error, if applicable. */
    code?: number;
    /** A generic container for any other information about the error, i.e. the conditions that caused the error, stack traces, etc. */
    data?: any;
}

/** jSend error object. */
export interface JSendError extends JSendErrorData {
    /** Should always be set to "error". */
    status: 'error';
}

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
    sendError: (messageOrErrorData: string | JSendErrorData, httpStatusCode?: number) => void;
};

function checkObjectWithWhitelistKeys(obj: object, whitelistKeys: string[]): boolean {
    const objKeys = Object.keys(obj);

    for (let i = 0; i < objKeys.length; i += 1) {
        if (!whitelistKeys.includes(objKeys[i])) {
            return false;
        }
    }
    return true;
}

/** The jSend object containing all functions. */
function jSendBase(config: { strictMode: boolean }) {
    // config = config || {};
    // host = host || {};

    /**
     * Creates a **successful** jSend object.
     * @param data Wrapper for data of any data type. No data should be set to null.
     * @returns Returns a successful jSend object.
     */
    function success(data: any): JSendSuccess {
        return {
            status: 'success',
            data
        };
    }

    /**
     * Creates a **failed** jSend object.
     * @param data Wrapper for data of any data type. This data should specify why the rquest failed.
     * @returns Returns a failed jSend object.
     */
    function fail(data: any): JSendFail {
        return {
            status: 'fail',
            data
        };
    }

    /**
     * Creates an **error** jSend object.
     * @param message A meaningful, end-user-readable (or at the least log-worthy) message, explaining what went wrong.
     * @param optional Additional optional information of the error.
     * @returns
     */
    function error(messageOrErrorData: string | JSendErrorData): JSendError {
        if (typeof messageOrErrorData === 'string') {
            return {
                status: 'error',
                message: messageOrErrorData
            };
        } else {
            return {
                status: 'error',
                message: messageOrErrorData.message,
                ...(messageOrErrorData.code && { code: messageOrErrorData.code }),
                ...(messageOrErrorData.data && { data: messageOrErrorData.data })
            };
        }
    }

    /**
     * Testing if the `ref` parameter is a valid jSend success object.
     * @param ref The `ref` parameter to be tested.
     * @returns True if the `ref` parameter is a valid jSend success object, otherwise false;
     */
    function isSuccess(ref: any): ref is JSendSuccess {
        return (
            typeof ref === 'object' &&
            typeof ref.status === 'string' &&
            ref.status === 'success' &&
            ref.data !== undefined &&
            (config.strictMode === false || checkObjectWithWhitelistKeys(ref, ['status', 'data']))
        );
    }

    /**
     * Testing if the `ref` parameter is a valid jSend failed object.
     * @param ref The `ref` parameter to be tested.
     * @returns True if the `ref` parameter is a valid jSend failed object, otherwise false;
     */
    function isFail(ref: any): ref is JSendFail {
        return (
            typeof ref === 'object' &&
            typeof ref.status === 'string' &&
            ref.status === 'fail' &&
            ref.data !== undefined &&
            (config.strictMode === false || checkObjectWithWhitelistKeys(ref, ['status', 'data']))
        );
    }

    /**
     * Testing if the `ref` parameter is a valid jSend error object.
     * @param ref The `ref` parameter to be tested.
     * @returns True if the `ref` parameter is a valid jSend error object, otherwise false;
     */
    function isError(ref: any): ref is JSendError {
        return (
            typeof ref === 'object' &&
            typeof ref.status === 'string' &&
            ref.status === 'error' &&
            typeof ref.message === 'string' &&
            (ref.code === undefined || typeof ref.message === 'number') &&
            (config.strictMode === false || checkObjectWithWhitelistKeys(ref, ['status', 'message', 'code', 'data']))
        );
    }

    /**
     * Testing if the `ref` parameter is one of [{@link jSend.isSuccess}, {@link jSend.isFail}, {@link jSend.isError}].
     * @param ref The `ref` parameter to be tested.
     * @returns True if the `ref` parameter is one of [{@link jSend.isSuccess}, {@link jSend.isFail}, {@link jSend.isError}], otherwise false.
     */
    function isValid(ref: any): ref is JSend {
        return isSuccess(ref) || isFail(ref) || isError(ref);
    }

    const publish = {
        success,
        fail,
        error,
        isValid,
        isSuccess,
        isFail,
        isError,
        middleware: function (_req: any, res: any, next: any) {
            const middleware: JSendMiddleware = {
                send: function (jSendObject: JSend, httpStatusCode?: number) {
                    console.log('Calling Global');
                    // res.status(httpStatusCode || 200).json(jSendObject);
                    if (isSuccess(jSendObject)) {
                        res.status(httpStatusCode || 200).json(jSendObject);
                    } else if (isFail(jSendObject)) {
                        res.status(httpStatusCode || 400).json(jSendObject);
                    } else if (isError(jSendObject)) {
                        res.status(httpStatusCode || 500).json(jSendObject);
                    }
                },

                sendSuccess: function (data: any, httpStatusCode?: number) {
                    res.status(httpStatusCode || 200).json(success(data));
                },

                sendFail: function (data: any, httpStatusCode?: number) {
                    res.status(httpStatusCode || 400).json(fail(data));
                },

                sendError: function (messageOrErrorData: string | JSendErrorData, httpStatusCode?: number) {
                    res.status(httpStatusCode || 500).json(error(messageOrErrorData));
                }
            };

            res.jSend = middleware;

            next();
        }
    };

    return publish;
}

export const jSend = jSendBase({ strictMode: false });
export const jSendStrict = jSendBase({ strictMode: true });
