// FEATURES CAROUSEL
document.addEventListener("DOMContentLoaded", function() {
  const track = document.getElementById('clientTrack');
  const prevBtn = document.getElementById('clientPrevBtn');
  const nextBtn = document.getElementById('clientNextBtn');
  if (!track || !prevBtn || !nextBtn) return;
  
  // 1. 備份原始項目並取得總寬度
  const originalItems = Array.from(track.children);
  const getItemWidth = () => {
    const firstItem = track.querySelector('.client-item');
    if (!firstItem) return 300;
    return Math.round(firstItem.getBoundingClientRect().width);
  };

  // 2. 【核心修正：保證順序的複製法】
  // 先清空軌道，然後強制依序放入 3 組一模一樣的內容：[前緩衝] [主畫面] [後緩衝]
  track.innerHTML = ''; 
  for (let i = 0; i < 3; i++) {
    originalItems.forEach(item => {
      track.appendChild(item.cloneNode(true));
    });
  }

  let itemWidth = getItemWidth();
  let totalOriginalWidth = originalItems.length * itemWidth;

  // 3. 計算至中偏移量 (讓 Logo 保持在畫面正中央)
  function getCenteringOffset() {
    return (window.innerWidth / 2) - (itemWidth / 2);
  }

  let centeringOffset = getCenteringOffset();
  
  // 4. 初始化位置：我們直接把畫面推到「第二組（主畫面）」的第一個 Logo
  let targetTranslate = centeringOffset - totalOriginalWidth;
  let currentTranslate = targetTranslate;
  
  let isHovered = false;
  const speed = window.matchMedia('(max-width: 768px)').matches ? 0.06 : 0.1; // 手機端再放慢，降低視覺壓力
  const ease = 0.08; // 絲滑阻尼係數

  function animateCarousel() {
    if (!isHovered) {
      targetTranslate -= speed;
    }

    // 每一幀慢慢追蹤目標位置
    currentTranslate += (targetTranslate - currentTranslate) * ease;

    // 5. 無縫循環判定 (完全隱形的瞬間跳轉)
    // 當向左滾動，碰到第三組的開頭時，瞬間拉回第二組開頭
    if (targetTranslate <= (centeringOffset - totalOriginalWidth * 2)) {
      targetTranslate += totalOriginalWidth;
      currentTranslate += totalOriginalWidth;
    } 
    // 當向右滾動，碰到第一組的開頭時，瞬間拉回第二組開頭
    else if (targetTranslate >= centeringOffset) {
      targetTranslate -= totalOriginalWidth;
      currentTranslate -= totalOriginalWidth;
    }

    track.style.transform = `translateX(${currentTranslate}px)`;
    requestAnimationFrame(animateCarousel);
  }

  requestAnimationFrame(animateCarousel);

  // 處理視窗縮放，確保縮放時 Logo 依然死死咬住畫面中央
  window.addEventListener('resize', () => {
    const oldOffset = centeringOffset;
    itemWidth = getItemWidth();
    totalOriginalWidth = originalItems.length * itemWidth;
    centeringOffset = getCenteringOffset();
    targetTranslate += (centeringOffset - oldOffset);
    currentTranslate += (centeringOffset - oldOffset);
  });

  // 6. 按鈕控制：點擊時精準對齊下一個網格
  nextBtn.addEventListener('click', () => {
    targetTranslate = Math.round((targetTranslate - centeringOffset) / itemWidth) * itemWidth + centeringOffset - itemWidth;
  });

  prevBtn.addEventListener('click', () => {
    targetTranslate = Math.round((targetTranslate - centeringOffset) / itemWidth) * itemWidth + centeringOffset + itemWidth;
  });

  track.addEventListener('mouseenter', () => isHovered = true);
  track.addEventListener('mouseleave', () => isHovered = false);
  track.addEventListener('touchstart', () => isHovered = true, { passive: true });
  track.addEventListener('touchend', () => isHovered = false, { passive: true });
});

// CAREER HIGHLIGHTS

document.addEventListener("DOMContentLoaded", function() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    item.addEventListener('click', function() {
      // 1. 先紀錄當前點擊的這個項目，原本是否為「已展開」狀態
      const isActive = this.classList.contains('active');

      // 2. 無論如何，先關閉所有的項目
      accordionItems.forEach(el => el.classList.remove('active'));

      // 3. 如果當前點擊的項目原本「不是」展開的，就給它加上 active 展開它。
      //    反之，如果原本就是展開的，經過第 2 步已經關閉了，就不做任何事，達到「點第二下闔上」的效果。
      if (!isActive) {
        this.classList.add('active');
      }
    });
  });
});


