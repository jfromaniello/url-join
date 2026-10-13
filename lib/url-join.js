function normalize (strArray) {
  const resultArray = [];
  // Whether each part in resultArray was separated from the previous one by a slash in the input.
  const slashBefore = [];
  if (strArray.length === 0) { return ''; }

  // Filter out any empty string values.
  strArray = strArray.filter((part) => part !== '');

  if (typeof strArray[0] !== 'string') {
    throw new TypeError('Url must be a string. Received ' + strArray[0]);
  }

  // If the first part is a plain protocol, we combine it with the next part.
  if (strArray[0].match(/^[^/:]+:\/*$/) && strArray.length > 1) {
    strArray[0] = strArray.shift() + strArray[0];
  }

  // If the first part is a leading slash, we combine it with the next part.
  if (strArray[0] === '/' && strArray.length > 1) {
    strArray[0] = strArray.shift() + strArray[0];
  }

  // There must be two or three slashes in the file protocol, two slashes in anything else.
  if (strArray[0].match(/^file:\/\/\//)) {
    strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, '$1:///');
  } else if (!strArray[0].match(/^\[.*:.*\]/)) {
    // If the first part is not an IPv6 host, we replace the protocol.
    strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, '$1://');
  }

  let prevEndsWithSlash = false;

  for (let i = 0; i < strArray.length; i++) {
    let component = strArray[i];

    if (typeof component !== 'string') {
      throw new TypeError('Url must be a string. Received ' + component);
    }

    const startsWithSlash = component.startsWith('/');
    const endsWithSlash = component.endsWith('/');

    if (i > 0) {
      // Removing the starting slashes for each component but the first.
      component = component.replace(/^[\/]+/, '');
    }
    if (i < strArray.length - 1) {
      // Removing the ending slashes for each component but the last.
      component = component.replace(/[\/]+$/, '');
    } else {
      // For the last component we will combine multiple slashes to a single one.
      component = component.replace(/[\/]+$/, '/');
    }

    if (component === '') {
      prevEndsWithSlash = prevEndsWithSlash || startsWithSlash;
      continue;
    }

    resultArray.push(component);
    slashBefore.push(startsWithSlash || prevEndsWithSlash);
    prevEndsWithSlash = endsWithSlash;
  }

  let str = '';

  for (let i = 0; i < resultArray.length; i++) {
    const part = resultArray[i];

    // Do not add a slash if this is the first part.
    if (i === 0) {
      str += part;
      continue;
    }

    const prevPart = resultArray[i - 1]

    // Do not add a slash if the previous part ends with start of the query param or hash.
    if (prevPart && prevPart.endsWith('?')) {
      str += part;
      continue;
    }

    // After a hash, keep the slash only if the input had one (eg: '#', '/tenant' -> '#/tenant').
    if (prevPart.endsWith('#')) {
      str += (slashBefore[i] ? '/' : '') + part;
      continue;
    }

    str += '/' + part;
  }
  // Each input component is now separated by a single slash except the possible first plain protocol part.

  // remove trailing slash before parameters or hash
  str = str.replace(/\/(\?|&|#[^!])/g, '$1');

  // replace ? and & in parameters with &
  const hashIndex = str.indexOf('#');
  const beforeHash = hashIndex === -1 ? str : str.slice(0, hashIndex);
  const afterHash = hashIndex === -1 ? '' : str.slice(hashIndex + 1);
  // The base can be empty when the URL starts with a query or hash (eg: '?a=1' or '#a').
  const [base, ...params] = beforeHash.split(/(?:\?|&)+/);
  const query = params.filter(Boolean);
  str = base + (query.length > 0 ? '?': '') + query.join('&') + (afterHash && afterHash.length > 0 ? '#' + afterHash : '');

  return str;
}

export default function urlJoin(...args) {
  const parts = Array.from(Array.isArray(args[0]) ? args[0] : args);
  return normalize(parts);
}
