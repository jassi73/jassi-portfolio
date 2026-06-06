import { useEffect, useRef, useState } from 'react';

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Check if device supports hover and pointer fine (not mobile touch screen)
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsMobile(!mediaQuery.matches);

    if (!mediaQuery.matches) return;

    // Enable custom cursor styling on body
    document.body.classList.add('custom-cursor-active');

    const dot = dotRef.current;
    const ring = ringRef.current;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    // Smooth animation loop for outer ring (lerp)
    let animationFrameId: number;
    const render = () => {
      if (dot) {
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      if (ring) {
        // Linear interpolation (lerp) for smooth trailing effect
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    // Event listeners to handle hovering over links, buttons and custom attributes
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, [role="button"], .interactive-element');
      
      if (interactive) {
        setIsHovered(true);
        const text = interactive.getAttribute('data-cursor-text');
        if (text) {
          setCursorText(text);
        } else {
          setCursorText('');
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, [role="button"], .interactive-element');
      
      if (interactive) {
        setIsHovered(false);
        setCursorText('');
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
      document.body.classList.remove('custom-cursor-active');
    };
  }, [isVisible]);

  if (isMobile) return null;

  return (
    <>
      {/* Inner Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          backgroundColor: 'var(--text-primary)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 10000,
          opacity: isVisible && !cursorText ? 1 : 0,
          transition: 'opacity 0.2s ease, width 0.2s ease, height 0.2s ease',
        }}
      />
      {/* Outer Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: cursorText ? '80px' : isHovered ? '60px' : '40px',
          height: cursorText ? '80px' : isHovered ? '60px' : '40px',
          border: cursorText ? 'none' : '1px solid var(--text-primary)',
          backgroundColor: cursorText ? 'var(--text-primary)' : isHovered ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
          color: 'var(--bg-primary)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          opacity: isVisible ? 1 : 0,
          transition: 'width 0.3s var(--ease-out-expo), height 0.3s var(--ease-out-expo), border-color 0.3s ease, background-color 0.3s ease, opacity 0.3s ease',
          // Offset to align ring's center with coordinates
          marginLeft: cursorText ? '-40px' : isHovered ? '-30px' : '-20px',
          marginTop: cursorText ? '-40px' : isHovered ? '-30px' : '-20px',
        }}
      >
        {cursorText}
      </div>
    </>
  );
}
