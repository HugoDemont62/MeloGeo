import React from 'react';

const MaintenanceBanner = () => {
  return (
    <div style={styles.banner} id="maintenance-banner">
      <p style={styles.text} className="banner-text">⚠️ Site en cours de travail ⚠️</p>
    </div>
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

// Media queries for responsiveness
const applyMobileStyles = () => {
  const banner = document.getElementById('maintenance-banner');
  const text = document.querySelector('.banner-text');
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    banner.style.width = '100%';
    banner.style.height = '50px';
    text.style.writingMode = 'horizontal-tb';
    text.style.fontSize = '12px';
  } else {
    banner.style.width = '50px';
    banner.style.height = '100%';
    text.style.writingMode = 'vertical-rl';
    text.style.fontSize = '14px';
  }
};

// Attach the event listener for window resizing
window.addEventListener('resize', applyMobileStyles);
window.addEventListener('load', applyMobileStyles);

export default MaintenanceBanner;
