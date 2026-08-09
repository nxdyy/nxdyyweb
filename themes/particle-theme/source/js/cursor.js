// Custom Cursor
class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.cursor');
        this.follower = document.querySelector('.cursor-follower');
        this.mouse = { x: 0, y: 0 };
        this.followerPos = { x: 0, y: 0 };
        this.speed = 0.15;
        this.isHovering = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.animate();
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';
        });

        document.addEventListener('mousedown', () => {
            this.cursor.classList.add('active');
            this.follower.classList.add('active');
        });

        document.addEventListener('mouseup', () => {
            this.cursor.classList.remove('active');
            this.follower.classList.remove('active');
        });

        // Add hover effect for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .theme-btn, .theme-text, .article-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.isHovering = true;
                this.hoveredElement = el;
                
                // Get element dimensions
                const rect = el.getBoundingClientRect();
                const width = rect.width;
                const height = rect.height;
                const borderRadius = window.getComputedStyle(el).borderRadius;
                
                // Match follower to element size and shape
                this.follower.style.width = width + 'px';
                this.follower.style.height = height + 'px';
                this.follower.style.borderRadius = borderRadius;
                this.follower.style.background = 'rgba(255, 255, 255, 0.1)';
                this.follower.style.border = '1px solid rgba(255, 255, 255, 0.5)';
                
                // Keep cursor visible
                this.cursor.style.opacity = '1';
            });

            el.addEventListener('mouseleave', () => {
                this.isHovering = false;
                this.hoveredElement = null;
                
                // Reset follower to default circle
                this.follower.style.width = '20px';
                this.follower.style.height = '20px';
                this.follower.style.background = 'transparent';
                this.follower.style.borderRadius = '50%';
                this.follower.style.border = '1px solid #ffffff';
            });
        });
    }

    animate() {
        if (this.isHovering && this.hoveredElement) {
            // Get element position and size (continuously updated)
            const rect = this.hoveredElement.getBoundingClientRect();
            const targetX = rect.left + rect.width / 2;
            const targetY = rect.top + rect.height / 2;
            
            // Update follower size to match element (including hover animation)
            this.follower.style.width = rect.width + 'px';
            this.follower.style.height = rect.height + 'px';
            
            // Smooth move to element center
            this.followerPos.x += (targetX - this.followerPos.x) * 0.2;
            this.followerPos.y += (targetY - this.followerPos.y) * 0.2;
        } else {
            // Smooth follow mouse
            this.followerPos.x += (this.mouse.x - this.followerPos.x) * this.speed;
            this.followerPos.y += (this.mouse.y - this.followerPos.y) * this.speed;
        }
        
        this.follower.style.left = this.followerPos.x + 'px';
        this.follower.style.top = this.followerPos.y + 'px';
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize custom cursor
document.addEventListener('DOMContentLoaded', () => {
    new CustomCursor();
});