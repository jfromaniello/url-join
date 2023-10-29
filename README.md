Join all path arguments together and normalize the resulting URL pathname. (No more duplicated or missing slashes!)


## Install

```bash
npm install url-join
```

If you want to use it directly in a browser use a CDN like [Skypack](https://www.skypack.dev/view/url-join).

## Usage

```javascript
import urlJoin from 'url-join';

const id = '42'
const postUrl = urlJoin('/posts', id, '/metadata/');
// => "/posts/42/metadata"
```
## Use the Web Standard APIs for Other Cases

Web Sandard APIs [URL][1] and [URLSearchParams][1] capable of URL operations except manipulating [URL pathnames][2].
```
Use this library to manipulate URL pathnames
                                      👇
   https  :// www.example.com /posts/42/metadata ?filter=author&page=1 #heading-1
|-scheme-|    |---domain----| |----pathname----| |------search-------| |--hash--|
```

#### [`URL()`][1]

- Join origin to pathname, deduplicating `/` between origin and pathname
```js
let url = new URL("/wiki/Early_history_of_the_IRT_subway", "https://wikipedia.org/")
// => "https://wikipedia.org/wiki/Early_history_of_the_IRT_subway"
```

- Set the url hash
```js
let url = new URL("https://example.com/")
url.hash = "heading-1"
// => "https://example.com/#heading-1"
```

#### [`URLSearchParams()`][1]
- Set query params on a URL
```js
let url = new URL("https://example.com/")
url.search = new URLSearchParams([ ["foo", 123], ["bar", 456] ])
// => "https://example.com/?foo=123&bar=456"
```
- Add query params to an existing URL
```js
let url = new URL("https://example.com/")
url.searchParams.set('foo', 123) // to overwrite existing
url.searchParams.append('bar', 456) // to add without overwriting
// => "https://example.com/?foo=123&bar=456"
```

## License

MIT


[1]: https://developer.mozilla.org/en-US/docs/Web/API/URL_API
[2]: https://developer.mozilla.org/en-US/docs/Web/API/URL/pathname
