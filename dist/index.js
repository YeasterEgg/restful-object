"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const voidFn = () => { };
const methodHandlers = {
    get: (path, options, handlerFn) => (body, specificOptions = {}) => {
        const urlParams = new URLSearchParams(body);
        const completePath = body ? `${path}?${urlParams.toString()}` : path;
        const completeOptions = Object.assign({}, options, specificOptions, { method: 'GET' });
        if (handlerFn)
            return handlerFn(completePath, completeOptions);
        return { path: completePath, options: completeOptions };
    },
    post: (path, options, handlerFn) => (rawBody, specificOptions = {}) => {
        const body = typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody);
        const completeOptions = Object.assign({}, options, specificOptions, { method: 'POST', body });
        if (handlerFn)
            return handlerFn(path, completeOptions);
        return { path, options: completeOptions };
    },
    put: (path, options, handlerFn) => (rawBody, specificOptions = {}) => {
        const body = typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody);
        const completeOptions = Object.assign({}, options, specificOptions, { method: 'PUT', body });
        if (handlerFn)
            return handlerFn(path, completeOptions);
        return { path, options: completeOptions };
    },
    delete: (path, options, handlerFn) => (body, specificOptions = {}) => {
        const completeOptions = Object.assign({}, options, specificOptions, { method: 'DELETE' });
        if (handlerFn)
            return handlerFn(path, completeOptions);
        return { path, options: completeOptions };
    },
};
function RecursiveProxy(handlerFn, options, path = []) {
    function get(obj, key) {
        if (obj.hasOwnProperty(key))
            return obj[key];
        if (methodHandlers.hasOwnProperty(key)) {
            const joinedPath = path.join('/');
            return methodHandlers[key](joinedPath, options, handlerFn);
        }
        if (typeof key === 'string') {
            const completePath = [...path, key];
            return new RecursiveProxy(handlerFn, options, completePath);
        }
        else {
            return () => path;
        }
    }
    function apply(_, __, args = []) {
        const completePath = [...path, ...args];
        const proxiedResult = new RecursiveProxy(handlerFn, options, completePath);
        return proxiedResult;
    }
    return new Proxy(voidFn, { get, apply });
}
exports.RecursiveProxy = RecursiveProxy;
