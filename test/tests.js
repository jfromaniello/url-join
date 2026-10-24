import assert from 'node:assert/strict';
import test from 'node:test';
import urlJoin from '../lib/url-join.js';

test('returns an empty string if all segments are empty', () => {
  assert.equal(urlJoin(''), '');
  assert.equal(urlJoin('', ''), '');
  assert.equal(urlJoin(['', '']), '');
  assert.throws(() => urlJoin('', null), TypeError);
});

test('joins a simple URL', () => {
  assert.equal(
    urlJoin('http://www.google.com/', 'foo/bar', '?test=123'),
    'http://www.google.com/foo/bar?test=123'
  );
});

test('joins a simple URL with new syntax', () => {
  assert.equal(
    urlJoin(['http://www.google.com/', 'foo/bar', '?test=123']),
    'http://www.google.com/foo/bar?test=123'
  );
});

test('joins a hashbang', () => {
  assert.equal(
    urlJoin(['http://www.google.com', '#!', 'foo/bar', '?test=123']),
    'http://www.google.com/#!/foo/bar?test=123'
  );
});

test('joins a protocol', () => {
  assert.equal(
    urlJoin('http:', 'www.google.com/', 'foo/bar', '?test=123'),
    'http://www.google.com/foo/bar?test=123'
  );
});

test('joins a protocol with slashes', () => {
  assert.equal(
    urlJoin('http://', 'www.google.com/', 'foo/bar', '?test=123'),
    'http://www.google.com/foo/bar?test=123'
  );
});

test('removes extra slashes', () => {
  assert.equal(
    urlJoin('http:', 'www.google.com///', 'foo/bar', '?test=123'),
    'http://www.google.com/foo/bar?test=123'
  );
});

test('removes extra slashes in an encoded URL', () => {
  assert.equal(
    urlJoin('http:', 'www.google.com///', 'foo/bar', '?url=http%3A//Ftest.com'),
    'http://www.google.com/foo/bar?url=http%3A//Ftest.com'
  );

  assert.equal(
    urlJoin('http://a.com/23d04b3/', '/b/c.html'),
    'http://a.com/23d04b3/b/c.html'
  );

  assert.equal(
    urlJoin("/foo", "/", "bar", "?test=123"),
    "/foo/bar?test=123"
  );
});

test('joins anchors in URLs', () => {
  assert.equal(
    urlJoin('http:', 'www.google.com///', 'foo/bar', '?test=123', '#faaaaa'),
    'http://www.google.com/foo/bar?test=123#faaaaa'
  );
});

test('joins protocol-relative URLs', () => {
  assert.equal(
    urlJoin('//www.google.com', 'foo/bar', '?test=123'),
    '//www.google.com/foo/bar?test=123'
  );
});

test('preserves additional hashes in URL fragments', () => {
  assert.equal(
    urlJoin('https://example.com', 'docs', '#section#details'),
    'https://example.com/docs#section#details'
  );

  assert.equal(
    urlJoin(['https://example.com', 'docs', '##details']),
    'https://example.com/docs##details'
  );

  assert.equal(
    urlJoin('https://example.com/docs#section#details'),
    'https://example.com/docs#section#details'
  );
});

test('preserves query characters after additional fragment hashes', () => {
  assert.equal(
    urlJoin('https://example.com', '?a=1', '?b=2', '#section#details?x=1&y=2'),
    'https://example.com?a=1&b=2#section#details?x=1&y=2'
  );
});

test('joins file protocol URLs', () => {
  assert.equal(
    urlJoin('file:/', 'android_asset', 'foo/bar'),
    'file://android_asset/foo/bar'
  );

  assert.equal(
    urlJoin('file:', '/android_asset', 'foo/bar'),
    'file://android_asset/foo/bar'
  );
});

test('joins absolute file protocol URLs', () => {
  assert.equal(
    urlJoin('file:', '///android_asset', 'foo/bar'),
    'file:///android_asset/foo/bar'
  );

  assert.equal(
    urlJoin('file:///', 'android_asset', 'foo/bar'),
    'file:///android_asset/foo/bar'
  );

  assert.equal(
    urlJoin('file:///', '//android_asset', 'foo/bar'),
    'file:///android_asset/foo/bar'
  );

  assert.equal(
    urlJoin('file:///android_asset', 'foo/bar'),
    'file:///android_asset/foo/bar'
  );
});

