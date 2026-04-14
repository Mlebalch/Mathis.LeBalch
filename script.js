// Menu Toggle
const burger = document.getElementById('mobile-menu-toggle');
const menu = document.getElementById('menutd');
if(burger && menu) {
    burger.addEventListener('click', () => menu.classList.toggle('active'));
}

// Custom Cursor
const cursor = document.querySelector('.custom-cursor');
let lastStarTime = 0;
document.addEventListener('mousemove', (e) => {
    if(cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }

    // Easter Egg: Cursor Trails
    const now = Date.now();
    if(now - lastStarTime > 50) {
        lastStarTime = now;
        const trail = document.createElement('div');
        trail.style.position = 'fixed';
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        trail.style.width = '5px';
        trail.style.height = '5px';
        trail.style.background = '#942792';
        trail.style.borderRadius = '50%';
        trail.style.pointerEvents = 'none';
        trail.style.zIndex = '9998';
        trail.style.boxShadow = '0 0 8px #4e20ff';
        trail.style.transition = 'all 0.6s ease-out';
        document.body.appendChild(trail);
        
        // Start animation next frame
        setTimeout(() => {
            trail.style.transform = `translate(${(Math.random() - 0.5) * 40}px, ${Math.random() * 40}px) scale(0)`;
            trail.style.opacity = '0';
        }, 10);
        
        setTimeout(() => trail.remove(), 600);
    }
});

// Easter Egg: Secret click (Name or Butterfly)
const secretTrigger = document.getElementById('secret-trigger');
const butterflyTrigger = document.querySelector('.easter-butterfly');
function toggleFever() {
    document.body.classList.toggle('vector-fever');
}
if(secretTrigger) secretTrigger.addEventListener('click', toggleFever);
if(butterflyTrigger) butterflyTrigger.addEventListener('click', toggleFever);

// ==========================================
// VISITOR COUNTER — Global Digit Display (API)
// ==========================================
(async function loadEx33Counter() {
    const display = document.getElementById('ex33-visitor-display');
    if (!display) return;

    let count;
    try {
        // Using CounterAPI.dev for global counting
        const response = await fetch('https://api.counterapi.dev/v1/mlebalch-portfolio/total-visits/hit');
        const data = await response.json();
        count = data.count;
    } catch (e) {
        console.warn("Global counter offline, using local fallback:", e);
        count = parseInt(localStorage.getItem('mlb_visit_count') || '1024', 10) + 1;
        localStorage.setItem('mlb_visit_count', count);
    }

    // Render each digit with Ex33 style
    // We pad to 6 digits for the classic '90s look
    const countStr = String(count).padStart(6, '0');
    display.innerHTML = '';
    for (const digit of countStr) {
        const span = document.createElement('span');
        span.className = 'ex33-digit';
        span.textContent = digit;
        display.appendChild(span);
    }
})();



