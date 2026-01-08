import React, { useEffect, useRef } from 'react';

const ParticleNetwork = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width, height;
    let particles = [];
    const spacing = 30; 
    const mouseRadius = 180; 

    const mouse = { x: -1000, y: -1000 };

    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles = [];
      for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
          particles.push({
            x, y, originX: x, originY: y, vx: 0, vy: 0
          });
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouseRadius) {
          const angle = Math.atan2(dy, dx);
          const force = (mouseRadius - distance) / mouseRadius;
          p.vx -= Math.cos(angle) * force * 10; 
          p.vy -= Math.sin(angle) * force * 10;
        }

        p.x += (p.originX - p.x) * 0.1;
        p.y += (p.originY - p.y) * 0.1;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.85;
        p.vy *= 0.85;

        ctx.fillStyle = '#111';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    init();
    animate();

    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className='fixed inset-0 z-0 pointer-events-none' />;
};

export default ParticleNetwork;
