/* =========================================
   GSAP + Three.js 動畫控制器
   Portfolio of Xian-Hao (Harry) Liao
   =========================================
   依賴：GSAP 3.12+, ScrollTrigger, Three.js
   ========================================= */

(function () {
  'use strict';

  // ── 前置檢查 ──────────────────────────────────
  if (typeof gsap === 'undefined') {
    console.warn('[animations.js] GSAP not loaded — skipping animations.');
    return;
  }

  // 尊重使用者「減少動態效果」的系統偏好
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);
  document.body.classList.add('gsap-active');

  const mobile = () => window.innerWidth <= 768;

  // ── 工具函式 ──────────────────────────────────

  /**
   * 將元素文字拆分成單獨的 <span class="char">，
   * 讓每個字母都能獨立做 transform 動畫。
   */
  function splitTextToChars(el) {
    const text = el.textContent;
    el.setAttribute('aria-label', text);
    el.innerHTML = '';
    text.split('').forEach(c => {
      const span = document.createElement('span');
      span.className = 'char';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = c === ' ' ? '\u00A0' : c;
      el.appendChild(span);
    });
    return el.querySelectorAll('.char');
  }

  /**
   * 將元素的文字節點拆成 <span class="anim-word">，
   * 保留 <br> 等既有子元素不變。
   */
  function wrapWordsInSpans(el) {
    const fragment = document.createDocumentFragment();
    Array.from(el.childNodes).forEach(node => {
      if (node.nodeType === 3) { // 文字節點
        node.textContent.split(/(\s+)/).forEach(part => {
          if (part.trim()) {
            const span = document.createElement('span');
            span.className = 'anim-word';
            span.textContent = part;
            fragment.appendChild(span);
          } else if (part) {
            fragment.appendChild(document.createTextNode(part));
          }
        });
      } else {
        fragment.appendChild(node.cloneNode(true));
      }
    });
    el.innerHTML = '';
    el.appendChild(fragment);
    return el.querySelectorAll('.anim-word');
  }


  // ═══════════════════════════════════════════
  //  GSAP 動畫效果
  // ═══════════════════════════════════════════

  // ── 1. Hero 標題逐字飛入 ──────────────────────
  function initHeroTitle() {
    const title = document.querySelector('.hero-title');
    if (!title) return;

    // 關閉既有 CSS 動畫，改由 GSAP 完整接管
    title.style.animation = 'none';
    title.style.opacity = '0'; // 保持隱藏直到 chars 就位

    const chars = splitTextToChars(title);

    gsap.set(chars, {
      opacity: 0,
      y: mobile() ? 30 : 60,
      rotateX: -90,
      transformPerspective: 600
    });

    // 父容器設為可見（子 chars 仍各自隱藏）
    title.style.opacity = '1';

    // 逐字飛入動畫
    gsap.to(chars, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: mobile() ? 0.6 : 0.9,
      stagger: 0.04,
      ease: 'back.out(1.4)',
      delay: 0.5,
      onComplete: function () {
        // 飛入完成後加上持續呼吸光暈
        gsap.to(chars, {
          textShadow: '0 0 12px rgba(255,255,255,0.25)',
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: { each: 0.08, from: 'center' }
        });
      }
    });
  }

  // ── 2. Hero 底部資訊左右滑入 ──────────────────
  function initHeroBottomInfo() {
    const bottomInfo = document.querySelector('.hero-bottom-info');
    if (!bottomInfo) return;

    bottomInfo.style.animation = 'none';
    bottomInfo.style.opacity = '1';

    const left = bottomInfo.querySelector('.bottom-left');
    const right = bottomInfo.querySelector('.bottom-right');

    if (left) {
      gsap.fromTo(left,
        { opacity: 0, x: -40 },
        { opacity: 0.8, x: 0, duration: 0.8, ease: 'power2.out', delay: 1.4 }
      );
    }
    if (right) {
      gsap.fromTo(right,
        { opacity: 0, x: 40 },
        { opacity: 0.8, x: 0, duration: 0.8, ease: 'power2.out', delay: 1.6 }
      );
    }
  }

  // ── 3. Description strip 文字展開 ─────────────
  function initDescriptionStrip() {
    const strip = document.querySelector('.description-strip');
    if (!strip) return;

    const content = strip.querySelector('.description-content p');
    if (!content) return;

    gsap.fromTo(content,
      { opacity: 0, y: 25, scale: 0.95 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: strip,
          start: 'top 82%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // ── 4. Section headers 滑入 + 模糊 → 清晰 ────
  function initSectionHeaders() {
    const headers = document.querySelectorAll('.clients-header');

    headers.forEach(header => {
      const solid = header.querySelector('.title-solid');
      const outline = header.querySelector('.title-outline');

      if (solid) {
        gsap.fromTo(solid,
          { opacity: 0, x: mobile() ? -30 : -80, filter: 'blur(10px)' },
          {
            opacity: 1, x: 0, filter: 'blur(0px)',
            duration: mobile() ? 0.6 : 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: header,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }

      if (outline) {
        gsap.fromTo(outline,
          { opacity: 0, x: mobile() ? 30 : 80, filter: 'blur(10px)' },
          {
            opacity: 1, x: 0, filter: 'blur(0px)',
            duration: mobile() ? 0.6 : 1,
            ease: 'power3.out',
            delay: 0.15,
            scrollTrigger: {
              trigger: header,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    });
  }

  // ── 5. Project cards 視差揭露 ─────────────────
  function initProjectCards() {
    const cards = document.querySelectorAll('.simple-media .project-info');

    cards.forEach(card => {
      const title = card.querySelector('.project-title');
      const desc = card.querySelector('.project-desc');
      const link = card.querySelector('.view-project');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card.closest('.simple-media'),
          start: 'top 55%',
          toggleActions: 'play none none reverse'
        }
      });

      if (title) {
        tl.fromTo(title,
          { opacity: 0, y: 45 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
        );
      }
      if (desc) {
        tl.fromTo(desc,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        );
      }
      if (link) {
        tl.fromTo(link,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          '-=0.3'
        );
      }
    });
  }

  // ── 6. Career accordion 交錯入場 ──────────────
  function initCareerAccordion() {
    const containers = document.querySelectorAll('.accordion-container');

    containers.forEach(container => {
      const items = container.querySelectorAll('.accordion-item');
      if (!items.length) return;

      gsap.fromTo(items,
        { opacity: 0, x: mobile() ? 20 : 50 },
        {
          opacity: 1, x: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 82%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }

  // ── 7. Impact cards 縮放 + 淡入 ───────────────
  function initImpactCards() {
    const cards = document.querySelectorAll('.impact-card');
    if (!cards.length) return;

    gsap.fromTo(cards,
      { opacity: 0, y: 40, scale: 0.88 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.65,
        stagger: 0.12,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: '.impact-grid',
          start: 'top 82%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // ── 8. Parallax section 文字逐字揭露 ──────────
  function initParallaxText() {
    const title = document.querySelector('.parallax-title');
    const smallLabel = document.querySelector('.parallax-content .small-label');
    const techBox = document.querySelector('.tech-text-box');
    if (!title) return;

    const words = wrapWordsInSpans(title);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.parallax-section',
        start: 'top 50%',
        toggleActions: 'play none none reverse'
      }
    });

    if (smallLabel) {
      tl.fromTo(smallLabel,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }

    tl.fromTo(words,
      { opacity: 0, y: 25, filter: 'blur(4px)' },
      {
        opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 0.5,
        stagger: 0.06,
        ease: 'power2.out'
      },
      smallLabel ? '-=0.2' : 0
    );

    if (techBox) {
      tl.fromTo(techBox,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      );
    }
  }


  // ── 10. Portfolio button 脈動光暈 ─────────────
  function initPortfolioButton() {
    const btn = document.querySelector('.portfolio-button');
    if (!btn) return;

    // 持續發光脈動
    gsap.to(btn, {
      boxShadow: '0 0 25px rgba(255,255,255,0.2), 0 0 60px rgba(255,255,255,0.06)',
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // 滾動進場
    gsap.fromTo(btn,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: btn,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // ── 11. Learn More 區塊 ───────────────────────
  function initLearnMore() {
    const section = document.querySelector('.learn-more-section');
    if (!section) return;

    const title = section.querySelector('.learn-more-title');
    const btn = section.querySelector('.learn-more-btn');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });

    if (title) {
      tl.fromTo(title,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
      );
    }
    if (btn) {
      tl.fromTo(btn,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      );
    }
  }

  // ── 12. Bottom showcase 圖片條入場 ────────────
  function initBottomShowcase() {
    const items = document.querySelectorAll('.strip-item');
    if (!items.length) return;

    gsap.fromTo(items,
      { opacity: 0, y: 30, scale: 0.94 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.55,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.image-strip',
          start: 'top 88%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }



  // ═══════════════════════════════════════════
  //  啟動所有動畫
  // ═══════════════════════════════════════════
  initHeroTitle();
  initHeroBottomInfo();
  initDescriptionStrip();
  initSectionHeaders();
  initProjectCards();
  initCareerAccordion();
  initImpactCards();
  initParallaxText();
  initPortfolioButton();
  initLearnMore();
  initBottomShowcase();

  // 語言切換後重新計算 ScrollTrigger 位置
  window.addEventListener('site-language-changed', () => {
    ScrollTrigger.refresh();
  });

})();
