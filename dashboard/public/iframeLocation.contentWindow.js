function sendUrlToParent() {
  window.parent.postMessage({
    type: 'urlChange',
    url: window.location.href,
  }, '*');
}

window.onload = sendUrlToParent;

history.pushState = (f => function pushState() {
  var ret = f.apply(this, arguments);
  window.dispatchEvent(new Event('locationchange'));
  return ret;
})(history.pushState);

history.replaceState = (f => function replaceState() {
  var ret = f.apply(this, arguments);
  window.dispatchEvent(new Event('locationchange'));
  return ret;
})(history.replaceState);

window.addEventListener('popstate', function() {
  window.dispatchEvent(new Event('locationchange'));
});

window.addEventListener('locationchange', function() {
  sendUrlToParent();
});
