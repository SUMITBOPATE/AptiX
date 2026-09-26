import { useEffect, useRef, useState } from 'react';

export default function Reveal({ children, index = 0, className = '' }) {
  const ref = useRef(null);
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    // Only hide the content once we know we can reveal it again. If
    // IntersectionObserver is missing, or the visitor asked for reduced
    // motion, leave it visible — the CSS keeps `opacity: 1` by default.
    if (!element || typeof IntersectionObserver === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    setArmed(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.unobserve(element);
      },
      // Fire as soon as the element's top edge crosses the trigger line. A
      // ratio threshold misbehaves on sections taller than the viewport.
      { threshold: 0, rootMargin: '0px 0px -48px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${className}`}
      data-armed={armed ? 'true' : undefined}
      data-visible={visible ? 'true' : undefined}
      style={{ '--index': index }}
    >
      {children}
    </div>
  );
}
