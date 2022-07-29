/**
 * Based on https://confettijs.org/.
 */
const Confetti = (() => {
  const t = (() => {
          return function() {
            this.gravity = 10,
            this.particle_count = 75,
            this.particle_size = 1,
            this.explosion_power = 25,
            this.destroy_target = !0,
            this.fade = !1
          }
        })(),
        e = (() => {
          function e(n) {
            const r = this;
            if (this.bursts = [],
            this.setCount = t => {
              if ("number" != typeof t)
                throw new Error("Input must be of type 'number'");
              e.CONFIG.particle_count = t
            }
            ,
            this.setPower = t => {
              if ("number" != typeof t)
                throw new Error("Input must be of type 'number'");
              e.CONFIG.explosion_power = t
            }
            ,
            this.setSize = t => {
              if ("number" != typeof t)
                throw new Error("Input must be of type 'number'");
              e.CONFIG.particle_size = t
            }
            ,
            this.setFade = t => {
              if ("boolean" != typeof t)
                throw new Error("Input must be of type 'boolean'");
              e.CONFIG.fade = t
            }
            ,
            this.destroyTarget = t => {
              if ("boolean" != typeof t)
                throw new Error("Input must be of type 'boolean'");
              e.CONFIG.destroy_target = t
            }
            ,
            this.setupCanvasContext = () => {
              if (!e.CTX) {
                const t = document.createElement("canvas");
                e.CTX = t.getContext("2d"),
                t.width = 2 * window.innerWidth,
                t.height = 2 * window.innerHeight,
                t.style.position = "fixed",
                t.style.top = "0",
                t.style.left = "0",
                t.style.width = "calc(100%)",
                t.style.height = "calc(100%)",
                t.style.margin = "0",
                t.style.padding = "0",
                t.style.zIndex = "999999999",
                t.style.pointerEvents = "none",
                document.body.appendChild(t),
                window.addEventListener("resize", () => {
                  t.width = 2 * window.innerWidth,
                  t.height = 2 * window.innerHeight
                })
              }
            }
            ,
            this.setupElement = t => {
              let n;
              r.element = t,
              null === (n = r.element) || void 0 === n || n.addEventListener("click", t => {
                const n = new o(2 * t.clientX,2 * t.clientY);
                r.bursts.push(new i(n)),
                e.CONFIG.destroy_target && (r.element.style.visibility = "hidden")
              })
            }
            ,
            this.update = t => {
              r.delta_time = (t - r.time) / 1e3,
              r.time = t;
              for (let e = r.bursts.length - 1; e >= 0; e--)
                r.bursts[e].update(r.delta_time),
                0 == r.bursts[e].particles.length && r.bursts.splice(e, 1);
              r.draw(),
              window.requestAnimationFrame(r.update)
            }
            ,
            !n)
              throw new Error("Missing id");
            e.CONFIG || (e.CONFIG = new t),
            this.time = (new Date).getTime(),
            this.delta_time = 0,
            this.setupCanvasContext(),
            this.setupElement(n),
            window.requestAnimationFrame(this.update)
          }
          return e.prototype.draw = function() {
            s.clearScreen();
            for (let t = 0, e = this.bursts; t < e.length; t++) {
              e[t].draw()
            }
          }
          ,
          e;
        })(),
        i = (() => {
          function t(t) {
            this.particles = [];
            for (let i = 0; i < e.CONFIG.particle_count; i++)
              this.particles.push(new n(t))
          }
          return t.prototype.update = function(t) {
            for (let e = this.particles.length - 1; e >= 0; e--)
              this.particles[e].update(t),
              this.particles[e].checkBounds() && this.particles.splice(e, 1)
          }
          ,
          t.prototype.draw = function() {
            for (let t = this.particles.length - 1; t >= 0; t--)
              this.particles[t].draw()
          }
          ,
          t;
        })(),
        n = (() => {
          function t(t) {
            this.size = new o((16 * Math.random() + 4) * e.CONFIG.particle_size,(4 * Math.random() + 4) * e.CONFIG.particle_size),
            this.position = new o(t.x - this.size.x / 2,t.y - this.size.y / 2),
            this.velocity = r.generateVelocity(),
            this.rotation = 360 * Math.random(),
            this.rotation_speed = 10 * (Math.random() - .5),
            this.hue = 360 * Math.random(),
            this.opacity = 100,
            this.lifetime = Math.random() + .25
          }
          return t.prototype.update = function(t) {
            this.velocity.y += e.CONFIG.gravity * (this.size.y / (10 * e.CONFIG.particle_size)) * t,
            this.velocity.x += 25 * (Math.random() - .5) * t,
            this.velocity.y *= .98,
            this.velocity.x *= .98,
            this.position.x += this.velocity.x,
            this.position.y += this.velocity.y,
            this.rotation += this.rotation_speed,
            e.CONFIG.fade && (this.opacity -= this.lifetime)
          }
          ,
          t.prototype.checkBounds = function() {
            return this.position.y - 2 * this.size.x > 2 * window.innerHeight
          }
          ,
          t.prototype.draw = function() {
            s.drawRectangle(this.position, this.size, this.rotation, this.hue, this.opacity)
          }
          ,
          t
        })(),
        o = (() => {
          return function(t, e) {
            this.x = t || 0,
            this.y = e || 0
          }
        })(),
        r = (() => {
          function t() {}
          return t.generateVelocity = () => {
            let t = Math.random() - .5;
            let i = Math.random() - .7;
            const n = Math.sqrt(t * t + i * i);
            return i /= n,
            new o((t /= n) * (Math.random() * e.CONFIG.explosion_power),i * (Math.random() * e.CONFIG.explosion_power))
          }
          ,
          t;
        })(),
        s = (() => {
          function t() {}
          return t.clearScreen = () => {
            e.CTX && e.CTX.clearRect(0, 0, 2 * window.innerWidth, 2 * window.innerHeight)
          }
          ,
          t.drawRectangle = (t, i, n, o, r) => {
            e.CTX && (e.CTX.save(),
            e.CTX.beginPath(),
            e.CTX.translate(t.x + i.x / 2, t.y + i.y / 2),
            e.CTX.rotate(n * Math.PI / 180),
            e.CTX.rect(-i.x / 2, -i.y / 2, i.x, i.y),
            e.CTX.fillStyle = `hsla(${o}deg, 90%, 65%, ${r}%)`,
            e.CTX.fill(),
            e.CTX.restore())
          }
          ,
          t;
        })();
  return e
})();

export default Confetti;
