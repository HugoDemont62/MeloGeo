import { useState } from 'react';

const IntroPopup = () => {
    const [showPopup, setShowPopup] = useState(true); // La popup est affichée au départ

    return (
        <>
            {showPopup && (
                <div
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'white',
                        padding: '30px',
                        border: '1px solid #ddd',
                        zIndex: 1000,
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                        borderRadius: '12px',
                        textAlign: 'center',
                        maxWidth: '400px',
                        width: '90%',
                    }}
                >
                    <p style={{ color: '#333', fontSize: '18px', lineHeight: '1.6', marginBottom: '20px' }}>
                        <strong>Bienvenue !</strong> <br/>
                        <i>Cliquez sur la carte pour interagir.</i> <br/><br/>
                        <span>Double cliquez pour poser un marqueur.</span> <br/>
                        <span>Cliquez simplement pour voir la météo associée à l'endroit du clic.</span>
                    </p>
                    <button
                        onClick={() => setShowPopup(false)} // Masquer la popup au clic
                        style={{
                            marginTop: '10px',
                            padding: '12px 24px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '16px',
                        }}
                    >
                        OK
                    </button>
                </div>
            )}
        </>
    );
};

export default IntroPopup;