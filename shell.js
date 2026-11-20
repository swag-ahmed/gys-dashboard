"use strict";
(() => {
  if (window.top !== window.self) {
    document.body.textContent = "Open GYS Workspace directly in your browser.";
    return;
  }
  const frame = document.getElementById("dashboard");
  const loading = document.getElementById("loading");
  const help = document.getElementById("help");
  let ready = false;
  let timer;
  const hideLoading = () => {
    loading.hidden = true;
  };
  const startTimer = () => {
    clearTimeout(timer);
    ready = false;
    timer = setTimeout(() => {
      hideLoading();
      if (!ready) help.hidden = false;
    }, 18000);
  };
  window.addEventListener("message", (event) => {
    let trusted = false;
    try {
      const url = new URL(event.origin);
      trusted =
        url.protocol === "https:" &&
        (url.hostname === "script.google.com" ||
          url.hostname.endsWith(".googleusercontent.com"));
    } catch (_) {}
    if (trusted && event.data?.type === "gys:ready") {
      ready = true;
      clearTimeout(timer);
      hideLoading();
      help.hidden = true;
    }
  });
  frame.addEventListener("load", hideLoading);
  document.getElementById("reload").addEventListener("click", () => {
    loading.hidden = false;
    help.hidden = true;
    startTimer();
    frame.src = frame.src;
  });
  document.getElementById("dismiss").addEventListener("click", () => {
    help.hidden = true;
  });
  startTimer();
})();
