(function(window) {
  'use strict';

  const DEBUG = false;

  function log(...args) {
    if (DEBUG) console.debug('[OtSDK]', ...args);
  }

  class PolyfillManager {
    constructor(nonce) {
      this.nonce = nonce;
    }
    applyStyleSanitizer() {
      const orig = Element.prototype.setAttribute;
      Element.prototype.setAttribute = function(name, value) {
        if (name.toLowerCase() === 'style') {
          // sanitize style value
          const obj = PolyfillManager.strToObj(value);
          if (obj) {
            orig.call(this, name, ''); // remove any existing style
            for (const prop in obj) {
              this.style[prop] = obj[prop];
            }
          }
        } else {
          orig.call(this, name, value);
        }
      };
    }
    static strToObj(str) {
      // same as before, but return null on suspicious input
      if (!str.includes(':')) return null;
      return str.split(';').reduce((o, kv) => {
        const [raw, val] = kv.split(/:(.+)/);
        if (raw && val) {
          const key = raw.trim().replace(/-[a-z]/g, m => m[1].toUpperCase());
          o[key] = val.trim();
        }
        return o;
      }, {});
    }
  }

  class FetchManager {
    static async getJSON(url, headers = {}) {
      FetchManager.assertSafeUrl(url);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      try {
        const resp = await fetch(url, {
          method: 'GET',
          headers,
          credentials: 'omit',
          signal: controller.signal
        });
        clearTimeout(timer);
        if (!resp.ok) throw new Error(`Fetch failed: ${resp.status}`);
        return await resp.json();
      } catch (err) {
        log('FetchManager error:', err);
        throw err;
      }
    }
    static assertSafeUrl(url) {
      const u = new URL(url, location.origin);
      if (u.protocol !== 'https:' || u.hostname !== new URL(window.SDK_BASE_URL).hostname) {
        throw new Error('Unsafe URL blocked: ' + url);
      }
    }
  }

  class ConsentSDK {
    constructor(config) {
      this.config = config;
      this.nonce = null;
      this.preferences = null;
      this.domainData = null;
    }

    async init() {
      this.captureNonce();
      const domainUrl = this.config.domainJsonUrl;
      this.domainData = await FetchManager.getJSON(domainUrl);
      if (this.config.include preferences) {
        this.preferences = await FetchManager.getJSON(this.config.preferencesUrl, this.config.headers);
      }
      // Now apply CSP polyfill only if flagged
      if (this.domainData.features?.enableInlineStylePolyfill && this.nonce) {
        new PolyfillManager(this.nonce).applyStyleSanitizer();
      }
      this.injectBannerScript();
    }

    captureNonce() {
      const el = document.querySelector(`script[src*="${this.config.stubName}"]`);
      this.nonce = el?.nonce || el?.getAttribute('nonce') || null;
    }

    injectBannerScript() {
      const scriptUrl = this.config.sdkUrl;
      FetchManager.assertSafeUrl(scriptUrl);
      const scr = document.createElement('script');
      scr.src = scriptUrl;
      scr.async = true;
      if (this.nonce) scr.setAttribute('nonce', this.nonce);
      if (this.config.crossOrigin) scr.setAttribute('crossorigin', this.config.crossOrigin);
      document.head.appendChild(scr);
      log('Injected banner SDK script:', scriptUrl);
    }
  }

  // Boot logic:
  window.OtSDKStub = {
    async init(config) {
      try {
        const sdk = new ConsentSDK(config);
        await sdk.init();
        log('Consent SDK initialized successfully.');
      } catch (err) {
        console.error('Consent SDK failed to init:', err);
      }
    }
  };
})(window);
