const card = document.getElementById('card');
const backgroundMusic = document.getElementById('background-music');
const recipientName = document.body.dataset.recipient || 'Kamu'; // Ambil nama dari data-recipient

// 1. Smooth 3D Tilt & Light Follow
document.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set variable untuk CSS (Shine & Glow)
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    // Kalkulasi Rotasi (Smooth Physics)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / -25; // Lebih halus
    const rotateY = (x - centerX) / 25;  // Lebih halus

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

// Reset Posisi Card dengan halus saat mouse keluar
document.addEventListener('mouseleave', () => {
    card.style.transition = "transform 1s cubic-bezier(0.23, 1, 0.32, 1)";
    card.style.transform = `rotateX(0deg) rotateY(0deg)`;
    setTimeout(() => { card.style.transition = "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)"; }, 1000);
});


// 2. Unfold Story Transition & Musik
function unfoldStory() {
    const layer = document.getElementById('story-layer');
    const dynamicText = document.getElementById('dynamic-text');
    const mainTitle = document.querySelector('.main-title');

    // Personalisasi Judul dan Teks
    mainTitle.textContent = `Untuk ${recipientName}`;
    dynamicText.textContent = `Ini adalah isi hatiku yang paling dalam untukmu, ${recipientName}...`;

    // Mulai musik dengan fade-in
    if (backgroundMusic) {
        backgroundMusic.volume = 0;
        backgroundMusic.play();
        let volume = 0;
        const fadeAudio = setInterval(() => {
            if (volume < 0.6) { // Max volume 60% agar tidak terlalu keras
                volume += 0.02;
                backgroundMusic.volume = volume;
            } else {
                clearInterval(fadeAudio);
            }
        }, 100);
    }
    
    // Tampilkan Story Layer
    layer.classList.add('active'); // Gunakan kelas active untuk transisi CSS
    
    // Animasi munculnya teks di dalam story-layer
    const revealElements = document.querySelectorAll('.reveal-text');
    revealElements.forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.7 + 1.5}s`; // Delay berurutan
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });

    // Munculkan tombol close
    document.querySelector('.btn-close').style.opacity = '1';
}

// 3. Close Story
function closeStory() {
    const layer = document.getElementById('story-layer');
    
    // Fade-out musik
    if (backgroundMusic) {
        let volume = backgroundMusic.volume;
        const fadeAudio = setInterval(() => {
            if (volume > 0.05) {
                volume -= 0.05;
                backgroundMusic.volume = volume;
            } else {
                backgroundMusic.pause();
                clearInterval(fadeAudio);
            }
        }, 50);
    }

    // Sembunyikan Story Layer
    layer.classList.remove('active'); // Gunakan kelas active untuk transisi CSS

    // Reset teks di kartu utama
    document.querySelector('.main-title').textContent = 'Untukmu';
    document.getElementById('dynamic-text').textContent = 'Ada bisikan hati yang ingin kubagi...';

    // Reset elemen reveal-text untuk animasi berikutnya
    const revealElements = document.querySelectorAll('.reveal-text');
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transitionDelay = '0s'; // Reset delay
    });
    document.querySelector('.btn-close').style.opacity = '0';
}

// 4. Particle Effect (Hati-Hati Kecil)
const canvas = document.getElementById('love-particles');
if (canvas) { // Pastikan canvas ada
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 50;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    function createHeartPath(ctx, x, y, size) {
        ctx.beginPath();
        ctx.moveTo(x + 0.5 * size, y + 0.3 * size);
        ctx.bezierCurveTo(x + 0.1 * size, y, x, y + 0.6 * size, x + 0.5 * size, y + 0.9 * size);
        ctx.bezierCurveTo(x + 1 * size, y + 0.6 * size, x + 0.9 * size, y, x + 0.5 * size, y + 0.3 * size);
        ctx.closePath();
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 5 + 2; // Ukuran hati kecil
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.color = `rgba(255, 192, 203, ${this.opacity})`; // Pink
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.size > 0.2) this.size -= 0.02;
            if (this.opacity > 0) this.opacity -= 0.005;

            // Reset partikel jika sudah terlalu kecil atau transparan
            if (this.size <= 0.2 || this.opacity <= 0) {
                this.reset();
            }
        }
        draw() {
            ctx.fillStyle = `rgba(255, 192, 203, ${this.opacity})`;
            createHeartPath(ctx, this.x, this.y, this.size);
            ctx.fill();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 5 + 2;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
    }

    function initParticles() {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
    }

    initParticles();
    animateParticles();
}