test('joins multiple query params', () => {
  assert.equal(
    urlJoin('http:', 'www.google.com///', 'foo/bar', '?test=123', '?key=456'),
    'http://www.google.com/foo/bar?test=123&key=456'
  );

  assert.equal(
    urlJoin('http:', 'www.google.com///', 'foo/bar', '?test=123', '?boom=value', '&key=456'),
    'http://www.google.com/foo/bar?test=123&boom=value&key=456'
  );

  assert.equal(
    urlJoin('http://example.org/x', '?a=1', '?b=2', '?c=3', '?d=4'),
    'http://example.org/x?a=1&b=2&c=3&d=4'
  );

  assert.equal(
    urlJoin('http:', 'www.google.com///', 'foo/bar', '&test=123', '&key=456'),
    'http://www.google.com/foo/bar?test=123&key=456'
  );

  assert.equal(
    urlJoin('http:', 'www.google.com///', 'foo/bar', '&test=123', '?key=456'),
    'http://www.google.com/foo/bar?test=123&key=456'
  );
});

test('filters out empty query parameters', () => {
  assert.equal(
    urlJoin('http://google.com', '?'),
    'http://google.com'
  );

  assert.equal(
    urlJoin('http://google.com', '&'),
    'http://google.com'
  );
});

test('joins slashes in paths', () => {
  assert.equal(
    urlJoin('http://example.org', 'a//', 'b//', 'A//', 'B//'),
    'http://example.org/a/b/A/B/'
  );
});

test('joins colons in paths', () => {
  assert.equal(
    urlJoin('http://example.org/', ':foo:', 'bar'),
    'http://example.org/:foo:/bar'
  );
});

test('joins a simple path without a URL', () => {
  assert.equal(
    urlJoin('/', 'test'),
    '/test'
  );
});

test('throws for segments that are not a string', () => {
  assert.throws(
    () => urlJoin(true),
    /Url must be a string. Received true/
  );
  
  assert.throws(
    () => urlJoin('http://blabla.com/', 1),
    /Url must be a string. Received 1/
  );
  
  assert.throws(
    () => urlJoin('http://blabla.com/', undefined, 'test'),
    /Url must be a string. Received undefined/
  );

  assert.throws(
    () => urlJoin('http://blabla.com/', null, 'test'),
    /Url must be a string. Received null/
  );
  
  assert.throws(
    () => urlJoin('http://blabla.com/', { foo: 123 }, 'test'),
    /Url must be a string. Received \[object Object\]/
  );
});

test('joins a path with a colon', () => {
  assert.equal(
    urlJoin('/users/:userId', '/cars/:carId'),
    '/users/:userId/cars/:carId'
  );
});

test('joins slashes in the protocol', () => {
  assert.equal(
    urlJoin('http://example.org', 'a'),
    'http://example.org/a'
  );

  assert.equal(
    urlJoin('http:', '//example.org', 'a'),
    'http://example.org/a'
  );

  assert.equal(
    urlJoin('http:///example.org', 'a'),
    'http://example.org/a'
  );

  assert.equal(
    urlJoin('file:///example.org', 'a'),
    'file:///example.org/a'
  );

  assert.equal(
    urlJoin('file:example.org', 'a'),
    'file://example.org/a'
  );

  assert.equal(
    urlJoin('file:/', 'example.org', 'a'),
    'file://example.org/a'
  );

  assert.equal(
    urlJoin('file:', '/example.org', 'a'),
    'file://example.org/a'
  );

  assert.equal(
    urlJoin('file:', '//example.org', 'a'),
    'file://example.org/a'
  );
});

test('skips empty strings', () => {
  assert.equal(
    urlJoin('http://foobar.com', '', 'test'),
    'http://foobar.com/test'
  );

  assert.equal(
    urlJoin('', 'http://foobar.com', '', 'test'),
    'http://foobar.com/test'
  );
});

test('returns an empty string if no arguments are supplied', () => {
  assert.equal(
    urlJoin(),
    ''
  );
});

test('does not mutate the original input', () => {
  const input = ['http:', 'www.google.com/', 'foo/bar', '?test=123'];
  const expected = Array.from(input);

  urlJoin(input);

  assert.deepEqual(input, expected);
});

test('does not replace query params after the hash', () => {
  assert.equal(
    urlJoin('http://example.com', '#a?b?c'),
    'http://example.com#a?b?c'
  );
});

test('joins broken up query params', () => {
  assert.equal(
    urlJoin('http://example.com', '/foo/bar?', 'test=123'),
    'http://example.com/foo/bar?test=123'
  );
});

test('joins broken up hash', () => {
  assert.equal(
    urlJoin('http://example.com', '/foo/bar#', 'some-hash'),
    'http://example.com/foo/bar#some-hash'
  );
});

test('joins leading empty string', () => {
  assert.equal(
    urlJoin('', '/test'),
    '/test'
  );
});

test('joins a leading IPv4 host with a port', () => {
  assert.equal(
    urlJoin('127.0.0.1:5500', 'data', 'myfile1.csv'),
    '127.0.0.1:5500/data/myfile1.csv'
  );

  assert.equal(
    urlJoin('192.0.2.1:8080/', '/data/', '/myfile1.csv'),
    '192.0.2.1:8080/data/myfile1.csv'
  );
});

