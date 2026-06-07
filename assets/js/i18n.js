(function () {
  const STORAGE_KEY = 'portfolio-lang';
  const DEFAULT_LANG = 'zh';
  const SUPPORTED_LANGS = new Set(['zh', 'en']);

  const titles = {
    zh: {
      home: 'Xian-Hao (Harry) Liao | 設計作品集',
      about: '關於 Harry | Xian-Hao (Harry) Liao',
      work: '作品總覽 | Xian-Hao (Harry) Liao',
      contact: '聯絡 Harry | Xian-Hao (Harry) Liao',
    },
    en: {
      home: 'Xian-Hao (Harry) Liao | Design Portfolio',
      about: 'About Harry | Xian-Hao (Harry) Liao',
      work: 'Work | Xian-Hao (Harry) Liao',
      contact: 'Contact | Xian-Hao (Harry) Liao',
    },
  };

  const navLabels = {
    zh: {
      home: '首頁',
      about: '關於',
      work: '作品',
      contact: '聯絡',
    },
    en: {
      home: 'HOME',
      about: 'ABOUT',
      work: 'WORK',
      contact: 'CONTACT',
    },
  };

  const homeAccordionZh = [
    ['GATE.COM：Red Bull F1 合作', '負責高保真 UX 與全球活動頁。'],
    ['Boston University：設計教學', '帶領過 30+ 位學生把設計策略落地。'],
    ['The UPS Store：營收與印務優化', '用數位印務與設計整合提升效率。'],
    ['MIT Media Lab：人機互動研究', '參與 Human 2.0 與 AI、BCI、義肢研究。'],
    ['BJ\'s Wholesale Club：動態視覺', '為 NASCAR 與 Nationals 專案製作視覺。'],
    ['MassArt：DMI 網站設計', '優化網站架構與圖像內容，提升體驗。'],
    ['ABC Design：多媒體系統', '建立跨數位與實體的品牌視覺。'],
    ['Cocooks：App 視覺與 UX', '打造直覺的料理平台。'],
    ['Her Way Home：演出視覺', '為音樂演出設計動態畫面。'],
    ['Fresh Media：展覽作品', '以互動與計算媒體參與展出。'],
    ['ARCCSRL：義肢研究', '探索人機互動與助行設計。'],
    ['Your Brain on ChatGPT：媒體訪談', '分享對認知負荷與生成式 AI 的觀察。'],
    ['Dream Reality：論文書', '以書籍與裝置呈現清醒夢敘事。'],
  ];

  const homeProjectZh = [
    'GATE TRAVEL 推出的新產品，主打快速預訂與加密支付。',
    '一款幫助年輕人建立健康飲食習慣的 App。',
    'Harry 與新銳歌手 Luna 合作的音樂單曲視覺MV，描寫女孩的內心世界。',
  ];

  const workCardZh = {
    featured: ['Gate.com 動態設計', '動態設計'],
    grid: [
      ['Gate X RedBull Racing F1 NFT 頁面', 'Web3 / 活動'],
      ['Cocook App 設計', 'App 設計'],
      ['Dream Reality 碩論書', '出版 / 論文'],
      ['BJ\'s 暑期實習設計', '實習 / 品牌'],
      ['For-U 音樂影像', '動態 / MV'],
      ['DMI 網站重設計', '網站重設計'],
      ['ABC DESIGN 社群視覺', '社群視覺'],
      ['MIT ARCCSRL 義肢研究', '研究 / 機器人'],
    ],
    tableHead: ['作品', '類型', '角色', '年份'],
    tableTitles: [
      "BJ's 暑期實習秀片",
      'Gate.com 動態設計',
      'Gate × RedBull F1 NFT',
      'Xian-Hao Harry Liao Showreel',
      'Dream Reality 論文書',
      'Her Way Home｜演出視覺',
      'Cocook App 設計',
      'DMI 網站重設計',
      'ARCCSRL 義肢研究',
      'ABC DESIGN 社群視覺',
      'Osann 形象影片',
      'C-Cube 網站設計',
      'Reno Gordon - “For-U” MV',
    ],
  };

  const aboutZh = {
    aboutTitle: '廖先皓(Harry)',
    bio: 'Harry 是跨領域多媒體設計師，擅長視覺、UX、互動與動態。2024 年取得 MassArt DMI MFA，專注多媒體設計與交互設計。',
    resume: '履歷下載',
    momentsTitle: 'Harry 的亮點',
    moments: ['DMI 學生策展展', 'MIT Media Lab 訓練', 'MassArt MFA 2024'],
    thesisTitle: '論文書',
    thesisBody: '《Dream Reality》：探索夢境與夢的視覺表現。',
    thesisBtn: '論文書 PDF',
    inviteTitle: '邀請您查看Harry的作品集PDF',
    inviteBody: '裡面收集了所有Harry的作品。',
    inviteBtn: '另外開啟PDF',
    workTitle: '看看 廖先皓 Harry線上作品',
    workBtn: '前往作品頁面',
    skill1Title: '設計工具',
    skill1Body: 'Photoshop, Illustrator, InDesign, Premiere, After Effects, Cinema 4D, Blender, Figma.',
    skill2Title: '數位能力',
    skill2Body: 'HTML / CSS / JS, React, Bootstrap, Python, CMS, Google Analytics.',
  };

  const contactZh = {
    kicker: '快來聯絡 廖先皓 Harry',
    send: '寄信',
    caption: '// 有合作、提案或想打聲招呼，歡迎聯絡。',
  };

  function getStoredLang() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (SUPPORTED_LANGS.has(stored)) return stored;
    } catch (e) { }
    return DEFAULT_LANG;
  }

  function setStoredLang(lang) {
    if (!SUPPORTED_LANGS.has(lang)) return DEFAULT_LANG;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) { }
    return lang;
  }

  function getCurrentLang() {
    // If the URL path contains '/zh', force Chinese. Otherwise force English.
    return window.location.pathname.includes('/zh') ? 'zh' : 'en';
  }

  function setDocumentTitle(pageName, lang) {
    const page = pageName || 'home';
    const pageTitles = titles[lang] || titles.en;
    document.title = pageTitles[page] || pageTitles.home;
  }

  function cacheText(el, useHtml = false) {
    const attr = useHtml ? 'data-i18n-original-html' : 'data-i18n-original-text';
    if (!el.hasAttribute(attr)) {
      el.setAttribute(attr, useHtml ? el.innerHTML : el.textContent);
    }
  }

  function localizeText(scope, selector, zhText, options = {}) {
    const elements = Array.from((scope || document).querySelectorAll(selector));
    elements.forEach((el) => {
      const useHtml = Boolean(options.html);
      cacheText(el, useHtml);
      if (getCurrentLang() === 'zh') {
        if (useHtml) {
          el.innerHTML = zhText;
        } else {
          el.textContent = zhText;
        }
        return;
      }

      const attr = useHtml ? 'data-i18n-original-html' : 'data-i18n-original-text';
      const original = el.getAttribute(attr);
      if (original !== null) {
        if (useHtml) {
          el.innerHTML = original;
        } else {
          el.textContent = original;
        }
      }
    });
  }

  function localizeList(scope, selector, zhTexts, options = {}) {
    const elements = Array.from((scope || document).querySelectorAll(selector));
    elements.forEach((el, index) => {
      const zhText = zhTexts[index];
      if (typeof zhText === 'undefined') return;
      localizeText({ querySelectorAll: () => [el] }, ':scope', zhText, options);
    });
  }

  function applyNavLabels(scope) {
    const lang = getCurrentLang();
    const labels = navLabels[lang] || navLabels.en;

    const menuLinks = Array.from((scope || document).querySelectorAll('.main-menu-link[data-menu-key], .mobile-link[data-menu-key]'));
    menuLinks.forEach((link) => {
      const key = link.getAttribute('data-menu-key');
      const label = labels[key] || key || '';
      if (link.classList.contains('main-menu-link')) {
        link.textContent = `${link.classList.contains('active') ? '• ' : ''}${label}`;
      } else {
        link.textContent = label;
      }
    });

    const closeButton = (scope || document).querySelector('.close-btn');
    if (closeButton) {
      cacheText(closeButton, false);
      closeButton.textContent = lang === 'zh' ? '♦ 關閉 ♦' : '♦ CLOSE ♦';
    }

    const footer = (scope || document).querySelector('.mobile-footer-text');
    if (footer) {
      cacheText(footer, false);
      footer.textContent = lang === 'zh' ? '// 設計下一個未來。' : '// Designing the next reality.';
    }

    const toggles = Array.from((scope || document).querySelectorAll('[data-lang-toggle]'));
    toggles.forEach((btn) => {
      cacheText(btn, false);
      btn.innerHTML = '<span class="lang-option lang-en">EN</span><span class="lang-sep">/</span><span class="lang-option lang-zh">中</span>';
      btn.classList.remove('lang-zh-active', 'lang-en-active');
      btn.classList.add(lang === 'zh' ? 'lang-zh-active' : 'lang-en-active');
      btn.setAttribute('aria-label', lang === 'zh' ? '目前是中文，切換到 English' : 'Currently English, switch to 中文');
      btn.setAttribute('title', lang === 'zh' ? '目前是中文，點擊切換到 English' : 'Currently English, click to switch to 中文');
      btn.dataset.currentLang = lang;
    });
  }

  function applyHome(scope) {
    const root = scope || document;
    localizeText(root, '.hero-bottom-info .bottom-left', '設計下一個未來。');
    localizeText(root, '.hero-bottom-info .bottom-right', '▼ 向下探索');
    localizeText(root, '.hero-title', '廖先皓 HARRY');
    localizeText(root, '.description-content p', '♦ 廖先皓 Harry 擅長結合創意策略與科技敘事，具備介面設計、視覺設計、網頁開發經驗。 ♦');
    localizeList(root, '.project-desc', homeProjectZh);
    localizeText(root, '.view-project', '查看專案');
    localizeText(root, '.portfolio-button-label', '看完整作品集');
    localizeList(root, '.clients-header .title-solid', ['精選', '經歷', '影響', '出版文章']);
    localizeList(root, '.clients-header .title-outline', ['客戶', '亮點', '力', '報導']);
    localizeText(root, '.sidebar-label', '[ 視覺設計經歷 ]');
    localizeText(root, '.work-kicker', '索引');
    localizeText(root, '.work-index-head h2', '作品總覽');
    localizeList(root, '.work-table-row--head span', workCardZh.tableHead);
    localizeText(root, '.parallax-title', '科技與人文<br>敘事', { html: true });
    localizeText(root, '.tech-text-box p', '從 Web3 到學術研究，Harry 的作品把靜態畫面變成可沉浸的數位世界。');
    localizeList(root, '.accordion-item .title-text', homeAccordionZh.map((item) => item[0]));
    localizeList(root, '.accordion-item .preview-text', homeAccordionZh.map((item) => item[1]));
    localizeList(root, '.accordion-item .full-text', homeAccordionZh.map((item) => item[1]));
    localizeText(root, '.impact-section .title-solid', '廖先皓 Harry');
    localizeText(root, '.impact-section .title-outline', '影響世界');

    // Impact cards (translated and shortened)
    localizeText(root, '.impact-card:nth-child(1) .card-title', '<span class="bullet">◾</span> 全球專案', { html: true });
    localizeText(root, '.impact-card:nth-child(1) .card-desc', '作為內部視覺設計師，主導高保真 Web3 與全球品牌體驗。');

    localizeText(root, '.impact-card:nth-child(2) .card-title', '<span class="bullet">◾</span> 新興技術', { html: true });
    localizeText(root, '.impact-card:nth-child(2) .card-desc', '參與實驗室計畫，於 MIT 開發原型與研究。');

    localizeText(root, '.impact-card:nth-child(3) .card-title', '<span class="bullet">◾</span> 指導與教學', { html: true });
    localizeText(root, '.impact-card:nth-child(3) .card-desc', '指導 30+ 學生，將創意策略轉為業界實作。');

    localizeText(root, '.impact-card:nth-child(4) .card-title', '<span class="bullet">◾</span> 沉浸式展演', { html: true });
    localizeText(root, '.impact-card:nth-child(4) .card-desc', '策展 10+ 沉浸式體驗，整合空間與視覺展演。');
    localizeText(root, '.contact-kicker', '');
    localizeText(root, '.contact-send', '');
    // Learn more section on home
    localizeText(root, '.learn-more-title', '進一步了解 廖先皓 Harry');
    localizeText(root, '.learn-more-btn span:first-child', '進入關於頁面');
  }

  function applyAbout(scope) {
    const root = scope || document;
    localizeText(root, '.about-title', aboutZh.aboutTitle);
    localizeText(root, '.about-sub', aboutZh.bio);
    localizeText(root, '.resume-btn', aboutZh.resume);

    // Set the resume href based on language
    const resumeBtn = root.querySelector('.resume-btn');
    if (resumeBtn) {
      const scriptEl = document.querySelector('script[src*="about.js"]');
      const scriptSrc = scriptEl ? scriptEl.getAttribute('src') : '';
      const match = scriptSrc.match(/^(.*)assets\/js\/about\.js/);
      const prefix = match ? match[1] : '';
      
      if (getCurrentLang() === 'zh') {
        resumeBtn.setAttribute('href', prefix + 'upload/廖先皓_中文簡歷.pdf');
      } else {
        resumeBtn.setAttribute('href', prefix + 'upload/Resume_Harry_Liao_CN.pdf');
      }
    }

    localizeText(root, '.moments-title', aboutZh.momentsTitle);
    localizeList(root, '.moment-card p', aboutZh.moments);
    localizeText(root, '.thesis-text h3', aboutZh.thesisTitle);
    localizeText(root, '.thesis-text p', aboutZh.thesisBody);
    localizeText(root, '.thesis-btn', aboutZh.thesisBtn);
    localizeText(root, '.invite-cta h3', aboutZh.inviteTitle);
    localizeText(root, '.invite-cta p', aboutZh.inviteBody);
    localizeText(root, '.primary', aboutZh.inviteBtn);

    // skill blocks
    localizeText(root, '.skill-row .skill-block:nth-child(1) h3', aboutZh.skill1Title);
    localizeText(root, '.skill-row .skill-block:nth-child(1) p', aboutZh.skill1Body);
    localizeText(root, '.skill-row .skill-block:nth-child(2) h3', aboutZh.skill2Title);
    localizeText(root, '.skill-row .skill-block:nth-child(2) p', aboutZh.skill2Body);
    // About page 'View My Work' / CTA translation
    localizeText(root, '.learn-more-title', aboutZh.workTitle);
    localizeText(root, '.learn-more-btn span:first-child', aboutZh.workBtn);
  }

  function applyWork(scope) {
    const root = scope || document;
    localizeText(root, '.work-kicker', '索引');
    localizeText(root, '.work-index-head h2', '作品總覽');
    localizeList(root, '.work-table-row--head span', workCardZh.tableHead);
    localizeList(root, '.work-table .work-table-link span:nth-child(2)', workCardZh.tableTitles);
    localizeText(root, '.work-featured .work-overlay h2', workCardZh.featured[0]);
    localizeText(root, '.work-featured .work-overlay p', workCardZh.featured[1]);
    localizeList(root, '.work-grid .work-overlay h2', workCardZh.grid.map((item) => item[0]));
    localizeList(root, '.work-grid .work-overlay p', workCardZh.grid.map((item) => item[1]));
    localizeText(root, '.learn-more-title', '聯絡 廖先皓 Harry');
    localizeText(root, '.learn-more-btn span:first-child', '點這邊');
  }

  function applyContact(scope) {
    const root = scope || document;
    localizeText(root, '.contact-kicker', contactZh.kicker);
    localizeText(root, '.contact-send', contactZh.send);
    localizeText(root, '.contact-video-caption span', contactZh.caption);
  }

  function applySiteLanguage(scope = document, pageName) {
    const lang = getCurrentLang();
    const page = pageName || (document.body && document.body.dataset.sitePage) || 'home';
    if (document.documentElement) {
      document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
      document.documentElement.dataset.siteLang = lang;
    }
    if (document.body) {
      document.body.dataset.siteLang = lang;
      document.body.dataset.sitePage = page;
    }

    setDocumentTitle(page, lang);
    applyNavLabels(scope);

    if (page === 'home') {
      applyHome(scope);
    } else if (page === 'about') {
      applyAbout(scope);
    } else if (page === 'work') {
      applyWork(scope);
    } else if (page === 'contact') {
      applyContact(scope);
    }
  }

  function setSiteLanguage(lang, scope = document, pageName) {
    const next = setStoredLang(lang);
    applySiteLanguage(scope, pageName);
    // update URL hash for current page without firing hashchange
    try {
      const page = pageName || (document.body && document.body.dataset.sitePage) || 'home';
      if (window.history && window.history.replaceState) {
        try { window.history.replaceState({ spa: page, lang: next }, '', `/#${page}-${next}`); } catch (e) { }
      }
    } catch (e) { }
    // notify other modules the language changed
    try {
      const ev = new CustomEvent('site-language-changed', { detail: { lang: next, page: pageName || (document.body && document.body.dataset.sitePage) || 'home' } });
      window.dispatchEvent(ev);
    } catch (e) { }
    return next;
  }

  function toggleSiteLanguage(scope = document, pageName) {
    const path = window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '');
    const isZh = path.startsWith('zh');
    const page = isZh ? path.replace(/^zh\/?/, '') : path;
    
    if (isZh) {
      // Go to English
      window.location.href = '/' + page;
    } else {
      // Go to Chinese
      window.location.href = '/zh/' + page;
    }
    return isZh ? 'en' : 'zh';
  }

  function getLanguageForToggle() {
    return getCurrentLang();
  }

  window.applySiteLanguage = applySiteLanguage;
  window.setSiteLanguage = setSiteLanguage;
  window.toggleSiteLanguage = toggleSiteLanguage;
  window.getCurrentSiteLanguage = getCurrentLang;
  window.getLanguageForToggle = getLanguageForToggle;
})();
