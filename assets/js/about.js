// about.js
// Shared SPA loader for About and Work fragments with matching slide animation.
(function () {
  const root = document.getElementById('mainContent');
  if (!root) {
    window.openAbout = function () { window.location.href = '/about'; };
    window.openWork = function () { window.location.href = '/work'; };
    window.openContact = function () { window.location.href = '/contact'; };
    window.closeSpaPage = function () { window.history.back(); };
    window.closeAbout = window.closeSpaPage;
    window.closeWork = window.closeSpaPage;
    window.closeContact = window.closeSpaPage;
    return;
  }

  let originalHTML = root.innerHTML;
  let originalScroll = 0;
  let currentPage = null;
  let closingViaHistory = false;

  function bindSpaTargetLinks(scope) {
    if (!scope) return;
    const links = scope.querySelectorAll('a[data-spa-target]');
    links.forEach((link) => {
      if (link.dataset.spaBound === '1') return;
      link.dataset.spaBound = '1';
      link.addEventListener('click', (event) => {
        const target = link.getAttribute('data-spa-target');
        if (!target) return;
        event.preventDefault();
        if (target === 'about') {
          loadPage('about', true);
          return;
        }
        if (target === 'work') {
          loadPage('work', true);
          return;
        }
        if (target === 'contact') {
          loadPage('contact', true);
        }
      });
    });
  }

  // Persist scroll position across full-page reloads so we can restore after replacing DOM
  window.addEventListener('beforeunload', () => {
    try {
      const data = { path: location.pathname || '', y: window.scrollY || window.pageYOffset || 0 };
      sessionStorage.setItem('spa-scroll', JSON.stringify(data));
    } catch (e) { }
  });

  function loadPage(pageName, pushState = true) {
    if (currentPage === pageName) return Promise.resolve();

    const token = Symbol(pageName);
    loadPage._token = token;

    // Prevent FOUC on SPA-triggered page navigation.
    if (pushState && (pageName === 'about' || pageName === 'work' || pageName === 'contact')) {
      try {
        document.documentElement.classList.add('spa-loading');
        document.body.classList.add('spa-loading');
      } catch (e) { }
    }

    const scriptEl = document.querySelector('script[src*="about.js"]');
    const scriptSrc = scriptEl ? scriptEl.getAttribute('src') : '';
    const match = scriptSrc.match(/^(.*)assets\/js\/about\.js/);
    const prefix = match ? match[1] : '';
    return fetch(`${prefix}${pageName}-content.html`, { cache: 'no-store' })
      .then(r => r.text())
      .then(html => {
        if (loadPage._token !== token) return;

        if (!currentPage) {
          originalHTML = root.innerHTML;
          originalScroll = window.scrollY || window.pageYOffset || 0;
        }

        root.classList.remove('page-exit');
        root.classList.remove('page-enter');
        root.innerHTML = html;

        // Rewrite relative paths in the loaded fragment using the page depth prefix
        if (prefix) {
          root.querySelectorAll('img[src], video[src], source[src], video[poster], video[data-fallback], iframe[data-fallback]').forEach(el => {
            if (el.hasAttribute('src')) {
              const srcVal = el.getAttribute('src');
              if (srcVal && !srcVal.startsWith('http') && !srcVal.startsWith('/') && !srcVal.startsWith('.') && !srcVal.startsWith('data:')) {
                el.setAttribute('src', prefix + srcVal);
              }
            }
            const posterVal = el.getAttribute('poster');
            if (posterVal && !posterVal.startsWith('http') && !posterVal.startsWith('/') && !posterVal.startsWith('.')) {
              el.setAttribute('poster', prefix + posterVal);
            }
            const fallbackVal = el.getAttribute('data-fallback');
            if (fallbackVal && !fallbackVal.startsWith('http') && !fallbackVal.startsWith('/') && !fallbackVal.startsWith('.')) {
              el.setAttribute('data-fallback', prefix + fallbackVal);
            }
          });

          root.querySelectorAll('a[href], link[href]').forEach(el => {
            const hrefVal = el.getAttribute('href');
            if (hrefVal && !hrefVal.startsWith('http') && !hrefVal.startsWith('/') && !hrefVal.startsWith('.') && !hrefVal.startsWith('#')) {
              el.setAttribute('href', prefix + hrefVal);
            }
          });
        }

        bindSpaTargetLinks(root);

        if (document.body) {
          document.body.dataset.sitePage = pageName;
        }

        if (typeof window.applySiteLanguage === 'function') {
          window.applySiteLanguage(root, pageName);
        }

        if (typeof window.initEmbeddedMediaFallback === 'function') {
          window.initEmbeddedMediaFallback(root);
        }
        if (typeof window.initLazyIframes === 'function') {
          window.initLazyIframes(root);
        }

        if (typeof window.initWorkMediaFallback === 'function') {
          window.initWorkMediaFallback(root);
        }

        document.body.classList.remove('spa-about', 'spa-work', 'spa-contact');
        document.body.classList.add(`spa-${pageName}`);

        requestAnimationFrame(() => root.classList.add('page-enter'));
        if (pushState) {
          // only jump to top when this navigation originated from an SPA action
          window.scrollTo({ top: 0 });
        }
        currentPage = pageName;

        // Reveal page after the fragment has rendered.
        if (pushState) {
          requestAnimationFrame(() => {
            try {
              document.documentElement.classList.remove('spa-loading');
              document.body.classList.remove('spa-loading');
            } catch (e) { }
          });
        }

        if (pageName === 'contact') {
          const copyButton = document.querySelector('[data-copy-text]');
          if (copyButton) {
            copyButton.addEventListener('click', async () => {
              const copyText = copyButton.getAttribute('data-copy-text') || '';
              try {
                if (navigator.clipboard && window.isSecureContext) {
                  await navigator.clipboard.writeText(copyText);
                } else {
                  const tempInput = document.createElement('textarea');
                  tempInput.value = copyText;
                  tempInput.style.position = 'fixed';
                  tempInput.style.opacity = '0';
                  document.body.appendChild(tempInput);
                  tempInput.focus();
                  tempInput.select();
                  document.execCommand('copy');
                  document.body.removeChild(tempInput);
                }
                copyButton.textContent = 'COPIED';
                setTimeout(() => {
                  copyButton.textContent = copyText;
                }, 1200);
              } catch (copyError) {
                console.error('Copy email failed:', copyError);
              }
            });
          }
        }

        const closeBtn = document.getElementById(`${pageName}CloseBtn`);
        if (closeBtn) closeBtn.addEventListener('click', () => closePage(true));

        if (pushState && window.history && window.history.pushState) {
          try {
            const lang = (window.getCurrentSiteLanguage && window.getCurrentSiteLanguage()) || 'en';
            const prefix = lang === 'zh' ? '/zh' : '';
            window.history.pushState({ spa: pageName }, '', `${prefix}/${pageName}`);
            window.dispatchEvent(new CustomEvent('spa-navigation-changed', { detail: { page: pageName, lang } }));
          } catch (e) { }
        }
      })
      .catch(err => {
        console.error(`Failed to load ${pageName}.html, falling back to full navigation`, err);
        window.location.href = `/${pageName}`;
      });
  }

  function closePage(replaceState = true) {
    if (!currentPage) return;

    const pageName = currentPage;
    if (replaceState && window.history && window.history.state && window.history.state.spa === pageName) {
      closingViaHistory = true;
    }

    root.classList.remove('page-enter');
    root.classList.add('page-exit');
    root.addEventListener('animationend', function handler() {
      root.removeEventListener('animationend', handler);
      root.classList.remove('page-exit');
      root.innerHTML = originalHTML;
      document.body.classList.remove('spa-about', 'spa-work', 'spa-contact');
      if (document.body) {
        document.body.dataset.sitePage = 'home';
      }
      if (typeof window.applySiteLanguage === 'function') {
        window.applySiteLanguage(root, 'home');
      }
      window.scrollTo({ top: originalScroll });
      try { document.documentElement.classList.remove('spa-loading'); document.body.classList.remove('spa-loading'); } catch (e) { }
      currentPage = null;
    });

    if (replaceState && window.history && window.history.state && window.history.state.spa === pageName) {
      try { window.history.back(); } catch (e) { }
    }
  }

  window.addEventListener('popstate', (e) => {
    if (closingViaHistory) {
      closingViaHistory = false;
      return;
    }

    const state = e.state || {};
    if (state.spa === 'about' || state.spa === 'work' || state.spa === 'contact') {
      loadPage(state.spa, false);
    } else if (currentPage) {
      closePage(false);
    }
  });

  window.openAbout = function () { return loadPage('about', true); };
  window.openWork = function () { return loadPage('work', true); };
  window.openContact = function () { return loadPage('contact', true); };
  window.closeSpaPage = closePage;
  window.closeAbout = closePage;
  window.closeWork = closePage;
  window.closeContact = closePage;

  // Load SPA fragment from URL path on initial load (so refresh keeps current view)
  function loadFromPath() {
    const path = location.pathname.replace(/^\/+/, '').replace(/\/+$/, '');
    const isZh = path.startsWith('zh');
    const page = (isZh ? path.replace(/^zh\/?/, '') : path).toLowerCase();

    if (page === 'about' || page === 'work' || page === 'contact') {
      if (document.body) {
        document.body.dataset.sitePage = page;
      }
      if (window.history && window.history.replaceState) {
        try {
          window.history.replaceState({ spa: page }, '', window.location.pathname);
        } catch (e) { }
      }
      // load without pushing a new history entry
      loadPage(page, false).then(() => {
        // Wait for images/videos then poll the fragment height until stable,
        // then restore scroll and reveal the fragment.
        const waitForMedia = (container, timeout = 800) => {
          try {
            const imgs = Array.from(container.querySelectorAll('img'));
            const vids = Array.from(container.querySelectorAll('video'));
            const promises = [];
            imgs.forEach(img => {
              if (img.complete) return;
              promises.push(new Promise(res => { img.addEventListener('load', res); img.addEventListener('error', res); }));
            });
            vids.forEach(v => {
              if (v.readyState >= 2) return;
              promises.push(new Promise(res => { v.addEventListener('loadedmetadata', res); v.addEventListener('error', res); }));
            });
            if (promises.length === 0) return Promise.resolve();
            return Promise.race([Promise.all(promises), new Promise(res => setTimeout(res, timeout))]);
          } catch (e) { return Promise.resolve(); }
        };

        const waitForStableHeight = (container, options = {}) => {
          const interval = options.interval || 100;
          const timeout = options.timeout || 1200;
          return new Promise(resolve => {
            let last = container.scrollHeight;
            let stableCount = 0;
            const start = Date.now();
            const t = setInterval(() => {
              const nowH = container.scrollHeight;
              if (nowH === last) {
                stableCount += 1;
              } else {
                stableCount = 0;
                last = nowH;
              }
              // consider stable if unchanged for two consecutive checks
              if (stableCount >= 2) {
                clearInterval(t);
                resolve();
              }
              if (Date.now() - start > timeout) {
                clearInterval(t);
                resolve();
              }
            }, interval);
          });
        };

        waitForMedia(root, 1000).then(() => waitForStableHeight(root, { interval: 120, timeout: 1600 })).then(() => {
          try {
            const raw = sessionStorage.getItem('spa-scroll');
            if (raw) {
              const obj = JSON.parse(raw);
              if ((obj.path || '') === (location.pathname || '')) {
                window.scrollTo({ top: obj.y });
                sessionStorage.removeItem('spa-scroll');
              }
            }
          } catch (e) { }
          try { document.documentElement.classList.remove('spa-loading'); document.body.classList.remove('spa-loading'); } catch (e) { }
        });
      });
    }
  }

  // Run on initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFromPath);
  } else {
    loadFromPath();
  }

  bindSpaTargetLinks(document);

})();
