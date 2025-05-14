// script.js
// Gestion du menu burger
const burgerMenu = document.querySelector('.burger-menu');
const navLinks = document.querySelector('.nav-links');
let isOverNav = false;

// Gestion de l'état de la navigation
document.querySelectorAll('nav, nav *').forEach(element => {
    element.addEventListener('mouseenter', () => {
        isOverNav = true;
        document.querySelector('.custom-cursor').classList.add('hidden');
        document.body.style.cursor = 'auto';
    });

    element.addEventListener('mouseleave', (e) => {
        if (!e.relatedTarget || !e.relatedTarget.closest('nav')) {
            isOverNav = false;
            document.querySelector('.custom-cursor').classList.remove( 'hidden');
            document.body.style.cursor = 'none';
        }
    });
});

burgerMenu.addEventListener('click', () => {
    burgerMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        burgerMenu.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

document.addEventListener('click', (e) => {
    const isBurger = e.target.closest('.burger-menu');
    const isNavLink = e.target.closest('.nav-links');

    if (!isBurger && !isNavLink) {
        burgerMenu.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// Redimensionnement fenêtre
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        burgerMenu.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// Gestion du thème
const themeToggle = document.getElementById('theme-toggle');
let currentTheme = localStorage.getItem('theme') || 'dark';
let particleColors;

function applyTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.innerHTML = currentTheme === 'dark'
        ? '<i class="fas fa-moon"></i>'
        : '<i class="fas fa-sun"></i>';

    particleColors = currentTheme === 'dark'
        ? ['#c53b23', '#e9c46a', '#fff5e6', '#7a2a1a']
        : ['#2a5a7c', '#c53b23', '#2a1c1a', '#f0e6d6'];

    particles = [];
    init();
}

themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
    applyTheme();
});

// Gestion du curseur et du drag
let mouseX = -1000;
let mouseY = -1000;
const mouseRadius = 120;
const maxForce = 1.2;
let isDragging = false;
let startY;
let startScrollY;

document.addEventListener('DOMContentLoaded', () => {

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    // Gestion du drag
    document.addEventListener('mousedown', (e) => {
        if (isOverNav) return;
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            isDragging = true;
            startY = e.clientY;
            startScrollY = window.scrollY;
            document.body.classList.add('is-dragging');
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isOverNav) return;
        if (!isDragging) return;

        const deltaY = e.clientY - startY;
        window.scrollTo({
            top: startScrollY - deltaY * 1.5,
            behavior: 'instant'
        });
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.classList.remove('is-dragging');
    });

    // Animation curseur
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX - 15}px`;
        cursor.style.top = `${e.clientY - 15}px`;
    });

    document.addEventListener('mousedown', () => cursor.classList.add('active'));
    document.addEventListener('mouseup', () => cursor.classList.remove('active'));

    // Observateurs d'intersection
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {threshold: 0.1});

    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {threshold: 0.1});

    document.querySelectorAll('section h2').forEach(title => titleObserver.observe(title));
    document.querySelectorAll('.project-card, .skill-item, footer, section, .contact-form').forEach(el => elementObserver.observe(el));
    document.querySelectorAll('.timeline-item').forEach(el => elementObserver.observe(el));
});

// Particules
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const particleCount = 150;

class Particle {
    constructor() {
        this.reset();
        this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.baseSpeedX = (Math.random() - 0.5) * 0.9;
        this.baseSpeedY = (Math.random() - 0.5) * 0.9;
        this.speedX = this.baseSpeedX;
        this.speedY = this.baseSpeedY;
        this.opacity = Math.random() * 0.6 + 0.2;
    }

    update() {
        if (isOverNav) return;

        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRadius && distance > 0) {
            const force = (mouseRadius - distance) / mouseRadius * maxForce;
            const angle = Math.atan2(dy, dx);
            this.speedX = Math.cos(angle) * force * 0.9;
            this.speedY = Math.sin(angle) * force * 0.9;
        }

        this.speedX += (this.baseSpeedX - this.speedX) * 0.05;
        this.speedY += (this.baseSpeedY - this.speedY) * 0.05;
        this.speedX *= 0.98;
        this.speedY *= 0.98;

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) this.speedX *= -0.7;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -0.7;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

function init() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
        if (particle.x < -100 || particle.x > canvas.width + 100 ||
            particle.y < -100 || particle.y > canvas.height + 100) {
            particle.reset();
        }
        particle.update();
        particle.draw();
    });
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

// Initialisation
applyTheme();
init();
animate();