import assert from 'node:assert/strict';
import test from 'node:test';
import urlJoin from '../lib/url-join.js';

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
