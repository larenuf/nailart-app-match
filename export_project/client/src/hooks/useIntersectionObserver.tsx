import { useState, useEffect, useRef, RefObject } from 'react';

export type IntersectionOptions = {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  triggerOnce?: boolean;
};

export function useIntersectionObserver<T extends Element>({
  threshold = 0,
  rootMargin = '0px',
  root = null,
  triggerOnce = false,
}: IntersectionOptions = {}): [RefObject<T>, boolean, IntersectionObserverEntry | null] {
  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        setEntry(entry);

        if (entry.isIntersecting && triggerOnce) {
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin, root }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, root, triggerOnce]);

  return [ref, isIntersecting, entry];
}

export default useIntersectionObserver;