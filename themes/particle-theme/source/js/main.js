// Main Theme Logic
class ThemeMain {
    constructor() {
        this.blogTitle = document.querySelector('.blog-title');
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.bindEvents();
        this.initGlowEffect();
        this.initScrollEffects();
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.updateGlowEffect();
        });
    }

    initGlowEffect() {
        if (!this.blogTitle) return;
        
        // Initial glow
        this.updateGlowEffect();
    }

    updateGlowEffect() {
        if (!this.blogTitle) return;
        
        const rect = this.blogTitle.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate distance from mouse to title center
        const dx = this.mouse.x - centerX;
        const dy = this.mouse.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only show glow when mouse is close enough
        if (distance > 600) {
            this.blogTitle.style.textShadow = 'none';
            return;
        }
        
        // Calculate shadow offset - direction is opposite to mouse (shadow moves away from mouse)
        const maxOffset = 25;
        const normalizedDist = Math.min(distance / 400, 1);
        const offsetX = -(dx / distance) * maxOffset * normalizedDist;
        const offsetY = -(dy / distance) * maxOffset * normalizedDist;
        
        // Calculate glow intensity based on distance
        const intensity = Math.max(0, 1 - distance / 400);
        const glowSize = 10 + intensity * 30;
        
        // Apply glow effect - shadow goes in opposite direction of mouse
        this.blogTitle.style.textShadow = `
            ${offsetX}px ${offsetY}px ${glowSize}px rgba(255, 255, 255, ${intensity * 0.6}),
            ${offsetX * 0.5}px ${offsetY * 0.5}px ${glowSize * 0.5}px rgba(255, 255, 255, ${intensity * 0.4})
        `;
    }

    initScrollEffects() {
        // Add scroll event for article list
        const articleList = document.querySelector('.article-list');
        if (!articleList) return;
        
        // Add intersection observer for fade-in effect
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        // Observe all article items
        document.querySelectorAll('.article-item').forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.5s, transform 0.5s';
            observer.observe(item);
        });
    }
}

// Initialize main theme
document.addEventListener('DOMContentLoaded', () => {
    new ThemeMain();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s';
    
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });
    
    // Add particle attraction effect on button click
    document.querySelectorAll('.theme-btn, .theme-text').forEach(button => {
        button.addEventListener('mousedown', (e) => {
            // Trigger particle gravity reversal in particle system
            if (window.particleSystem) {
                window.particleSystem.mouse.x = e.clientX;
                window.particleSystem.mouse.y = e.clientY;
                window.particleSystem.config.gravity *= window.particleSystem.config.click_gravity;
                setTimeout(() => {
                    window.particleSystem.config.gravity /= window.particleSystem.config.click_gravity;
                }, 50);
            }
        });
    });
});