/* ============================================================
 * Liquid Glass effect for particle-theme
 * GPU-friendly port of liquid-glass-react:
 *   - backdrop-filter (blur + saturate) frosted glass layer
 *   - gradient edge highlights reacting to mouse position
 *   - hover / press glow, elastic stretch following the mouse
 * (The CPU-bound SVG feDisplacementMap refraction was removed:
 *  it re-filtered every glass element every frame on top of the
 *  animated particle background and caused severe jank.)
 * ============================================================ */
(function () {
    'use strict';

    var ELASTICITY = 0.15;     // "liquid" pull toward the mouse
    var ACTIVATION_ZONE = 200; // px from the edges where the effect fades in

    function LiquidGlass() {
        this.targets = [];
        this.mouse = { x: -9999, y: -9999 };
        this.pending = false;
    }

    LiquidGlass.prototype.init = function () {
        var selector = '.theme-btn, .theme-text, .theme-nav a, .article-item, .archive-item';
        this.targets = Array.prototype.slice.call(document.querySelectorAll(selector));
        if (!this.targets.length) return;

        var self = this;
        this.targets.forEach(function (el) { self.enhance(el); });

        document.addEventListener('mousemove', function (e) {
            self.mouse.x = e.clientX;
            self.mouse.y = e.clientY;
            self.requestUpdate();
        }, { passive: true });

        document.addEventListener('mouseleave', function () {
            self.mouse.x = -9999;
            self.mouse.y = -9999;
            self.requestUpdate();
        });

        window.addEventListener('resize', function () { self.requestUpdate(); }, { passive: true });
    };

    /* Turn one element into a glass shell, in place.
       Children stay untouched: the warp layer sinks below content via
       z-index: -1, so original child positioning (e.g. .arrow) is kept. */
    LiquidGlass.prototype.enhance = function (el) {
        el.classList.add('lg-glass');

        var warp = document.createElement('span');
        warp.className = 'lg-warp';

        var border1 = document.createElement('span');
        border1.className = 'lg-border lg-border-1';
        var border2 = document.createElement('span');
        border2.className = 'lg-border lg-border-2';
        var glowHover = document.createElement('span');
        glowHover.className = 'lg-glow lg-glow-hover';
        var glowActive = document.createElement('span');
        glowActive.className = 'lg-glow lg-glow-active';

        el.appendChild(warp);
        el.appendChild(border1);
        el.appendChild(border2);
        el.appendChild(glowHover);
        el.appendChild(glowActive);

        // Cards must not fight main.js fade-in transforms.
        var isCard = el.classList.contains('article-item') || el.classList.contains('archive-item');
        if (isCard) el.classList.add('lg-static');

        el.__lg = { border1: border1, border2: border2, isStatic: isCard, idle: false };

        this.applyBorderGradient(el.__lg, 0, 0);
    };

    /* Edge highlight angle/opacity react to the mouse offset. */
    LiquidGlass.prototype.applyBorderGradient = function (state, ox, oy) {
        var ax = Math.abs(ox);
        var start = Math.max(10, 33 + oy * 0.3);
        var mid = Math.min(90, 66 + oy * 0.4);
        var angle = 135 + ox * 1.2;

        state.border1.style.background =
            'linear-gradient(' + angle + 'deg, rgba(255,255,255,0) 0%, rgba(255,255,255,' + (0.12 + ax * 0.008) + ') ' + start + '%, rgba(255,255,255,' + (0.4 + ax * 0.012) + ') ' + mid + '%, rgba(255,255,255,0) 100%)';
        state.border2.style.background =
            'linear-gradient(' + angle + 'deg, rgba(255,255,255,0) 0%, rgba(255,255,255,' + (0.32 + ax * 0.008) + ') ' + start + '%, rgba(255,255,255,' + (0.6 + ax * 0.012) + ') ' + mid + '%, rgba(255,255,255,0) 100%)';
    };

    /* Elastic translation + directional scale toward the mouse. */
    LiquidGlass.prototype.applyElastic = function (el, rect, dx, dy, active) {
        var transform = 'translate(0, 0) scale(1, 1)';

        if (active) {
            var edgeX = Math.max(0, Math.abs(dx) - rect.width / 2);
            var edgeY = Math.max(0, Math.abs(dy) - rect.height / 2);
            var edgeDistance = Math.sqrt(edgeX * edgeX + edgeY * edgeY);
            var fade = 1 - edgeDistance / ACTIVATION_ZONE;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                var nx = dx / distance;
                var ny = dy / distance;
                var stretch = Math.min(distance / 300, 1) * ELASTICITY * fade;

                var scaleX = 1 + Math.abs(nx) * stretch * 0.3 - Math.abs(ny) * stretch * 0.15;
                var scaleY = 1 + Math.abs(ny) * stretch * 0.3 - Math.abs(nx) * stretch * 0.15;

                transform =
                    'translate(' + (dx * ELASTICITY * 0.1 * fade).toFixed(2) + 'px, ' + (dy * ELASTICITY * 0.1 * fade).toFixed(2) + 'px) ' +
                    'scale(' + Math.max(0.8, scaleX).toFixed(3) + ', ' + Math.max(0.8, scaleY).toFixed(3) + ')';
            }
        }

        el.style.transform = transform;
    };

    LiquidGlass.prototype.requestUpdate = function () {
        if (this.pending) return;
        var self = this;
        this.pending = true;
        requestAnimationFrame(function () {
            self.pending = false;
            self.update();
        });
    };

    LiquidGlass.prototype.update = function () {
        for (var i = 0; i < this.targets.length; i++) {
            var el = this.targets[i];
            var state = el.__lg;
            if (!state) continue;

            var rect = el.getBoundingClientRect();
            var dx = this.mouse.x - (rect.left + rect.width / 2);
            var dy = this.mouse.y - (rect.top + rect.height / 2);

            var edgeX = Math.max(0, Math.abs(dx) - rect.width / 2);
            var edgeY = Math.max(0, Math.abs(dy) - rect.height / 2);
            var edgeDistance = Math.sqrt(edgeX * edgeX + edgeY * edgeY);
            var active = edgeDistance <= ACTIVATION_ZONE;

            // Far-away elements already sit at rest — skip all style writes.
            if (!active && state.idle) continue;
            state.idle = !active;

            this.applyBorderGradient(state, (dx / rect.width) * 100, (dy / rect.height) * 100);

            if (!state.isStatic) this.applyElastic(el, rect, dx, dy, active);
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        new LiquidGlass().init();
    });
})();
