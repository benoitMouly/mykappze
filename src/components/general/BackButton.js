import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const BackButton = (bg) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isUserProfilePage = location.pathname === '/user-profile';
    const isHomePage = location.pathname === '/';

    const goBack = () => {
        navigate(-1);
    };

    if (isHomePage) {
        return null; // Masquer le bouton sur les pages spécifiées
    }

    return (
        <div className="return-div" style={{backgroundColor: bg.needsBackground === true ?  'darkslategrey' : 'none'}}>
        <button onClick={goBack}>
            <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '8px' }} />
            Retour
        </button>
        </div>

    );
};

export default BackButton;
