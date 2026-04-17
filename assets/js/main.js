document.addEventListener('DOMContentLoaded', () => {
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    video.muted = true;
    video.play().catch(e => console.warn("影片播放受限:", e));
  });
});

let ticking = false;
const isMobileViewport = () => window.matchMedia('(max-width: 900px)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateParallax() {
  // 手機與使用者偏好減少動態時，停用重視差以換取流暢度。
  if (isMobileViewport() || prefersReducedMotion) {
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
      heroVideo.style.transform = 'translateY(0px) scale(1.05)';
    }

    const blackPanelSections = document.querySelectorAll('.featured-clients-section, .career-section, .impact-section');
    blackPanelSections.forEach(section => {
      section.style.transform = 'translateY(0px)';
      section.style.opacity = '1';
      section.style.filter = 'brightness(1)';
    });

    const parallaxSection = document.querySelector('.parallax-section');
    if (parallaxSection) {
      parallaxSection.style.setProperty('--parallax-zoom', 'cover');
      parallaxSection.style.setProperty('--parallax-y', '50%');
      parallaxSection.style.setProperty('--parallax-reveal', '1');
    }

    const groups = document.querySelectorAll('.parallax-group .parallax-video');
    groups.forEach(video => {
      video.style.transform = 'translateY(0px)';
    });
    ticking = false;
    return;
  }

  // Hero 影片以慢速跟隨捲動，營造「停留在原地」的視差感。
  const heroVideo = document.getElementById('hero-video');
  const heroSection = document.querySelector('.hero-section');
  if (heroVideo && heroSection) {
    const heroRect = heroSection.getBoundingClientRect();
    const freezeStrength = 0.92;
    const maxOffset = heroSection.offsetHeight * 0.55;
    const heroOffset = Math.min(Math.max((-heroRect.top) * freezeStrength, 0), maxOffset);
    heroVideo.style.transform = `translateY(${heroOffset}px) scale(1.12)`;
  }

  // 2. 影片的相對視差位移
  const groups = document.querySelectorAll('.parallax-group');
  groups.forEach(group => {
    const video = group.querySelector('.parallax-video');
    // 安全檢查：確保該區塊內真的有影片才執行
    if (video) {
      const rect = group.getBoundingClientRect();
      
      // 出現在視窗內才運算，節省效能
      if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        const yPos = rect.top * -0.3; // 控制視差強度 (-0.3)
        video.style.transform = `translateY(${yPos}px)`;
      }
    }
  });

  // 3. 進入 parallax 區塊前，讓上方黑色內容區像同一塊面板被拉走，
  //    並揭露下方固定於中線的內容。
  const blackPanelSections = document.querySelectorAll('.featured-clients-section, .career-section, .impact-section');
  const parallaxSection = document.querySelector('.parallax-section');
  if (blackPanelSections.length > 0 && parallaxSection) {
    const parallaxTop = parallaxSection.getBoundingClientRect().top;
    const start = window.innerHeight * 1.05;
    const end = window.innerHeight * 0.1;
    const rawProgress = (start - parallaxTop) / (start - end);
    const progress = Math.min(Math.max(rawProgress, 0), 1);
    const revealProgress = Math.min(Math.max((progress - 0.03) / 0.97, 0), 1);

    const liftY = progress * 220;
    const fade = 1 - progress * 0.45;
    const dim = 1 - progress * 0.24;
    const zoom = 138 - progress * 26;
    const posY = 56 - progress * 8;

    blackPanelSections.forEach(section => {
      section.style.transform = `translateY(${-liftY}px)`;
      section.style.opacity = String(fade);
      section.style.filter = `brightness(${dim})`;
    });

    parallaxSection.style.setProperty('--parallax-zoom', `${zoom}%`);
    parallaxSection.style.setProperty('--parallax-y', `${posY}%`);
    parallaxSection.style.setProperty('--parallax-reveal', String(revealProgress));
  }
  
  ticking = false;
}

// 監聽滾動事件，使用 requestAnimationFrame 確保動畫滑順不卡頓
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(updateParallax);
    ticking = true;
  }
}, { passive: true });

window.addEventListener('resize', updateParallax);
updateParallax();

document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll('.counter');
  const section = document.querySelector('.impact-section');
  if (!section || counters.length === 0) return;

  let isSectionVisible = false;
  let animationToken = 0;

  const animateCounters = () => {
    animationToken += 1;
    const currentToken = animationToken;

    // 縮短總時長，讓數字更快到定位。
    const animationDuration = 1000;

    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      counter.innerText = '0';
      let startTime = null;

      const step = (currentTime) => {
        if (currentToken !== animationToken) return;
        if (!startTime) startTime = currentTime;
        // 計算目前進度 (0 到 1)
        const progress = Math.min((currentTime - startTime) / animationDuration, 1);
        
        // 緩動公式 (Ease-in): 一開始慢，後段加速。
        const easeIn = progress * progress * progress;
        
        counter.innerText = Math.floor(easeIn * target);

        if (progress < 1) {
          requestAnimationFrame(step); // 繼續下一幀動畫
        } else {
          counter.innerText = target; // 確保最後精準停在目標數字
        }
      };
      
      requestAnimationFrame(step);
    });
  };

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.2
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isSectionVisible) {
        isSectionVisible = true;
        animateCounters();
      } else if (!entry.isIntersecting) {
        isSectionVisible = false;
      }
    });
  }, observerOptions);

  observer.observe(section);
});