// ==========================================
// LAST.FM API INTEGRATION
// ==========================================
const API_KEY = "46fc76fb4deb66cbeb9eb1d453a136eb";
const USERNAME = "noitchi";
const LASTFM_URL = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=1`;

const songNameEl = document.getElementById('songname');
const artistEl = document.getElementById('artist');
const albumCoverEl = document.getElementById('albumcover');
async function fetchLastFm() {
    try {
        const response = await fetch(LASTFM_URL);
        const data = await response.json();
        const track = data.recenttracks.track[0];
        
        if (track) {
            if (songNameEl) songNameEl.innerHTML = `<span class="gradient-text">${track.name}</span>`;
            if (artistEl) artistEl.textContent = track.artist['#text'];
            
            // Calculate time ago
            let timeText = "";
            let timeClass = "";
            if (track['@attr'] && track['@attr'].nowplaying === 'true') {
                timeText = "En ce moment 🎧";
                timeClass = "glow-green";
            } else if (track.date && track.date.uts) {
                const diffMins = Math.floor((Date.now() - parseInt(track.date.uts) * 1000) / 60000);
                if (diffMins < 1) timeText = "À l'instant";
                else if (diffMins < 60) timeText = `Il y a ${diffMins} min`;
                else if (diffMins < 1440) timeText = `Il y a ${Math.floor(diffMins/60)} h`;
                else timeText = `Il y a ${Math.floor(diffMins/1440)} j`;
                timeClass = "glow-purple";
            }
            let timeEl = document.getElementById('music-time');
            if (!timeEl && artistEl && artistEl.parentNode) {
                timeEl = document.createElement('div');
                timeEl.id = 'music-time';
                timeEl.style.fontSize = '0.75rem';
                timeEl.style.marginTop = '4px';
                artistEl.parentNode.appendChild(timeEl);
            }
            if (timeEl) {
                timeEl.className = timeClass;
                timeEl.textContent = timeText;
            }
            
            // Get large image
            const images = track.image;
            const lgImage = images.find(img => img.size === 'extralarge') || images.find(img => img.size === 'large') || images[0];
            if (lgImage && lgImage['#text'] && albumCoverEl) {
                albumCoverEl.src = lgImage['#text'];
            }
            // Update online status based on Last.fm nowplaying
            const statusEl = document.getElementById('status');
            if (statusEl) {
                const isNowPlaying = track['@attr'] && track['@attr'].nowplaying === 'true';
                if (isNowPlaying) {
                    statusEl.textContent = 'En Ligne ! 🎧';
                    statusEl.className = 'status-bounce glow-green';
                } else {
                    const diffMins = track.date ? Math.floor((Date.now() - parseInt(track.date.uts) * 1000) / 60000) : 9999;
                    if (diffMins < 30) {
                        statusEl.textContent = 'Peut-être là... 👀';
                        statusEl.className = 'status-bounce glow-yellow';
                    } else {
                        statusEl.textContent = 'AFK 💤';
                        statusEl.className = 'status-bounce glow-purple';
                    }
                }
            }
        }
    } catch (e) {
        console.log("Last.fm error:", e);
    }
}


// Fetch 
fetchLastFm();
// Refresh every 30 seconds
setInterval(fetchLastFm, 30000);

// ==========================================
// VECTORBLOOM PARTICLES (Psych/Vector Art)
// ==========================================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const particles = [];
const PARTICLE_COUNT = 30;
// Vectorbloom colors: pinks, purples, blues
const vectorColors = ['#ca8fc9', '#4e20ff', '#942792', '#d050ce'];

class VectorParticle {
    constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.size = Math.random() * 20 + 10;
        this.color = vectorColors[Math.floor(Math.random() * vectorColors.length)];
        this.speedY = -(Math.random() * 1.2 + 0.5);
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.02;
        this.opacity = Math.random() * 0.4 + 0.1;
        // Shape type: 0=circle, 1=star/flower
        this.type = Math.random() > 0.5 ? 1 : 0; 
    }
    
    update() {
        this.y += this.speedY;
        this.rotation += this.rotSpeed;
        
        if (this.y < -100) {
            this.reset();
        }
    }
    
    drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        if (this.type === 0) {
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.lineWidth = 1;
            ctx.strokeStyle = this.color;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 0.5, 0, Math.PI * 2);
            ctx.stroke();
        } else {
            this.drawStar(0, 0, 6, this.size, this.size * 0.4);
        }
        
        ctx.restore();
    }
}

for(let i=0; i<PARTICLE_COUNT; i++) {
    particles.push(new VectorParticle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let p of particles) {
        p.update();
        p.draw();
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ==========================================
// GLOBALS & UTILS
// ==========================================
(function initGlobals() {
    function updateClock() {
        const clockEl = document.getElementById('taskbar-clock');
        if (!clockEl) return;
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function runGlobalInits() {
        // Auto-update year
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) yearSpan.textContent = new Date().getFullYear();

        // Initial clock update and interval
        updateClock();
        setInterval(updateClock, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runGlobalInits);
    } else {
        runGlobalInits();
    }
})();