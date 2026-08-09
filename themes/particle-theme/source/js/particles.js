// Gravity Particle System - With Floating Dormant Particles
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.mouse = { x: -1000, y: -1000 };
        this.time = 0;
        this.config = {
            particle_color: '#888888',
            background_color: '#000',
            particle_size: 1,
            particle_num: 2000,
            gravity: 1,
            click_gravity: -5,
            damping: 0.99,
            trail_alpha: 0.05,
            activate_radius: 200,
            dormant_opacity: 0.1,
            active_opacity: 0.3
        };
        this.particles = [];
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.config.particle_num; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
        
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        document.addEventListener('mousedown', () => {
            this.config.gravity *= this.config.click_gravity;
            setTimeout(() => {
                this.config.gravity /= this.config.click_gravity;
            }, 50);
        });
        
        document.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });
    }

    animate() {
        this.time += 0.01;
        
        // Clear with semi-transparent background for trail effect
        this.ctx.globalAlpha = this.config.trail_alpha;
        this.ctx.fillStyle = this.config.background_color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalAlpha = 1;
        
        // Draw dormant particles with floating effect
        this.ctx.fillStyle = this.config.particle_color;
        for (let i = 0; i < this.config.particle_num; i++) {
            const p = this.particles[i];
            if (!p.active) {
                // Add floating movement
                const floatX = Math.sin(this.time + p.phase) * 0.3;
                const floatY = Math.cos(this.time + p.phase * 0.7) * 0.3;
                const drawX = p.x + floatX;
                const drawY = p.y + floatY;
                
                this.ctx.globalAlpha = this.config.dormant_opacity;
                this.ctx.fillRect(drawX, drawY, 1.5, 1.5);
            }
        }
        this.ctx.globalAlpha = 1;
        
        // Draw active particles with lines
        this.ctx.strokeStyle = this.config.particle_color;
        this.ctx.globalAlpha = this.config.active_opacity;
        this.ctx.lineWidth = this.config.particle_size;
        this.ctx.beginPath();
        
        for (let i = 0; i < this.config.particle_num; i++) {
            this.particles[i].update(
                this.config.gravity, 
                this.ctx, 
                this.canvas,
                this.mouse,
                this.config.activate_radius
            );
        }
        
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(canvas) {
        // Random position across the screen
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = 0;
        this.vy = 0;
        this.active = false;
        this.phase = Math.random() * Math.PI * 2; // Random phase for floating
        this.homeX = this.x;
        this.homeY = this.y;
    }

    update(g, ctx, canvas, mouse, activateRadius) {
        // Calculate distance to mouse
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Activate particle if mouse is nearby
        if (dist < activateRadius) {
            this.active = true;
        }
        
        // If active, apply physics
        if (this.active) {
            let nx = this.x + this.vx;
            if (nx < 0 || nx > canvas.width) {
                this.vx *= -1;
                nx = Math.max(0, Math.min(canvas.width, nx));
            }
            let ny = this.y + this.vy;
            if (ny < 0 || ny > canvas.height) {
                this.vy *= -1;
                ny = Math.max(0, Math.min(canvas.height, ny));
            }
            
            // Draw line from old position to new position
            if (Math.abs(this.vx) > 0.3 || Math.abs(this.vy) > 0.3) {
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(nx, ny);
            }
            
            this.x = nx;
            this.y = ny;
            
            // Apply stronger damping for faster deactivation
            this.vx *= 0.98;
            this.vy *= 0.98;
            
            // Apply gravity towards mouse
            let a = Math.atan2(mouse.y - this.y, mouse.x - this.x);
            this.vx += Math.cos(a) * g;
            this.vy += Math.sin(a) * g;
            
            // Deactivate if mouse is far and particle is slow
            if (dist > activateRadius * 1.2 && Math.abs(this.vx) < 0.5 && Math.abs(this.vy) < 0.5) {
                this.active = false;
                this.vx = 0;
                this.vy = 0;
            }
        }
    }
}

// Initialize particle system
document.addEventListener('DOMContentLoaded', () => {
    window.particleSystem = new ParticleSystem();
});