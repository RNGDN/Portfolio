document.addEventListener("DOMContentLoaded", function() {

  // --- 1. 背景影片播放防護 ---
  const heroVideo = document.getElementById('hero-video');
  if (heroVideo) {
    let playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => console.warn("影片自動播放被阻擋:", error));
    }
  }

  // --- 2. 桌面版選單互動 ---
  const menuLinks = document.querySelectorAll('.main-menu-link');
  // 選取所有 Logo (含桌面與手機)
  const logoLinks = document.querySelectorAll('.logo-link'); 

  function updateDesktopMenu(clickedLink) {
    menuLinks.forEach(item => {
      item.classList.remove('active');
      item.textContent = item.textContent.replace('• ', '');
    });
    if (clickedLink && clickedLink.classList.contains('main-menu-link')) {
      clickedLink.classList.add('active');
      clickedLink.textContent = '• ' + clickedLink.textContent;
    }
  }

  menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      updateDesktopMenu(this);
      // 【修改文字： console 輸出改為 Harry Liao 相關】
      console.log('桌面選單準備切換，目標網址:', this.getAttribute('href'));
    });
  });

  // 點擊 Logo 回首頁
  logoLinks.forEach(logo => {
    logo.addEventListener('click', function(e) {
      e.preventDefault();
      const homeLink = document.querySelector('.main-menu-link[href="/home"]');
      if (homeLink) {
        updateDesktopMenu(homeLink);
        homeLink.classList.add('active');
        if(!homeLink.textContent.includes('•')) homeLink.textContent = '• ' + homeLink.textContent;
      }
      // 【修改文字： console 輸出改為 Harry Liao 相關】
      console.log('Logo 點擊，準備切換回首頁:', this.getAttribute('href'));
    });
  });

  // --- 3. 手機版全螢幕選單互動 ---
  const mobileMenu = document.getElementById('mobileMenu');
  const openMenuBtn = document.getElementById('openMenuBtn');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // 開啟選單
  if (openMenuBtn && mobileMenu) {
    openMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.add('is-open');
      document.body.style.overflow = 'hidden'; // 鎖定背景滾動
    });
  }

  // 關閉選單
  if (closeMenuBtn && mobileMenu) {
    closeMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.remove('is-open');
      document.body.style.overflow = ''; // 恢復背景滾動
    });
  }

  // 手機版選單切換
  mobileLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      mobileLinks.forEach(item => item.classList.remove('active'));
      this.classList.add('active');
      // 【修改文字： console 輸出改為 Harry Liao 相關】
      console.log('手機選單點擊，目標:', this.getAttribute('href'));

      // 點擊後延遲 0.4 秒自動關閉選單 (給無縫轉場一點時間)
      setTimeout(() => {
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
      }, 400);
    });
  });

});
