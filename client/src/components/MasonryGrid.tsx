import React, { ReactNode } from 'react';

interface MasonryGridProps {
  children: ReactNode;
  columns?: number | { sm: number; md: number; lg: number; xl: number };
  gap?: string;
  className?: string;
}

const getColumnCount = (
  columns: number | { sm: number; md: number; lg: number; xl: number },
  windowWidth: number
): number => {
  if (typeof columns === 'number') {
    return columns;
  }

  if (windowWidth < 640) {
    return columns.sm;
  } else if (windowWidth < 768) {
    return columns.md;
  } else if (windowWidth < 1024) {
    return columns.lg;
  } else {
    return columns.xl;
  }
};

const MasonryGrid: React.FC<MasonryGridProps> = ({
  children,
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = '1rem',
  className = '',
}) => {
  const [columnCount, setColumnCount] = React.useState(
    getColumnCount(columns, typeof window !== 'undefined' ? window.innerWidth : 1024)
  );

  React.useEffect(() => {
    const handleResize = () => {
      setColumnCount(getColumnCount(columns, window.innerWidth));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [columns]);

  // Children'ları kolonlara böl
  const childrenArray = React.Children.toArray(children);
  const columnItems: ReactNode[][] = Array.from({ length: columnCount }, () => []);

  // Her bir çocuk elemanı sırayla kolonlara dağıt (DOM'da sıralı görünüm için)
  childrenArray.forEach((child, index) => {
    const columnIndex = index % columnCount;
    columnItems[columnIndex].push(
      <div key={index} className="mb-4">
        {child}
      </div>
    );
  });

  return (
    <div
      className={`grid auto-rows-auto ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
        gap,
      }}
    >
      {columnItems.map((items, columnIndex) => (
        <div key={columnIndex} className="flex flex-col">
          {items}
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;