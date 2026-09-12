document.addEventListener('DOMContentLoaded', () => {

  // 1. Dynamic Cursor / Touch Spotlight Follower
  const cursorGlow = document.getElementById('cursorGlow');
  
  const moveGlow = (x, y) => {
    if (cursorGlow) {
      cursorGlow.style.left = `${x}px`;
      cursorGlow.style.top = `${y}px`;
      cursorGlow.style.opacity = '1';
    }
  };

  window.addEventListener('mousemove', (e) => moveGlow(e.clientX, e.clientY));
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      moveGlow(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // 2. Active Navigation Link on Click and Touch Tap
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    ['click', 'touchstart'].forEach(eventType => {
      item.addEventListener(eventType, function() {
        navItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
      });
    });
  });

  // 3. 3D Tilt & Local Reflection (Supports Mouse Movement and Touch Drag)
  const tiltElements = document.querySelectorAll('.tilt-element');

  tiltElements.forEach((card) => {
    const handleTilt = (clientX, clientY) => {
      const rect = card.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    };

    const resetTilt = () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    };

    // Desktop hover events
    card.addEventListener('mousemove', (e) => handleTilt(e.clientX, e.clientY));
    card.addEventListener('mouseleave', resetTilt);

    // Mobile touch events
    card.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        handleTilt(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
    card.addEventListener('touchend', resetTilt);
  });

  // 4. Smooth Number Counter Animation
  const counters = document.querySelectorAll('.stat-number');
  let animated = false;

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-val');
      let current = 0;
      const step = Math.ceil(target / 45);

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          counter.innerText = target;
          clearInterval(timer);
        } else {
          counter.innerText = current;
        }
      }, 25);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animateCounters();
        animated = true;
      }
    });
  }, { threshold: 0.25 });

  const statsSection = document.querySelector('.quick-stats-strip');
  if (statsSection) {
    observer.observe(statsSection);
  }

  // 5. About Section Animations (Skill Bars & Project Counter)
  const aboutSection = document.getElementById('about');
  let aboutAnimated = false;

  if (aboutSection) {
    const aboutObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !aboutAnimated) {
          // Animate Skill Bars
          const skillFills = aboutSection.querySelectorAll('.skill-fill');
          skillFills.forEach(bar => {
            const fillWidth = bar.getAttribute('data-fill');
            bar.style.width = fillWidth;
          });

          // Animate Project Counter
          const projCounter = aboutSection.querySelector('.project-count-val');
          if (projCounter) {
            const target = +projCounter.getAttribute('data-val');
            let current = 0;
            const timer = setInterval(() => {
              current++;
              projCounter.innerText = current;
              if (current >= target) {
                clearInterval(timer);
              }
            }, 80);
          }

          aboutAnimated = true;
        }
      });
    }, { threshold: 0.25 });

    aboutObserver.observe(aboutSection);
  }
});