Join all arguments together and normalize the resulting url.

## Install

~~~
npm install url-join
~~~

## Usage

~~~javascript
var urljoin = require('url-join');

var fullUrl = urljoin('http://www.google.com', 'a', '/b/cd', '?foo=123');

console.log(fullUrl);

~~~

Prints:

~~~
'http://www.google.com/a/b/cd?foo=123'
~~~

## License

MIT