/**
 * CardioSuite AI - Photorealistic 2.5D / 3D Anatomical Heart Canvas Engine
 * Renders the central anatomical cardiac organ with muscle shading, aorta,
 * pulmonary trunk, coronary vessels, rhythmic contraction, orbital rings,
 * and pulsing interactive anatomical hotspots (LV Apex, Aortic Valve, Mitral Valve, SA Node).
 */

class AnatomicalHeartVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.heartRate = 72;
    this.time = 0;
    this.animationFrameId = null;
    this.activeHotspot = null;

    // Interactive Hotspots on the Anatomical Heart
    this.hotspots = [
      {
        id: 'lv_apex',
        title: 'Left Ventricle (LV Apex)',
        relX: 0.44,
        relY: 0.72,
        info: 'Apical 4-Chamber contour target. Computes LVEF (Simpson\'s Rule).',
        modality: 'echo',
        metric: 'LVEF 27.5%',
        badge: 'HFrEF / Depressed'
      },
      {
        id: 'aortic_valve',
        title: 'Aortic Valve & Root',
        relX: 0.52,
        relY: 0.32,
        info: 'Harsh crescendo-decrescendo ejection systolic murmur site (AS).',
        modality: 'stethoscope',
        metric: 'Auscultation: AS / AR',
        badge: 'Valvular Target'
      },
      {
        id: 'mitral_valve',
        title: 'Mitral Valve Annulus',
        relX: 0.40,
        relY: 0.48,
        info: 'Apical holosystolic regurgitation jet & S3 gallop origin.',
        modality: 'stethoscope',
        metric: 'Murmur: Holosystolic',
        badge: 'Regurgitation'
      },
      {
        id: 'sa_node',
        title: 'Sinoatrial (SA) & AV Nodal Conduction',
        relX: 0.62,
        relY: 0.38,
        info: 'Pharmacovigilance nodal block hazard (Beta-blockers + CCBs + Digoxin).',
        modality: 'drugs',
        metric: 'Conduction Safety',
        badge: 'Arrhythmia Risk'
      }
    ];

    this.onHotspotSelected = null;
    this.initEvents();
    this.startAnimation();
  }

  initEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const mouseX = (e.clientX - rect.left) * scaleX;
      const mouseY = (e.clientY - rect.top) * scaleY;

      let hovered = null;
      for (const spot of this.hotspots) {
        const sx = spot.relX * this.canvas.width;
        const sy = spot.relY * this.canvas.height;
        const dist = Math.hypot(mouseX - sx, mouseY - sy);
        if (dist < 22) {
          hovered = spot;
          break;
        }
      }
      this.canvas.style.cursor = hovered ? 'pointer' : 'default';
      this.activeHotspot = hovered;
    });

    this.canvas.addEventListener('click', (e) => {
      if (this.activeHotspot && this.onHotspotSelected) {
        this.onHotspotSelected(this.activeHotspot);
      }
    });
  }

  setHeartRate(hr) {
    this.heartRate = hr || 72;
  }

  startAnimation() {
    let lastTime = performance.now();
    const animate = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      this.time += dt;
      this.render();
      this.animationFrameId = requestAnimationFrame(animate);
    };
    this.animationFrameId = requestAnimationFrame(animate);
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2 + 10;
    const cy = h / 2 + 15;

    ctx.clearRect(0, 0, w, h);

    // 1. Draw Concentric Modern Orbital Rings (as seen in the design reference image)
    this.drawOrbitalRings(ctx, cx, cy);

    // 2. Cardiac Pulse Oscillation
    const beatPeriod = 60 / this.heartRate;
    const cyclePhase = (this.time % beatPeriod) / beatPeriod; // 0 to 1
    let pulseScale = 1.0;
    if (cyclePhase < 0.25) {
      // Systolic beat contraction & expansion
      pulseScale = 1.0 + Math.sin(cyclePhase * Math.PI * 4) * 0.038;
    }

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(pulseScale, pulseScale);
    ctx.translate(-cx, -cy);

    // 3. Render 3D Anatomical Heart Organs
    this.drawPhotorealisticHeart(ctx, cx, cy);

    ctx.restore();

    // 4. Render Glowing Interactive Hotspot Nodes
    this.drawHotspots(ctx, w, h);
  }

  drawOrbitalRings(ctx, cx, cy) {
    ctx.save();
    // Outer subtle orbital ring
    ctx.beginPath();
    ctx.arc(cx - 10, cy, 175, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(37, 99, 235, 0.22)'; // royal blue
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Inner subtle secondary orbital ring
    ctx.beginPath();
    ctx.arc(cx - 10, cy, 140, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.12)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Orbiting particle on the ring
    const orbitAngle = this.time * 0.8;
    const px = (cx - 10) + Math.cos(orbitAngle) * 175;
    const py = cy + Math.sin(orbitAngle) * 175;
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.arc(px, py, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawPhotorealisticHeart(ctx, cx, cy) {
    ctx.save();

    // Soft drop shadow underneath the 3D heart
    ctx.shadowColor = 'rgba(180, 50, 70, 0.25)';
    ctx.shadowBlur = 32;
    ctx.shadowOffsetY = 18;

    // --- 1. Superior Vena Cava & Right Atrium (Upper Right / Back) ---
    const svcGrad = ctx.createLinearGradient(cx + 20, cy - 140, cx + 50, cy - 40);
    svcGrad.addColorStop(0, '#5a7bb5');
    svcGrad.addColorStop(0.5, '#40639e');
    svcGrad.addColorStop(1, '#9b4a5a');
    ctx.fillStyle = svcGrad;
    ctx.beginPath();
    ctx.ellipse(cx + 38, cy - 80, 18, 42, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // --- 2. Ascending Aorta & Aortic Arch (Top Arch) ---
    const aortaGrad = ctx.createRadialGradient(cx - 10, cy - 105, 10, cx + 10, cy - 85, 65);
    aortaGrad.addColorStop(0, '#e57373');
    aortaGrad.addColorStop(0.3, '#d32f2f');
    aortaGrad.addColorStop(0.7, '#b71c1c');
    aortaGrad.addColorStop(1, '#880e4f');

    ctx.fillStyle = aortaGrad;
    ctx.beginPath();
    ctx.moveTo(cx - 15, cy - 45);
    ctx.bezierCurveTo(cx - 15, cy - 110, cx - 2, cy - 142, cx + 24, cy - 130);
    ctx.bezierCurveTo(cx + 42, cy - 120, cx + 45, cy - 80, cx + 32, cy - 50);
    ctx.bezierCurveTo(cx + 10, cy - 35, cx - 5, cy - 35, cx - 15, cy - 45);
    ctx.fill();

    // Brachiocephalic, Carotid, Subclavian Branches on Arch
    ctx.fillStyle = '#c62828';
    [ {x: cx - 2, y: cy - 138, h: 22, w: 7},
      {x: cx + 10, y: cy - 141, h: 26, w: 7},
      {x: cx + 22, y: cy - 136, h: 24, w: 7}
    ].forEach(b => {
      ctx.beginPath();
      ctx.roundRect(b.x, b.y - b.h, b.w, b.h, 3);
      ctx.fill();
    });

    // --- 3. Pulmonary Trunk & Arteries (Crossing over Aorta) ---
    const pulmGrad = ctx.createLinearGradient(cx - 35, cy - 80, cx + 15, cy - 30);
    pulmGrad.addColorStop(0, '#4b6584');
    pulmGrad.addColorStop(0.5, '#3867d6');
    pulmGrad.addColorStop(1, '#778ca3');
    ctx.fillStyle = pulmGrad;
    ctx.beginPath();
    ctx.moveTo(cx - 32, cy - 45);
    ctx.bezierCurveTo(cx - 35, cy - 75, cx - 18, cy - 90, cx - 2, cy - 75);
    ctx.bezierCurveTo(cx + 14, cy - 62, cx + 12, cy - 40, cx - 5, cy - 35);
    ctx.closePath();
    ctx.fill();

    // Reset shadow for myocardium bulk
    ctx.shadowBlur = 18;
    ctx.shadowColor = 'rgba(120, 20, 40, 0.2)';

    // --- 4. Main Ventricular Muscle Bulk (LV & RV Anatomy) ---
    const myoGrad = ctx.createRadialGradient(cx - 20, cy + 20, 25, cx, cy + 30, 140);
    myoGrad.addColorStop(0, '#e57373'); // anterior highlight
    myoGrad.addColorStop(0.25, '#d32f2f'); // muscle tone
    myoGrad.addColorStop(0.55, '#c2185b'); // deep myocardial tissue
    myoGrad.addColorStop(0.85, '#880e4f'); // lateral shadow
    myoGrad.addColorStop(1, '#4a0024'); // deep posterior contour

    ctx.fillStyle = myoGrad;
    ctx.beginPath();
    // Anatomical apex to base contour
    ctx.moveTo(cx - 36, cy - 35); // Base of pulmonary trunk
    ctx.bezierCurveTo(cx - 95, cy - 15, cx - 105, cy + 45, cx - 80, cy + 85); // Right Ventricle bulge
    ctx.bezierCurveTo(cx - 65, cy + 120, cx - 35, cy + 145, cx - 15, cy + 155); // Apex
    ctx.bezierCurveTo(cx + 10, cy + 145, cx + 55, cy + 105, cx + 75, cy + 60); // Left Ventricle lateral
    ctx.bezierCurveTo(cx + 90, cy + 25, cx + 75, cy - 15, cx + 45, cy - 30); // Left Atrium
    ctx.bezierCurveTo(cx + 20, cy - 35, cx - 15, cy - 40, cx - 36, cy - 35);
    ctx.closePath();
    ctx.fill();

    // --- 5. Anterior Interventricular Sulcus & Coronary Arteries ---
    ctx.shadowBlur = 0;
    // Coronary Artery Groove (LAD - Left Anterior Descending Artery)
    ctx.strokeStyle = '#ef5350';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy - 25);
    ctx.bezierCurveTo(cx - 15, cy + 25, cx - 25, cy + 80, cx - 15, cy + 150);
    ctx.stroke();

    // Coronary Artery Branching (Diagonal and Septal Branches)
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(cx - 12, cy + 10);
    ctx.quadraticCurveTo(cx - 40, cy + 30, cx - 60, cy + 45);
    ctx.moveTo(cx - 18, cy + 45);
    ctx.quadraticCurveTo(cx - 45, cy + 68, cx - 62, cy + 90);
    ctx.moveTo(cx - 15, cy + 80);
    ctx.quadraticCurveTo(cx + 15, cy + 95, cx + 38, cy + 105);
    ctx.stroke();

    // Cardiac Veins (Great Cardiac Vein - Blue Tracing)
    ctx.strokeStyle = '#42a5f5';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(cx - 4, cy - 20);
    ctx.bezierCurveTo(cx - 10, cy + 28, cx - 20, cy + 78, cx - 12, cy + 140);
    ctx.stroke();

    // --- 6. Adipose Tissue Fat Pads around Grooves (Realistic Soft Cream/Gold) ---
    ctx.fillStyle = 'rgba(255, 236, 179, 0.45)';
    ctx.beginPath();
    ctx.ellipse(cx - 8, cy - 25, 14, 8, -0.2, 0, Math.PI * 2);
    ctx.ellipse(cx - 30, cy + 115, 10, 6, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // --- 7. Volumetric Muscle Specular Gloss & Highlights ---
    const glossGrad = ctx.createRadialGradient(cx - 25, cy + 20, 5, cx - 35, cy + 30, 75);
    glossGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
    glossGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.08)');
    glossGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = glossGrad;
    ctx.beginPath();
    ctx.ellipse(cx - 35, cy + 30, 55, 65, -0.25, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawHotspots(ctx, w, h) {
    const now = this.time;
    for (const spot of this.hotspots) {
      const sx = spot.relX * w;
      const sy = spot.relY * h;
      const isHovered = this.activeHotspot && this.activeHotspot.id === spot.id;

      ctx.save();

      // Pulsing Ripple Ring
      const ripplePhase = (now * 1.5 + spot.relX * 5) % 1;
      const rippleRadius = 9 + ripplePhase * 16;
      ctx.beginPath();
      ctx.arc(sx, sy, rippleRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(37, 99, 235, ${0.6 * (1 - ripplePhase)})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Outer White Circular Disc with Soft Shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(sx, sy, isHovered ? 11 : 9, 0, Math.PI * 2);
      ctx.fill();

      // Inner Core Accent Dot
      ctx.fillStyle = '#2563eb'; // royal blue
      ctx.beginPath();
      ctx.arc(sx, sy, isHovered ? 5.5 : 4, 0, Math.PI * 2);
      ctx.fill();

      // Tooltip Card when Hovered
      if (isHovered) {
        this.renderHotspotTooltip(ctx, spot, sx, sy, w);
      }

      ctx.restore();
    }
  }

  renderHotspotTooltip(ctx, spot, sx, sy, canvasW) {
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 6;

    const tipW = 210;
    const tipH = 74;
    let tipX = sx + 16;
    let tipY = sy - 37;

    // Flip to left if near right edge
    if (tipX + tipW > canvasW - 10) {
      tipX = sx - tipW - 16;
    }

    // Card background
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(tipX, tipY, tipW, tipH, 12);
    ctx.fill();

    ctx.strokeStyle = 'rgba(37, 99, 235, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Card content
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillText(spot.title, tipX + 12, tipY + 20);

    ctx.fillStyle = '#2563eb';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.fillText(spot.metric, tipX + 12, tipY + 36);

    ctx.fillStyle = '#64748b';
    ctx.font = '9px Inter, sans-serif';
    ctx.fillText(spot.info.substring(0, 36) + '...', tipX + 12, tipY + 52);

    ctx.fillStyle = '#059669';
    ctx.font = 'bold 8.5px Inter, sans-serif';
    ctx.fillText(`● Click to test in ${spot.modality.toUpperCase()}`, tipX + 12, tipY + 66);

    ctx.restore();
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

window.AnatomicalHeartVisualizer = AnatomicalHeartVisualizer;
