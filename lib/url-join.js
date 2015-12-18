(function (name, context, definition) {
  if (typeof module !== 'undefined' && module.exports) module.exports = definition();
  else if (typeof define === 'function' && define.amd) define(definition);
  else context[name] = definition();
})('urljoin', this, function () {

  function normalize (str) {
    return str
            .replace(/[\/]+/g, '/')
            .replace(/\/\?/, '?')
            .replace(/(\/\?|\/\&)+/g, '&')
            .replace(/\/\#/g, '#')
            .replace(/\:\//g, '://');
  }

  return function () {
    var joined = [].slice.call(arguments, 0).join('/');
    return normalize(joined);
  };

});
