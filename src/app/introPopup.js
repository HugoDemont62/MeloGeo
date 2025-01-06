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
                        padding: '20px',
                        border: '1px solid black',
                        zIndex: 1000,
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        borderRadius: '10px',
                        textAlign: 'center',
                    }}
                >
                    <p>Bienvenue ! Cliquez sur la carte pour interagir.</p>
                    <button
                        onClick={() => setShowPopup(false)} // Masquer la popup au clic
                        style={{
                            marginTop: '10px',
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
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