test('joins a leading IPv4 host with a port using array syntax', () => {
  assert.equal(
    urlJoin(['127.0.0.1:5500', 'data', 'myfile1.csv']),
    '127.0.0.1:5500/data/myfile1.csv'
  );

  assert.equal(
    urlJoin(['127.0.0.1:5500/data/myfile1.csv']),
    '127.0.0.1:5500/data/myfile1.csv'
  );
});

test('normalizes custom protocols including legacy names', () => {
  for (const protocol of ['HTTP', 'git+ssh', 'web.v2', 'custom-scheme', 'my_app']) {
    assert.equal(
      urlJoin(protocol + ':example.com', 'path'),
      protocol + '://example.com/path'
    );

    assert.equal(
      urlJoin(protocol + ':', 'example.com', 'path'),
      protocol + '://example.com/path'
    );
  }
});

test('joins hostname ports without adding protocol slashes', () => {
  assert.equal(urlJoin('localhost:3000', 'api'), 'localhost:3000/api');
  assert.equal(urlJoin('example.com:8080/', '/api'), 'example.com:8080/api');
  assert.equal(urlJoin(['localhost:3000', 'api']), 'localhost:3000/api');
});

test('preserves standalone hosts with ports', () => {
  for (const host of ['127.0.0.1:5500', 'localhost:3000', 'example.com:8080']) {
    assert.equal(urlJoin(host), host);
    assert.equal(urlJoin([host]), host);
  }
});

test('joins queries and fragments after hostname ports', () => {
  assert.equal(urlJoin('localhost:3000', '?a=1'), 'localhost:3000?a=1');
  assert.equal(urlJoin('localhost:3000', '#x'), 'localhost:3000#x');
  assert.equal(urlJoin('localhost:3000?a=1', '?b=2'), 'localhost:3000?a=1&b=2');
  assert.equal(urlJoin('localhost:3000#x', 'path'), 'localhost:3000#x/path');
});

test('preserves explicit protocols and nonnumeric protocol targets', () => {
  assert.equal(urlJoin('http:', 'localhost:3000', 'api'), 'http://localhost:3000/api');
  assert.equal(urlJoin('http://localhost:3000', 'api'), 'http://localhost:3000/api');
  assert.equal(urlJoin('http:', '3000', 'api'), 'http://3000/api');
  assert.equal(urlJoin('my_app:', '123', 'api'), 'my_app://123/api');
  assert.equal(urlJoin('my_app://123', 'api'), 'my_app://123/api');
  assert.equal(urlJoin('my_app:123abc', 'api'), 'my_app://123abc/api');
  assert.equal(urlJoin('www.x.com', 'api'), 'www.x.com/api');
});

test('does not combine digit-leading prefixes as plain protocols', () => {
  assert.equal(urlJoin('127.0.0.1:', 'foo'), '127.0.0.1:/foo');
  assert.equal(urlJoin(['127.0.0.1:', 'foo']), '127.0.0.1:/foo');
  assert.equal(urlJoin('1custom:', 'foo'), '1custom:/foo');
});

test('joins a leading IPv6 hostname', () => {
  assert.equal(
    urlJoin('[2601:195:c381:3560::f42a]/', '/test'),
    '[2601:195:c381:3560::f42a]/test'
  );
});

test('joins a leading IPv6 host with an IPv4 address in the least significant 32 bits', () => {
  assert.equal(
    urlJoin('[2601:195:c381:3560::0.0.244.42]', '/test'),
    '[2601:195:c381:3560::0.0.244.42]/test'
  );
});

test('joins a protocol followed by an IPv6 host', () => {
  assert.equal(
    urlJoin('https://', '[2601:195:c381:3560::f42a]/', '/test'),
    'https://[2601:195:c381:3560::f42a]/test'
  );
});

test('joins URLs that start with a hash', () => {
  assert.equal(urlJoin('#', 'tenant'), '#tenant');
  assert.equal(urlJoin('#a'), '#a');
  assert.equal(urlJoin('/', '#', 'tenant'), '#tenant');
});

test('keeps a leading query string', () => {
  assert.equal(urlJoin('?a=1'), '?a=1');
  assert.equal(urlJoin('?a=1', '?b=2'), '?a=1&b=2');
  assert.equal(urlJoin('/?a', '#b'), '?a#b');
});

test('keeps an explicit slash after a hash', () => {
  assert.equal(urlJoin('#/', '/tenant'), '#/tenant');
  assert.equal(urlJoin('/#', '/tenant'), '#/tenant');
  assert.equal(urlJoin('/#/', '/tenant'), '#/tenant');
  assert.equal(urlJoin('/', '#', '/tenant'), '#/tenant');
  assert.equal(urlJoin('/something', '#', '/tenant'), '/something#/tenant');
  assert.equal(urlJoin('http://example.com', '#/', 'foo', 'bar'), 'http://example.com#/foo/bar');
});