const portfolioItems = [
  {
    edition: "/ ISBN 9798881411671",
    title: "DREAM REALITY",
    projectUrl: "https://www.behance.net/gallery/202521069/MFA-Thesis-Book-Slides-Dream-Reality",
    image: "images/TB.jpg",
    description: "Every day, we experience two realities. The first is experienced when we are awake. The second is experienced when we are asleep, dreaming. Dreams are often viewed as experiences that are out of our control. For me, this is not the case. My thesis is an exploration into the unique realm of lucid dreaming, a state where the dreamer is aware they are dreaming. As a result of this awareness, the dreamer has the ability to influence their own dream narrative. Individuals who lucid dream often wake up with a sharp sense of distinguishing reality from dreams. This can stimulate deep reflection into the dreamer's inner life and place in the world. It is a mysterious and fascinating experience - one I practice myself.",
    dimensions: "156 x 235 mm",
    pages: "113 pages",
    language: "ENGLISH",
    publisher: "XIAN-HAO (HARRY) LIAO"
  },
  {
    edition: "/ arXiv:2506.08872",
    title: "YOUR BRAIN ON CHATGPT (MIT)", 
    projectUrl: "https://arxiv.org/abs/2506.08872",
    image: "images/YB.jpg", 
    description: "This study examines the neural and behavioral impact of LLM-assisted essay writing across LLM, Search Engine, and Brain-only groups. EEG and essay analysis showed the strongest brain connectivity in Brain-only participants and the weakest in LLM users, with lower ownership of writing in the LLM condition. The findings suggest that while LLMs improve convenience, long-term reliance may reduce cognitive engagement in learning.",
    dimensions: "LETTER SIZE",
    pages: "216 pages",
    language: "ENGLISH",
    publisher: "MIT MEDIA LAB"
  }
];

let currentIndex = 0;

const els = {
  image: document.getElementById('artwork-img'),
  edition: document.getElementById('edition-text'),
  title: document.getElementById('title-text'),
  desc: document.getElementById('desc-text'),
  dim: document.getElementById('meta-dim'),
  pages: document.getElementById('meta-pages'),
  lang: document.getElementById('meta-lang'),
  pub: document.getElementById('meta-pub'),
  indicatorContainer: document.getElementById('indicator-container'),
  prevBtn: document.getElementById('portfolioPrevBtn'),
  nextBtn: document.getElementById('portfolioNextBtn')
};

function initIndicators() {
  els.indicatorContainer.innerHTML = '';
  portfolioItems.forEach((_, index) => {
    const div = document.createElement('div');
    div.className = `indicator ${index === currentIndex ? 'active' : ''}`;
    els.indicatorContainer.appendChild(div);
  });
}

function updateUIWithAnimation() {
  els.image.style.opacity = 0;
  els.desc.style.opacity = 0; 
  els.title.style.opacity = 0;
  
  setTimeout(() => {
    const item = portfolioItems[currentIndex];
    
    els.image.src = item.image;
    els.edition.textContent = item.edition;
    
    if (item.projectUrl) {
      els.title.innerHTML = `<a href="${item.projectUrl}" target="_blank" rel="noopener noreferrer">${item.title}</a>`;
    } else {
      els.title.textContent = item.title;
    }
    
    els.desc.textContent = item.description;
    els.dim.textContent = item.dimensions;
    els.pages.textContent = item.pages;
    els.lang.textContent = item.language;
    els.pub.textContent = item.publisher;

    const indicators = els.indicatorContainer.children;
    Array.from(indicators).forEach((ind, index) => {
      ind.classList.toggle('active', index === currentIndex);
    });

    els.image.style.opacity = 1;
    els.desc.style.opacity = 1;
    els.title.style.opacity = 1;
    
    els.image.style.transition = 'opacity 0.4s ease';
    els.desc.style.transition = 'opacity 0.4s ease';
    els.title.style.transition = 'opacity 0.4s ease';
  }, 200); 
}

els.prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + portfolioItems.length) % portfolioItems.length;
  updateUIWithAnimation();
});

els.nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % portfolioItems.length;
  updateUIWithAnimation();
});

initIndicators();
updateUIWithAnimation();




// 初始化 Swiper 輪播
const swiper = new Swiper(".mySwiper", {
    slidesPerView: 1.5,      
    centeredSlides: true,
    spaceBetween: 5,        // 極小的圖片間距，營造連貫感
    
    loop: true,             // 開啟無限輪播
    
    grabCursor: true,       
    speed: 1000,            // 配合 CSS Ease 特效的速度
    
    navigation: {
        nextEl: ".custom-nav-next",
        prevEl: ".custom-nav-prev",
    },
    
    breakpoints: {
        768: {
            slidesPerView: 1.8, 
            spaceBetween: 8     
        },
        1200: {
            slidesPerView: 2.2, 
            spaceBetween: 10
        }
    }
});