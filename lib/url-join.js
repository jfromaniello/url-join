(function (name, context, definition) {
  if (typeof module !== 'undefined' && module.exports) module.exports = definition();
  else if (typeof define === 'function' && define.amd) define(definition);
  else context[name] = definition();
})('urljoin', this, function () {

  function normalize (str) {
    return str
            .replace(/^\/\//g, '://')   // replace leading // with :/
            .replace(/[\/]+/g, '/')     // flatten multiple occurencies of / to single /
            .replace(/\/\?/g, '?')      // remove trailing / before parameters
            .replace(/\/\#/g, '#')      // remove trailing / before hash
            .replace(/\:\//g, '://')    // replace :/ with ://
            .replace(/^:\/\//g , '//'); // replace leading :// with //
  }

  return function () {
    var joined = [].slice.call(arguments, 0).join('/');
    return normalize(joined);
  };

});
