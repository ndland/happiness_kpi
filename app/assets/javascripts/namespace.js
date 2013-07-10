window.namespace = function(fullName, block) {
  var i, length, name,
  parts = fullName.split('.'),
  target = window;

  for (i = 0, length = parts.length; i < length; i += 1) {
    name = parts[i];
    target = target[name] || (target[name] = {});
  }
  return block(target);
};
