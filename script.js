const canvas = document.getElementById("hc");
      const ctx = canvas.getContext("2d");
      let W, H;
      function resize() {
        W = canvas.width = innerWidth;
        H = canvas.height = innerHeight;
      }
      resize();
      window.addEventListener("resize", resize);

      function heartPath(cx, cy, s) {
        ctx.beginPath();
        ctx.moveTo(cx, cy + s * 0.28);
        ctx.bezierCurveTo(cx, cy, cx - s, cy, cx - s, cy - s * 0.5);
        ctx.bezierCurveTo(
          cx - s,
          cy - s * 1.1,
          cx,
          cy - s * 1.1,
          cx,
          cy - s * 0.5,
        );
        ctx.bezierCurveTo(
          cx,
          cy - s * 1.1,
          cx + s,
          cy - s * 1.1,
          cx + s,
          cy - s * 0.5,
        );
        ctx.bezierCurveTo(cx + s, cy, cx, cy, cx, cy + s * 0.28);
        ctx.closePath();
      }

      const hearts = Array.from({ length: 30 }, () => ({
        x: Math.random(),
        y: Math.random(),
        s: 4 + Math.random() * 9,
        a: 0.03 + Math.random() * 0.2,
        da: (0.001 + Math.random() * 0.003) * (Math.random() > 0.5 ? 1 : -1),
        vy: -(0.00006 + Math.random() * 0.00013),
        vx: (Math.random() - 0.5) * 0.00005,
        wb: Math.random() * Math.PI * 2,
        ws: 0.012 + Math.random() * 0.018,
        hue: 325 + Math.random() * 35,
      }));

      function drawHearts() {
        ctx.clearRect(0, 0, W, H);
        hearts.forEach((h) => {
          h.a = Math.max(0.03, Math.min(0.24, h.a + h.da));
          if (h.a <= 0.03 || h.a >= 0.24) h.da *= -1;
          h.y += h.vy;
          h.wb += h.ws;
          h.x += h.vx + Math.sin(h.wb) * 0.00004;
          if (h.y < -0.06) h.y = 1.06;
          if (h.x < -0.06) h.x = 1.06;
          if (h.x > 1.06) h.x = -0.06;
          ctx.save();
          heartPath(h.x * W, h.y * H, h.s);
          ctx.fillStyle = `hsla(${h.hue},80%,72%,${h.a})`;
          ctx.fill();
          ctx.restore();
        });
        requestAnimationFrame(drawHearts);
      }
      drawHearts();

      function spawnPetals(count) {
        const container = document.getElementById("petals");
        const emojis = ["🌻", "🌼", "💛", "✨", "🌸", "💕", "⭐"];
        for (let i = 0; i < count; i++) {
          setTimeout(() => {
            const el = document.createElement("div");
            el.className = "petal";
            el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            el.style.left = Math.random() * 100 + "vw";
            const dur = 3.5 + Math.random() * 4;
            el.style.animation = `fallPetal ${dur}s linear forwards`;
            el.style.fontSize = 13 + Math.random() * 16 + "px";
            container.appendChild(el);
            setTimeout(() => el.remove(), dur * 1000 + 300);
          }, i * 100);
        }
      }

      let opened = false;
      function openEnvelope() {
        if (opened) return;
        opened = true;

        // 🎵 Iniciar música al abrir el sobre
        const music = document.getElementById("bgMusic");
        music.volume = 0;
        music.play().catch(() => {});
        // Fade in suave del volumen
        let vol = 0;
        const fadeIn = setInterval(() => {
          vol = Math.min(1, vol + 0.05);
          music.volume = vol;
          if (vol >= 1) clearInterval(fadeIn);
        }, 100);
        const flap = document.getElementById("flap");
        const seal = document.getElementById("seal");
        const ew = document.getElementById("env-wrap");
        const msg = document.getElementById("msg");
        const bouquet = document.getElementById("bouquet");
        seal.style.opacity = "0";
        flap.style.transform = "rotateX(180deg)";
        spawnPetals(35);
        setTimeout(() => {
          ew.style.transition = "opacity .5s,transform .5s";
          ew.style.opacity = "0";
          ew.style.transform = "translateY(16px) scale(.88)";
        }, 750);
        setTimeout(() => {
          ew.style.display = "none";
          msg.classList.add("visible");
          bouquet.classList.add("bloomed");
          spawnPetals(45);
        }, 1350);
      }

      function resetAll() {
        const music = document.getElementById("bgMusic");
        music.pause();
        music.currentTime = 0;
        const ew = document.getElementById("env-wrap");
        const msg = document.getElementById("msg");
        const flap = document.getElementById("flap");
        const seal = document.getElementById("seal");
        const bouquet = document.getElementById("bouquet");
        msg.classList.remove("visible");
        bouquet.classList.remove("bloomed");
        opened = false;
        setTimeout(() => {
          flap.style.transition = "none";
          flap.style.transform = "none";
          seal.style.opacity = "1";
          ew.style.display = "block";
          ew.style.opacity = "1";
          ew.style.transform = "none";
          setTimeout(() => {
            flap.style.transition = "transform .7s cubic-bezier(.4,0,.2,1)";
          }, 50);
        }, 600);
      }

document.getElementById("envelope").addEventListener("click", openEnvelope);
document.getElementById("againBtn").addEventListener("click", resetAll);
