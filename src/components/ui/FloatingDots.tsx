import * as React from 'react';

interface FloatingDotsProps {
  count?: number;
  color?: string;
  minRadius?: number;
  maxRadius?: number;
  minSpeed?: number;
  maxSpeed?: number;
  containerClassName?: string;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  color: string;
  speed: number;
  directionX: number;
  directionY: number;
  originalX: number;
  originalY: number;
  alpha: number; 
  breathPhase: number; // 添加呼吸相位
  breathSpeed: number; // 呼吸速度
  idleTimer: number; // 閒置計時器
  idleOffsetX: number; // 閒置時X方向的偏移
  idleOffsetY: number; // 閒置時Y方向的偏移
  idleOffsetSpeed: number; // 閒置偏移變化速度
}

export default function FloatingDots({
  count = 50,
  color = 'rgba(41, 255, 31, 0.7)',
  minRadius = 1,
  maxRadius = 4,
  minSpeed = 0.5,
  maxSpeed = 1.5,
  containerClassName = '',
}: FloatingDotsProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const particlesRef = React.useRef<Particle[]>([]);
  const animationFrameRef = React.useRef<number | null>(null);
  const [mousePosition, setMousePosition] = React.useState<{ x: number; y: number } | null>(null);
  const lastMouseMoveRef = React.useRef<number>(Date.now());
  const idleThresholdRef = React.useRef<number>(2000); // 2秒無動作視為閒置

  // Initialize particles
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // 確保 canvas 大小正確
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    const initParticles = () => {
      const particles: Particle[] = [];
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      for (let i = 0; i < count; i++) {
        const radius = Math.random() * (maxRadius - minRadius) + minRadius;
        const x = Math.random() * containerWidth;
        const y = Math.random() * containerHeight;
        const speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
        const directionX = Math.random() - 0.5;
        const directionY = Math.random() - 0.5;
        const alpha = Math.random() * 0.7 + 0.3; // 隨機透明度 0.3-1.0
        const breathPhase = Math.random() * Math.PI * 2; // 隨機初始相位
        const breathSpeed = 0.02 + Math.random() * 0.03; // 隨機呼吸速度

        particles.push({
          x,
          y,
          radius,
          color: color.replace('0.7', alpha.toString()),
          speed,
          directionX,
          directionY,
          originalX: x,
          originalY: y,
          alpha,
          breathPhase,
          breathSpeed,
          idleTimer: 0,
          idleOffsetX: 0,
          idleOffsetY: 0,
          idleOffsetSpeed: 0.2 + Math.random() * 0.3
        });
      }

      particlesRef.current = particles;
    };

    initParticles();

    const handleResize = () => {
      if (canvasRef.current && container) {
        canvasRef.current.width = container.offsetWidth;
        canvasRef.current.height = container.offsetHeight;
        initParticles();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };  }, [count, color, minRadius, maxRadius, minSpeed, maxSpeed]);

  // 設置動畫
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationActive = true;
    const now = Date.now();
    const isIdle = now - lastMouseMoveRef.current > idleThresholdRef.current;

    const animate = () => {
      if (!animationActive) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const currentTime = Date.now();
      const isCurrentlyIdle = currentTime - lastMouseMoveRef.current > idleThresholdRef.current;
      
      particlesRef.current.forEach((particle) => {
        // 更新呼吸相位
        particle.breathPhase += particle.breathSpeed;
        if (particle.breathPhase > Math.PI * 2) {
          particle.breathPhase -= Math.PI * 2;
        }
        
        // 根據呼吸相位計算透明度變化
        const breathAlpha = particle.alpha * (0.6 + 0.4 * Math.sin(particle.breathPhase));
        
        // 處理閒置狀態
        if (isCurrentlyIdle) {
          // 增加閒置計時器
          particle.idleTimer += 0.01;
          
          // 計算閒置時的隨機偏移
          const idleOffsetX = Math.sin(particle.idleTimer * particle.idleOffsetSpeed) * 5;
          const idleOffsetY = Math.cos(particle.idleTimer * particle.idleOffsetSpeed * 1.3) * 5;
          
          // 應用閒置偏移
          particle.idleOffsetX = idleOffsetX;
          particle.idleOffsetY = idleOffsetY;
        } else {
          // 逐漸減少閒置偏移
          particle.idleOffsetX *= 0.95;
          particle.idleOffsetY *= 0.95;
        }
        
        // 繪製粒子 (加上閒置偏移)
        const drawX = particle.x + particle.idleOffsetX;
        const drawY = particle.y + particle.idleOffsetY;
        
        // 繪製粒子
        ctx.beginPath();
        ctx.arc(drawX, drawY, particle.radius, 0, Math.PI * 2);
        
        // 使用呼吸效果透明度
        const baseColor = color.replace('rgba(', '').replace(')', '').split(',');
        const r = baseColor[0];
        const g = baseColor[1];
        const b = baseColor[2];
        const particleColor = `rgba(${r}, ${g}, ${b}, ${breathAlpha})`;
        
        ctx.fillStyle = particleColor;
        ctx.fill();
        
        // 創建發光效果
        const glow = ctx.createRadialGradient(
          drawX, 
          drawY, 
          0, 
          drawX, 
          drawY, 
          particle.radius * 5
        );
        
        glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${breathAlpha * 0.7})`);
        glow.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${breathAlpha * 0.3})`);
        glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        ctx.beginPath();
        ctx.arc(drawX, drawY, particle.radius * 5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // 移動粒子
        particle.x += particle.directionX * particle.speed;
        particle.y += particle.directionY * particle.speed;

        // 邊界反彈
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.directionX *= -1;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.directionY *= -1;
        }

        // 對鼠標位置做出反應
        if (mousePosition && !isCurrentlyIdle) {
          const dx = mousePosition.x - particle.x;
          const dy = mousePosition.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 150;

          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            particle.x -= dx * force * 0.05;
            particle.y -= dy * force * 0.05;
            
            // 增加當鼠標靠近時的透明度 (更明亮)
            particle.alpha = Math.min(1.0, particle.alpha + 0.05);
          } else {
            // 緩慢回到原來位置
            particle.x += (particle.originalX - particle.x) * 0.01;
            particle.y += (particle.originalY - particle.y) * 0.01;
            
            // 逐漸恢復原透明度
            particle.alpha = Math.max(0.3, particle.alpha - 0.01);
          }
        } else {
          // 閒置狀態下緩慢回到原始位置
          particle.x += (particle.originalX - particle.x) * 0.003;
          particle.y += (particle.originalY - particle.y) * 0.003;
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      animationActive = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };  }, [mousePosition, color]);

  // 處理鼠標事件
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      
      // 更新最後鼠標移動時間
      lastMouseMoveRef.current = Date.now();
    };

    const handleMouseLeave = () => {
      setMousePosition(null);
    };

    // 監聽整個文檔而不僅僅是容器
    document.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`floating-dots-container ${containerClassName}`}
      style={{ position: 'absolute', inset: 0 }}
    >
      <canvas 
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0 }}
      />
    </div>
  );
}