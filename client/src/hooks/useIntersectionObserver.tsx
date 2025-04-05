import { useState, useEffect, RefObject, useCallback } from 'react';

interface IntersectionOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

/**
 * Hook that tracks whether an element is visible in the viewport
 * Great for triggering animations or loading content when the user scrolls to it
 *
 * @param elementRef React ref for the element to track
 * @param options IntersectionObserver options and additional configuration
 * @param options.threshold Percentage of the element that should be visible
 * @param options.root The element used as viewport for checking visibility
 * @param options.rootMargin Margin around the root
 * @param options.freezeOnceVisible Once visible, stop tracking visibility
 */
export function useIntersectionObserver(
  elementRef: RefObject<Element>,
  {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
  }: IntersectionOptions = {}
): {
  isIntersecting: boolean;
  intersectionRatio: number;
  entry: IntersectionObserverEntry | null;
} {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  const updateEntry = useCallback(([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry);
  }, []);

  useEffect(() => {
    const node = elementRef?.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !node) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);

    observer.observe(node);

    return () => observer.disconnect();
  }, [elementRef, threshold, root, rootMargin, frozen, updateEntry]);

  return {
    isIntersecting: !!entry?.isIntersecting,
    intersectionRatio: entry?.intersectionRatio || 0,
    entry,
  };
}