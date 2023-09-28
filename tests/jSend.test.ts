import { jSend } from '../src';

test('check the function isSuccess', () => {
    const obj = {
        status: 'success',
        data: null
    };

    const isJSendSuccess = jSend.isSuccess(obj);

    expect(isJSendSuccess).toBeTruthy();
});
