import React, { useState, useEffect } from 'react';

// Masonry Grid bileşeni
const MasonryGrid: React.FC<{
  children: React.ReactNode;
  columns?: number;
  gap?: number;
}> = ({ children, columns = 3, gap = 16 }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
        width: '100%'
      }}
    >
      {React.Children.map(children, (child, index) => (
        <div key={index}>{child}</div>
      ))}
    </div>
  );
};

// Parallax bileşeni
const ParallaxSection: React.FC<{
  backgroundImage: string;
  height?: number;
  children?: React.ReactNode;
}> = ({ backgroundImage, height = 400, children }) => {
  const [offsetY, setOffsetY] = useState(0);
  
  const handleScroll = () => setOffsetY(window.pageYOffset);
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div
      style={{
        position: 'relative',
        height: `${height}px`,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: `translateY(${offsetY * 0.5}px)`,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1
        }}
      />
      <div
        style={{
          zIndex: 1,
          padding: '2rem',
          color: 'white',
          textAlign: 'center',
          maxWidth: '800px'
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Animasyon bileşeni
const AnimatedItem: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);
  
  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`
      }}
    >
      {children}
    </div>
  );
};

// Konfeti bileşeni
const SuccessConfetti: React.FC<{
  active: boolean;
}> = ({ active }) => {
  const [pieces, setPieces] = useState<JSX.Element[]>([]);
  
  useEffect(() => {
    if (active) {
      const newPieces = [];
      for (let i = 0; i < 50; i++) {
        const style = {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: `${Math.random() * 10 + 5}px`,
          height: `${Math.random() * 10 + 5}px`,
          backgroundColor: ['#ff4081', '#3f51b5', '#4caf50', '#ffeb3b'][
            Math.floor(Math.random() * 4)
          ],
          position: 'absolute',
          borderRadius: '50%',
          animation: `fall-${i} ${Math.random() * 3 + 2}s linear`
        } as React.CSSProperties;
        
        const keyframes = `
          @keyframes fall-${i} {
            0% {
              transform: translateY(-100px) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(${Math.random() * 500 + 300}px) rotate(${
          Math.random() * 360
        }deg);
              opacity: 0;
            }
          }
        `;
        
        newPieces.push(
          <React.Fragment key={i}>
            <style>{keyframes}</style>
            <div style={style} />
          </React.Fragment>
        );
      }
      setPieces(newPieces);
      
      const timer = setTimeout(() => {
        setPieces([]);
      }, 3000);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [active]);
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000,
        overflow: 'hidden'
      }}
    >
      {pieces}
    </div>
  );
};

// Ana test sayfası
const ComponentTest: React.FC = () => {
  const [confettiActive, setConfettiActive] = useState(false);
  
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <header
        style={{
          background: 'linear-gradient(135deg, #7b2cbf 0%, #e83e8c 100%)',
          color: 'white',
          padding: '2rem',
          textAlign: 'center',
          marginBottom: '2rem'
        }}
      >
        <h1>Bileşen Test Sayfası</h1>
        <p>Nail Art Match Uygulaması için UI bileşenleri</p>
      </header>
      
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <section style={{ marginBottom: '4rem' }}>
          <h2>Parallax Bölümü</h2>
          <ParallaxSection
            backgroundImage="https://images.unsplash.com/photo-1577130941609-7f878e898182?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            height={400}
          >
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
              Nail Art Match
            </h2>
            <p style={{ fontSize: '1.2rem', maxWidth: '600px' }}>
              Türkiye'nin en büyük tırnak sanatı platformu ile en iyi sanatçıları keşfedin
            </p>
          </ParallaxSection>
        </section>
        
        <section style={{ marginBottom: '4rem' }}>
          <h2>Masonry Grid</h2>
          <MasonryGrid columns={3} gap={16}>
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: ['#f0f0f0', '#e3f2fd', '#f5f5f5'][i % 3],
                  borderRadius: '8px',
                  padding: '1.5rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  height: `${Math.floor(Math.random() * 150) + 150}px`
                }}
              >
                <h3>Öğe {i + 1}</h3>
                <p>
                  Bu bir örnek içerik kartıdır. Masonry grid içinde farklı yüksekliklerde
                  görüntülenmektedir.
                </p>
              </div>
            ))}
          </MasonryGrid>
        </section>
        
        <section style={{ marginBottom: '4rem' }}>
          <h2>Görünüm Tabanlı Animasyonlar</h2>
          <div>
            {[...Array(5)].map((_, i) => (
              <AnimatedItem key={i} delay={i * 0.2}>
                <div
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    marginBottom: '1rem'
                  }}
                >
                  <h3>Animasyonlu Öğe {i + 1}</h3>
                  <p>
                    Bu öğe sayfada kaydırma yaptıkça görünüme girdiğinde animasyonlu
                    şekilde görünür.
                  </p>
                </div>
              </AnimatedItem>
            ))}
          </div>
        </section>
        
        <section style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <h2>Konfeti Efekti</h2>
          <p>Başarılı işlemler için kutlama efekti</p>
          <button
            onClick={() => setConfettiActive(true)}
            style={{
              backgroundColor: '#e83e8c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Konfeti Göster
          </button>
          <SuccessConfetti active={confettiActive} />
        </section>
      </main>
      
      <footer
        style={{
          backgroundColor: '#f5f5f5',
          padding: '2rem',
          textAlign: 'center',
          marginTop: '2rem'
        }}
      >
        <p>Nail Art Match Bileşen Testi &copy; 2023</p>
      </footer>
    </div>
  );
};

export default ComponentTest;