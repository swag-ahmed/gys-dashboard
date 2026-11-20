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
      if (!ready) {
        loading.querySelector("p").textContent =
          "The dashboard could not connect. Please try reloading.";
        help.hidden = false;
      }
    }, 18000);
  };
  const KEY = "gys.token";
  const isTrusted = (origin) => {
    try {
      const url = new URL(origin);
      return (
        url.protocol === "https:" &&
        (url.hostname === "script.google.com" ||
          url.hostname.endsWith(".googleusercontent.com"))
      );
    } catch (_) {
      return false;
    }
  };
  const saved = () => {
    try {
      const t = localStorage.getItem(KEY) || "";
      return /^[a-f0-9]{64}$/.test(t) ? t : "";
    } catch (_) {
      return "";
    }
  };
  const savedLang = () => {
    try {
      return localStorage.getItem("gys.lang") === "bn" ? "bn" : "en";
    } catch (_) {
      return "en";
    }
  };
  // Keep the dashboard sign-in here (the framed app has no lasting storage),
  // so reloads do not sign people out. Only "Sign out" or expiry clears it.
  window.addEventListener("message", (event) => {
    // The app runs two frames deep (Google wraps it), so accept any window that
    // sits inside OUR page; a separate window opened by someone else is refused.
    const ours = (w) => {
      try {
        return !!w && w.top === window && w !== window;
      } catch (_) {
        return false;
      }
    };
    if (!isTrusted(event.origin) || !ours(event.source)) return;
    const type = event.data?.type;
    if (type === "gys:hello")
      event.source.postMessage(
        { type: "gys:token", token: saved(), lang: savedLang() },
        event.origin,
      );
    if (type === "gys:setPref") {
      try {
        if (event.data.lang === "bn" || event.data.lang === "en")
          localStorage.setItem("gys.lang", event.data.lang);
      } catch (_) {}
    }
    if (type === "gys:setToken") {
      try {
        const t = String(event.data.token || "");
        if (/^[a-f0-9]{64}$/.test(t)) localStorage.setItem(KEY, t);
        else localStorage.removeItem(KEY);
      } catch (_) {}
    }
  });
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
  // A Google account-routing error also fires iframe load. Only the app's
  // trusted ready message confirms that the actual dashboard loaded.
  document.getElementById("reload").addEventListener("click", () => {
    loading.hidden = false;
    loading.querySelector("p").textContent = "Opening your dashboard…";
    help.hidden = true;
    startTimer();
    frame.src = frame.src;
  });
  document.getElementById("dismiss").addEventListener("click", () => {
    help.hidden = true;
  });
  startTimer();
})();
