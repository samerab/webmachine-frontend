(function (window) {
  window.__env = window.__env || {};

  const mainDomain = "http://localhost:3000";
  const host = "localhost:3000";

  window.__env.mainDomain = mainDomain;
  window.__env.host = host;
  window.__env.apiUrl = `${mainDomain}/api`;
})(this);
