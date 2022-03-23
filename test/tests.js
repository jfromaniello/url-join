import assert from 'assert';
import urlJoin from '../lib/url-join.js';

describe('url join', function () {
  it('should work for simple case', function () {
    urlJoin('http://www.google.com/', 'foo/bar', '?test=123')
      .should.eql('http://www.google.com/foo/bar?test=123');
  });

  it('should work for simple case with new syntax', function () {
    urlJoin(['http://www.google.com/', 'foo/bar', '?test=123'])
      .should.eql('http://www.google.com/foo/bar?test=123');
  });

  it('should work for hashbang urls', function () {
    urlJoin(['http://www.google.com', '#!', 'foo/bar', '?test=123'])
      .should.eql('http://www.google.com/#!/foo/bar?test=123');
  });

  it('should be able to join protocol', function () {
    urlJoin('http:', 'www.google.com/', 'foo/bar', '?test=123')
      .should.eql('http://www.google.com/foo/bar?test=123');
  });

  it('should be able to join protocol with slashes', function () {
    urlJoin('http://', 'www.google.com/', 'foo/bar', '?test=123')
      .should.eql('http://www.google.com/foo/bar?test=123');
  });

  it('should remove extra slashes', function () {
    urlJoin('http:', 'www.google.com///', 'foo/bar', '?test=123')
      .should.eql('http://www.google.com/foo/bar?test=123');
  });

  it('should not remove extra slashes in an encoded URL', function () {
    urlJoin('http:', 'www.google.com///', 'foo/bar', '?url=http%3A//Ftest.com')
      .should.eql('http://www.google.com/foo/bar?url=http%3A//Ftest.com');

    urlJoin('http://a.com/23d04b3/', '/b/c.html')
      .should.eql('http://a.com/23d04b3/b/c.html')
      .should.not.eql('http://a.com/23d04b3//b/c.html');
  });

  it('should support anchors in urls', function () {
    urlJoin('http:', 'www.google.com///', 'foo/bar', '?test=123', '#faaaaa')
      .should.eql('http://www.google.com/foo/bar?test=123#faaaaa');
  });

  it('should support protocol-relative urls', function () {
    urlJoin('//www.google.com', 'foo/bar', '?test=123')
      .should.eql('//www.google.com/foo/bar?test=123')
  });

  it('should support file protocol urls', function () {
    urlJoin('file:/', 'android_asset', 'foo/bar')
      .should.eql('file://android_asset/foo/bar')

    urlJoin('file:', '/android_asset', 'foo/bar')
      .should.eql('file://android_asset/foo/bar')
  });

  it('should support absolute file protocol urls', function () {
    urlJoin('file:', '///android_asset', 'foo/bar')
      .should.eql('file:///android_asset/foo/bar')

    urlJoin('file:///', 'android_asset', 'foo/bar')
      .should.eql('file:///android_asset/foo/bar')

    urlJoin('file:///', '//android_asset', 'foo/bar')
      .should.eql('file:///android_asset/foo/bar')

    urlJoin('file:///android_asset', 'foo/bar')
      .should.eql('file:///android_asset/foo/bar')
  });

  it('should merge multiple query params properly', function () {
    urlJoin('http:', 'www.google.com///', 'foo/bar', '?test=123', '?key=456')
      .should.eql('http://www.google.com/foo/bar?test=123&key=456');

    urlJoin('http:', 'www.google.com///', 'foo/bar', '?test=123', '?boom=value', '&key=456')
      .should.eql('http://www.google.com/foo/bar?test=123&boom=value&key=456');

    urlJoin('http://example.org/x', '?a=1', '?b=2', '?c=3', '?d=4')
      .should.eql('http://example.org/x?a=1&b=2&c=3&d=4');
  });

  it('should merge slashes in paths correctly', function () {
    urlJoin('http://example.org', 'a//', 'b//', 'A//', 'B//')
      .should.eql('http://example.org/a/b/A/B/');
  });

  it('should merge colons in paths correctly', function () {
    urlJoin('http://example.org/', ':foo:', 'bar')
      .should.eql('http://example.org/:foo:/bar');
  });

  it('should merge just a simple path without URL correctly', function() {
    urlJoin('/', 'test')
      .should.eql('/test');
  });

  it('should fail with segments that are not string', function() {
    assert.throws(() => urlJoin(true),
                  /Url must be a string. Received true/);
    assert.throws(() => urlJoin('http://blabla.com/', 1),
                  /Url must be a string. Received 1/);
    assert.throws(() => urlJoin('http://blabla.com/', undefined, 'test'),
                  /Url must be a string. Received undefined/);
    assert.throws(() => urlJoin('http://blabla.com/', null, 'test'),
                  /Url must be a string. Received null/);
    assert.throws(() => urlJoin('http://blabla.com/', { foo: 123 }, 'test'),
                  /Url must be a string. Received \[object Object\]/);
  });

  it('should merge a path with colon properly', function(){
    urlJoin('/users/:userId', '/cars/:carId')
      .should.eql('/users/:userId/cars/:carId');
  });

  it('should merge slashes in protocol correctly', function () {
    urlJoin('http://example.org', 'a')
      .should.eql('http://example.org/a');
    urlJoin('http:', '//example.org', 'a')
      .should.eql('http://example.org/a');
    urlJoin('http:///example.org', 'a')
      .should.eql('http://example.org/a');
    urlJoin('file:///example.org', 'a')
      .should.eql('file:///example.org/a');

    urlJoin('file:example.org', 'a')
      .should.eql('file://example.org/a');

    urlJoin('file:/', 'example.org', 'a')
      .should.eql('file://example.org/a');
    urlJoin('file:', '/example.org', 'a')
      .should.eql('file://example.org/a');
    urlJoin('file:', '//example.org', 'a')
      .should.eql('file://example.org/a');
  });

  it('should skip empty strings', function() {
    urlJoin('http://foobar.com', '', 'test')
      .should.eql('http://foobar.com/test');
    urlJoin('', 'http://foobar.com', '', 'test')
      .should.eql('http://foobar.com/test');
  });

  it('should return an empty string if no arguments are supplied', function() {
    urlJoin().should.eql('');
  });
});
