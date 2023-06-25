import React from 'react';
// import './LoadingPage.css';

// Remplacer par votre URL d'icône de patte de chat ou le chemin de votre icône
// const catPawUrl = 'https://example.com/cat_paw.png';
import catPawUrl from '../../assets/icon-paw.png';

const LoadingPage = () => {
    return (
        <div className="loading-wrapper">

            <div className="loading-wrapper-column">
                <div className="loading-wrapper-column-title">
                    <h2 style={{ textAlign: 'center' }}>Kappze</h2>
                </div>
                <div className="loading-wrapper-column-paws">
                    <div className="paw" style={{ backgroundImage: `url(${catPawUrl})` }} />
                    <div className="paw" style={{ backgroundImage: `url(${catPawUrl})` }} />
                    <div className="paw" style={{ backgroundImage: `url(${catPawUrl})` }} />

                </div>
            </div>

        </div>
    );
};

export default LoadingPage;
