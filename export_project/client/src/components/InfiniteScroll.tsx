import { useEffect, useRef, useState, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { useI18n } from '@/i18n';

interface InfiniteScrollProps {
  children: ReactNode;
  loadMore: () => Promise<any>;
  hasMore: boolean;
  loading: boolean;
  loader?: ReactNode;
  endMessage?: ReactNode;
  threshold?: number;
  className?: string;
}

export function InfiniteScroll({
  children,
  loadMore,
  hasMore,
  loading,
  loader,
  endMessage,
  threshold = 200,
  className = ''
}: InfiniteScrollProps) {
  const [isFetching, setIsFetching] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const { locale } = useI18n();
  
  useEffect(() => {
    const currentObserver = observerRef.current;
    
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry?.isIntersecting && hasMore && !loading && !isFetching) {
        handleLoadMore();
      }
    };
    
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: `0px 0px ${threshold}px 0px`,
      threshold: 0.1
    });
    
    if (currentObserver) {
      observer.observe(currentObserver);
    }
    
    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [hasMore, loading, isFetching, threshold]);
  
  const handleLoadMore = async () => {
    if (!hasMore || loading || isFetching) return;
    
    setIsFetching(true);
    try {
      await loadMore();
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
      setIsFetching(false);
    }
  };
  
  return (
    <div className={className}>
      {children}
      
      <div ref={observerRef} className="w-full h-10 flex items-center justify-center my-4">
        {loading || isFetching ? (
          loader || (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {locale === 'tr' ? 'Yükleniyor...' : locale === 'en' ? 'Loading...' : 'جاري التحميل...'}
              </span>
            </div>
          )
        ) : hasMore ? (
          <div className="h-8" /> // Spacer for observer to have room
        ) : (
          endMessage || (
            <p className="text-sm text-gray-500 dark:text-gray-400 py-2">
              {locale === 'tr' ? 'Daha fazla içerik yok' : locale === 'en' ? 'No more content to load' : 'لا يوجد المزيد من المحتوى'}
            </p>
          )
        )}
      </div>
    </div>
  );
}