import React, { useEffect, useState } from 'react';

const MaintenanceBanner = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const bannerStyles = {
    ...styles.banner,
    ...(isMobile && {
      width: '100%',
      height: '50px'
    })
  };

  const textStyles = {
    ...styles.text,
    ...(isMobile && {
      writingMode: 'horizontal-tb',
      fontSize: '12px'
    })
  };

  if (!isClient) return null;

  return (
      <>
        <div style={bannerStyles} id="maintenance-banner">
          <p style={textStyles} className="banner-text">⚠️ Site en cours de travail ⚠️</p>
        </div>
        <style jsx global>{`
        .travel-element {
          display: ${isMobile ? 'none' : 'flex'} !important;
        }
      `}</style>
      </>
  );
};

const styles = {
  banner: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100%',
    width: '50px',
    backgroundColor: '#ffcc00',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    transition: 'all 0.3s ease',
  },
  text: {
    writingMode: 'vertical-rl',
    textOrientation: 'mixed',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
};

export default MaintenanceBanner;