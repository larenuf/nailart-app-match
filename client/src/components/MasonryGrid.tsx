import { ReactNode, Children, CSSProperties, useMemo } from 'react';
import { AnimatedOnScroll } from './AnimatedOnScroll';

interface MasonryGridProps {
  children: ReactNode;
  columns?: number | { mobile?: number; tablet?: number; desktop?: number };
  gap?: number | string;
  className?: string;
  animate?: boolean;
}

/**
 * Masonry Grid düzeni için bileşen
 * Modern CSS Grid kullanarak masonry düzeni sağlar
 * Ayrıca istenirse her öğe için animasyon desteği verir
 * 
 * @param children - Grid içerisinde gösterilecek öğeler
 * @param columns - Sütun sayısı (varsayılan 3)
 * @param gap - Öğeler arası boşluk (varsayılan 20px)
 * @param className - Ek CSS sınıfları
 * @param animate - Öğelerin tek tek animasyonlu gösterilip gösterilmeyeceği (varsayılan false)
 */
export function MasonryGrid({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 20,
  className = '',
  animate = false
}: MasonryGridProps) {
  // Sütun yapılandırmasını normalize et
  const normalizedColumns = useMemo(() => {
    if (typeof columns === 'number') {
      return {
        mobile: 1,
        tablet: columns >= 2 ? 2 : 1,
        desktop: columns
      };
    }
    return {
      mobile: columns.mobile || 1,
      tablet: columns.tablet || 2,
      desktop: columns.desktop || 3
    };
  }, [columns]);

  // CSS grid yapılandırması
  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(var(--columns, ${normalizedColumns.desktop}), 1fr)`,
    gap: typeof gap === 'number' ? `${gap}px` : gap,
  };

  // Responsive sütun sayısı için media queries
  const mobileStyles = `
    .masonry-grid {
      --columns: ${normalizedColumns.mobile};
    }
  `;

  const tabletStyles = `
    @media (min-width: 640px) {
      .masonry-grid {
        --columns: ${normalizedColumns.tablet};
      }
    }
  `;

  const desktopStyles = `
    @media (min-width: 1024px) {
      .masonry-grid {
        --columns: ${normalizedColumns.desktop};
      }
    }
  `;

  // Çocuk öğeleri al
  const childArray = Children.toArray(children);

  return (
    <>
      <style>
        {mobileStyles}
        {tabletStyles}
        {desktopStyles}
      </style>
      <div className={`masonry-grid ${className}`} style={gridStyle} role="grid">
        {animate
          ? childArray.map((child, index) => (
              <AnimatedOnScroll
                key={index}
                animation="fade"
                delay={0.05}
                duration={0.4}
                staggerIndex={index}
                className="masonry-item"
              >
                {child}
              </AnimatedOnScroll>
            ))
          : childArray.map((child, index) => (
              <div key={index} className="masonry-item">
                {child}
              </div>
            ))}
      </div>
    </>
  );
}