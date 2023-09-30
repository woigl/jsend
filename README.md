# @woigl/jsend

[![code style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![npm (scoped)](https://img.shields.io/npm/v/%40woigl/jsend?style=flat-square&logo=github)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/typeslick/status-code-enum/blob/master/LICENSE)

TypeScript and JavaScript utilities and HTTP middleware for creating, sending and verifying [JSend](https://github.com/omniti-labs/jsend) responses.

### Installation

```
npm install -S @woigl/jsend
```

## Response Creation

Responses can be created using the `success`, `fail`, and `error` methods:

```typescript
// You can pass any data or a JSend response to success
jSend.success({ foo: 'bar' }); // { status: 'success', data: { foo: 'bar' } }
jSend.success(['foo', 'bar']); // { status: 'success', data: [ 'foo', 'bar' ] }
jSend.success('Some text'); // { status: 'success', data: 'Some text' }
jSend.success(4711); // { status: 'success', data: 4711 }
jSend.success(false); // { status: 'success', data: false }
jSend.success(null); // { status: 'success', data: null }

// You can pass any data or a JSend response to fail
jSend.fail({ reason: 'Some reason text' }); // { status: 'fail', data: { reason: 'Some reason text' } }
jSend.fail({ code: 'NOT_EXISTING' }); // { status: 'fail', data: { code: 'NOT_EXISTING' } }

// You can pass a message or an object with a message and optionally data and code
jSend.error('That just failed!'); // { status: 'error', message: 'That just failed!' }
jSend.error({
    code: 123,
    message: 'That just failed!'
}); // { status: 'error', code: 123, message: 'That just failed!' }
jSend.error({
    code: 123,
    message: 'That just failed!',
    data: {
        stack: '...'
    }
}); // { status: 'error', code: 123, message: 'That just failed!', data: { stack: '...' } }
```

### HTTP Middleware

The jSend HTTP middleware provides methods for easily sending "success", "fail" and "error" responses and optionally allows to specify [HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status):

```typescript
expressApp.use(jSend.middleware);

expressApp.get('/', function(req, res) {
    if(!checkToken(req.params.token)
        return res.jSend.sendFail({ authentication:['You are not authenticated'] }, 401);

    if(!req.params.someParam)
        return res.jSend.sendFail({ validation:['someParam is required'] });

    loadData(req.params.someParam, function(err, data) {
        if(err) return res.jSend.sendError(err);
        res.jSend.sendSuccess(data);
    });
});
```

## Response Validation

By default `jSend.isValid` validates that all required properties exist.

```typescript
// Returns true
jSend.isValid({
    status: 'success',
    data: { foo: 'bar' }
});

// Returns false
jSend.isValid({
    status: 'success'
});

// Returns true
jSend.isValid({
    status: 'success',
    data: { foo: 'bar' },
    junk: 'is ok'
});
```

Using `jSendStrict.isValid` instead of `jSend.isValid` causes to also validate that extraneous properties do not exist.

```typescript
// Returns true
jSend.isValid({
    status: 'success',
    data: { foo: 'bar' }
});

// Returns false
jSend.isValid({
    status: 'success'
});

// Returns false
jSend.isValid({
    status: 'success',
    data: { foo: 'bar' },
    junk: 'is ok'
});
```

### Validate if Response is "success"

You can also check if a response is a "success" response.

```typescript
// Returns true
jSend.isSuccess({
    status: 'success',
    data: { foo: 'bar' }
});

// Returns false
jSend.isSuccess({
    status: 'error',
    data: { stack: '...' }
});
```

Use `jSendStrict` to check with strict mode enabled.

### Validate if Response is "fail"

You can also check if a response is a "fail" response.

```typescript
// Returns true
jSend.isFail({
    status: 'fail',
    data: { foo: 'bar' }
});

// Returns false
jSend.isFail({
    status: 'error',
    data: { stack: '...' }
});
```

Use `jSendStrict` to check with strict mode enabled.

### Validate if Response is "error"

You can also check if a response is an "error" response.

```typescript
// Returns true

jSend.isError({
    status: 'error',
    message: 'Error message',
    data: { stack: '...' }
});

// Returns false
jSend.isError({
    status: 'success',
    data: { foo: 'bar' }
});
```

Use `jSendStrict` to check with strict mode enabled.

## Bugs, Feature Requests, Questions and so on...

If you want to report some bugs, have the need and ideas for enhancements, or you are just looking for some help or clarification, then just [create an issue](https://github.com/woigl/jsend/issues) on GitHub at https://github.com/woigl/jsend/issues.

If you want to improve the code, then you can start straight with a pull request.

## Expression of Gratitude

I would like to express my gratitude towards [Matt Dunlap](https://www.npmjs.com/~prestaul), who is the maintainer of the [jsend NPM package](https://www.npmjs.com/package/jsend). Unfortunately, the package did not satisfy my needs in terms of Typescript support and HTTP status codes. Therefore I've decided to develop a slightly similar library. Once again, thanks to Matt for his great work!

## License

[MIT](https://github.com/woigl/jsend/blob/HEAD/LICENSE)
