Join all arguments together and normalize the resulting URL.

## Install

```bash
npm install url-join
```

If you want to use it directly in a browser use a CDN like [Skypack](https://www.skypack.dev/view/url-join).

## Usage

```javascript
import urlJoin from 'url-join';

const fullUrl = urlJoin('http://www.google.com', 'a', '/b/cd', '?foo=123', '&bar=456', '#heading-1');

console.log(fullUrl.toString()); // 'http://www.google.com/a/b/cd?foo=123&bar=456#heading-1'
```

## You might not need this library

This library was originally created before the [URL API](https://developer.mozilla.org/en-US/docs/Web/API/URL_API) was standardized and widely available in popular runtimes such as browsers and Node.js. Depending on your use-case you might want to consider using the standardized API over this library.

### In the Browser

For example, the equivalent code for the above example would look as follows when using the URL API:
```javascript
const fullUrl = new URL('http://www.google.com');

fullUrl.pathname = '/a/b/cd';
fullUrl.searchParams.append('foo', '123');
fullUrl.searchParams.append('bar', '456');
fullUrl.hash = 'heading-1';

console.log(fullUrl.toString()); // 'http://www.google.com/a/b/cd?foo=123&bar=456#heading-1'
```

### Joining Path Parts
This library provides the piece missing from `URL`, joining URL path parts together:

```javascript
import urlJoin from 'url-join';

const fullUrl = new URL('http://www.google.com');
fullUrl.pathname = urlJoin('a', 'b', 'cd');

console.log(fullUrl.toString()); // 'http://www.google.com/a/b/cd'
```

### In Node.js
If you are programming for Node.js, its `path/posix` library can join paths in a way that is compatible with URL pathnames:
```javascript
import { join as joinPath } from 'node:path/posix';

const fullUrl = new URL('http://www.google.com');
fullUrl.pathname = joinPath('/a/', 'b', 'cd');

console.log(fullUrl.toString()); // 'http://www.google.com/a/b/cd'
```

### Caveats of URL API

There are a couple of caveats to take into account when utilizing the standard APIs. Firstly, a `URL` must always include a complete and valid base, which means specifying the scheme and domain name (e.g. http://example.com).

Secondly, it is not possible to join together and normalize the path of a URL. You must do this manually by joining your paths and then assigning the pathname property.

## License

MIT
