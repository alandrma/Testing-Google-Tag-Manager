const TRACKER_API = 'https://urldefense.com/v3/__https://id-ida.ioh.id__;!!BU9mIh0IHbaI!JrgYCAg_kg9pu_jQVs2Nvz1KqeQfERnaKLLjC9UCXvA9Pp1Jpgg4DTqfI2Dq7ArJVIEm_XEFaBuj4rTrL9tkscoH$ ';
const CLIENT_ID = (() => {
  try {
    const el = document.currentScript;
    if (el?.src) {
      const url = new URL(el.src);
      const id = url.searchParams.get('client_id');
      if (id) return id;
    }

    for (const script of document.getElementsByTagName('script')) {
      if (script.src?.includes('ida-script')) {
        const url = new URL(script.src);
        const id = url.searchParams.get('client_id');
        if (id) return id;
      }
    }
  } catch {}
  return null;
})();

function getGPU() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return {};
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    return info
      ? {
          webglVendor: gl.getParameter(info.UNMASKED_VENDOR_WEBGL),
          webglRenderer: gl.getParameter(info.UNMASKED_RENDERER_WEBGL)
        }
      : {};
  } catch {
    return {};
  }
}

const http = {
  async send(url, data) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-ID': CLIENT_ID
        },
        body: JSON.stringify(data),
        credentials: 'include',
        keepalive: true
      });
      if (!res.ok) throw new Error(`POST ${url} failed: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('[tracker]', err);
      throw err;
    }
  },

  async buildMeta(ts) {
    const { screen, navigator, location, devicePixelRatio } = window;
    return {
      accessTime: ts,
      fullUrl: location.href,
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      pixelRatio: devicePixelRatio,
      referrer: document.referrer || 'direct',
      cookiesEnabled: navigator.cookieEnabled,
      ...getGPU()
    };
  }
};

async function track(event = '', data = {}) {
  const ts = new Date().toISOString();
  try {
    const meta = await http.buildMeta(ts);
    const payload = {
      ...meta,
      eventType: event,
      eventMeta: data
    };
    await http.send(`${TRACKER_API}/ida-id`, payload);
  } catch {}
}

// === Init Pageview & Click Tracker ===
async function init() {
  try {
    await track('page_view');
    initClickTracker();
  } catch (err) {
    console.error('[tracker]', err);
  }
}

function initClickTracker() {
  document.addEventListener('click', (e) => {
    // Find the closest button, link, or element with a button role
    const target = e.target.closest('button, a, [role="button"], input[type="button"], input[type="submit"]');
    
    if (target) {
      // Avoid tracking internal script loads or empty clicks
      const text = target.innerText?.trim().substring(0, 100) || target.value || target.title || 'N/A';
      
      const clickData = {
        text: text,
        id: https://urldefense.com/v3/__http://target.id__;!!BU9mIh0IHbaI!JrgYCAg_kg9pu_jQVs2Nvz1KqeQfERnaKLLjC9UCXvA9Pp1Jpgg4DTqfI2Dq7ArJVIEm_XEFaBuj4rTrL2O0GgZx$  || 'N/A',
        classes: target.className || 'N/A',
        tag: target.tagName.toLowerCase(),
        href: target.href || 'N/A'
      };

      track('click', clickData);
    }
  }, true);
}

let lastPath = location.pathname + https://urldefense.com/v3/__http://location.search__;!!BU9mIh0IHbaI!JrgYCAg_kg9pu_jQVs2Nvz1KqeQfERnaKLLjC9UCXvA9Pp1Jpgg4DTqfI2Dq7ArJVIEm_XEFaBuj4rTrL0xs-jAF$ ;

function checkPath() {
  const path = location.pathname + https://urldefense.com/v3/__http://location.search__;!!BU9mIh0IHbaI!JrgYCAg_kg9pu_jQVs2Nvz1KqeQfERnaKLLjC9UCXvA9Pp1Jpgg4DTqfI2Dq7ArJVIEm_XEFaBuj4rTrL0xs-jAF$ ;
  if (path !== lastPath) {
    lastPath = path;
    requestAnimationFrame(init);
  }
}

(() => {
  const methods = ['pushState', 'replaceState'];
  for (const method of methods) {
    const original = history[method];
    history[method] = function (...args) {
      original.apply(this, args);
      checkPath();
    };
  }
  window.addEventListener('popstate', checkPath);
})();

const observer = new MutationObserver(checkPath);
if (document.body) {
  observer.observe(document.body, { childList: true, subtree: true });
} else {
  document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

(function setupQueue(window) {
  if (window.ida) return;

  const queue = [];
  let ready = false;

  window.ida = function (cmd, ...args) {
    if (!ready) {
      queue.push([cmd, ...args]);
    } else {
      dispatch(cmd, ...args);
    }
  };

  function dispatch(cmd, ...args) {
    if (cmd === 'track') {
      const [event, data] = args;
      track(event, data);
    } else {
      console.warn('[tracker] Unknown command:', cmd);
    }
  }

  window.__idaReady = function () {
    ready = true;
    queue.forEach(args => dispatch(...args));
    queue.length = 0;
  };
})(window);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    await init();
    window.__idaReady?.();
    window.idaReady?.();
  });
} else {
  (async () => {
    await init();
    window.__idaReady?.();
    window.idaReady?.();
  })();
}
