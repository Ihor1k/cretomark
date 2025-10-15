const popup = document.getElementById('popup');
const openButtons = document.querySelectorAll('.button, .header-button, .hero-button, .contact-btn, .center-btn');
const closeBtn = document.querySelector('.close-popup');
const form = document.getElementById('joinForm');

openButtons.forEach(button => {
  button.addEventListener('click', () => {
    popup.classList.add('active');
    document.body.classList.add('menu-open');
  });
});

// закриття
closeBtn.addEventListener('click', () => {
  popup.classList.remove('active');
  document.body.classList.remove('menu-open');
}); 

//   Клік поза формою
//   popup.addEventListener('click', (e) => {
//     if (e.target === popup) popup.classList.remove('active');
//     document.body.classList.remove('menu-open');
//   });
//   console.log(form)
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Зупиняє перезавантаження або перехід

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const savedForms = JSON.parse(localStorage.getItem('contactForms')) || [];
      savedForms.push(data);
      localStorage.setItem('contactForms', JSON.stringify(savedForms));

      document.getElementById('popup').classList.remove('active');
      document.body.classList.remove('menu-open');
      document.getElementById('successPopup').classList.add('active');
      form.reset();
    } catch (err) {
      document.getElementById('errorPopup').classList.add('active');
    }
  });
}



const burger = document.querySelector('.burger');
const burgerClose = document.querySelector('.burger-close');
const headerMenu = document.querySelector('.header-menu');
const headerLinks = document.querySelectorAll('.header-link');
const menuOverlay = document.querySelector('.menu-overlay');
  
if (burger && burgerClose && headerMenu && menuOverlay) {
  burger.addEventListener('click', () => {
    headerMenu.classList.add('open');
    menuOverlay.classList.add('active');
    document.body.classList.add('menu-open');
  });

  burgerClose.addEventListener('click', () => {
    headerMenu.classList.remove('open');
    menuOverlay.classList.remove('active');
    document.body.classList.remove('menu-open');
  });

  menuOverlay.addEventListener('click', () => {
    headerMenu.classList.remove('open');
    menuOverlay.classList.remove('active'); // ховаємо затемнення
    document.body.classList.remove('menu-open');
  }); 

  headerLinks.forEach(link => {
    link.addEventListener('click', () => {
      headerMenu.classList.remove('open');
      menuOverlay.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });
}

// const swiper = new Swiper('.benefits-swiper', {
//   speed: 500,
//   spaceBetween: 24,
//   slidesPerView: 1.1,  // трохи видно сусідній слайд на мобілці
//   loop: true,
//   breakpoints: {
//     640: { slidesPerView: 2, spaceBetween: 24 },
//     1024:{ slidesPerView: 3, spaceBetween: 28 }
//   },
//   navigation: {
//     nextEl: '.benefits-btn.next',
//     prevEl: '.benefits-btn.prev'
//   },
//   allowTouchMove: false
// });

const headers = document.querySelectorAll('.accordion-header');

headers.forEach(header => {
  header.addEventListener('click', () => {
    const item = header.parentElement;
    const content = item.querySelector('.accordion-content');
    const isOpen = item.classList.contains('active');

    // Закриваємо всі інші
    document.querySelectorAll('.accordion-item').forEach(i => {
      i.classList.remove('active');
      i.querySelector('.accordion-content').style.maxHeight = null;
    });

    // Якщо не відкритий — відкриваємо
    if (!isOpen) {
      item.classList.add('active');
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  });
});


// ===== Our services: sync indicator with cards on scroll =====
(() => {
  const cards  = [...document.querySelectorAll('.service-card')];
  const items  = [...document.querySelectorAll('.aside__item')];
  const progress = document.getElementById('progressFill');
  if (!cards.length) return;

  let activeIdx = 0;

  const setActive = (idx) => {
    if (idx === activeIdx) return;
    activeIdx = idx;
    cards.forEach((c,i)=>c.classList.toggle('is-active', i===idx));
    items.forEach((li,i)=>li.classList.toggle('is-active', i===idx));
    if (progress && cards.length>1){
      progress.style.height = `${(idx/(cards.length-1))*100}%`;
    }
  };

  // клік по індикатору (скрол до центру)
  items.forEach((li,i) => {
    li.addEventListener('click', () => {
      cards[i]?.scrollIntoView({behavior:'smooth', block:'center'});
    });
  });

  // визначаємо картку, чий центр ближчий до центру екрану
  const viewportCenter = () => window.innerHeight / 2;

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const vc = viewportCenter();
      let bestIdx = 0;
      let bestDist = Infinity;
      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const dist = Math.abs(cardCenter - vc);
        if (dist < bestDist) { bestDist = dist; bestIdx = i; }
      });
      setActive(bestIdx);
      ticking = false;
    });
  };

  // ініціалізація + слухачі
  cards[0]?.classList.add('is-active');
  items[0]?.classList.add('is-active');
  window.addEventListener('scroll', onScroll, { passive:true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();



document.addEventListener('DOMContentLoaded', () => {
  const cards = [...document.querySelectorAll('.how-card')];
  const dots  = [...document.querySelectorAll('.how__dots .dot')];
  const triggers = [...document.querySelectorAll('.how-trigger')];

  if (!cards.length || !triggers.length) return;

  const setActive = (i) => {
    cards.forEach((c,k)=> c.classList.toggle('active', k===i));
    dots.forEach((d,k)=> {
      d.classList.toggle('active', k===i);
      d.classList.toggle('passed', k<=i);
    });
  };
  setActive(0);

  // Коли тригер заходить у центр екрана — активуємо відповідну картку
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const i = +e.target.dataset.step;
      setActive(i);
    });
  }, {
    root: null,
    threshold: 0.6,             // потрібно ~60% тригера у в’юпорті
    rootMargin: '-20% 0px -20% 0px' // «центр» екрана
  });

  triggers.forEach(t => io.observe(t));
});

