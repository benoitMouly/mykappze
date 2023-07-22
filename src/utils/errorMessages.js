export const getErrorMsg = (errorCode) => {

    // console.log('ERROR CODE : ')
    // console.log(errorCode)
    switch (errorCode) {
        case 'auth/user-not-found':
            return 'L\'utilisateur n\'existe pas';
        case 'auth/invalid-email':
            return 'Email invalide';
        case 'auth/email-already-in-use':
            return 'Email déjà utilisé par un utilisateur';
        case 'auth/wrong-password':
            return 'Mot de passe incorrect'
        case 'auth/weak-password':
            return 'Mot de passe trop faible';
        default:
            return 'Une erreur s\'est produite lors de la connexion. Veuillez réessayer.';
    }
};


export const validateString = (str) => {
    const errors = {};

    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ-]+$/; // Les caractères alphabétiques uniquement (y compris les accents et les tirets)
    if (!nameRegex.test(str)) {
        errors.str = "Veuillez rentrer une donnée valide.";
    }

    return errors;
}

export const validatePassword = (password) => {
    const errors = {};
    const passwordRegex = /^.{6,20}$/;
    if (!passwordRegex.test(password)) {
        errors.password = "Le mot de passe doit contenir entre 8 et 20 caractères.";
    }

    return errors;
}
export const validatePhoneNumber = (phoneNumber) => {
    const errors = {};
    const phoneNumberRegex = /^0[1-9]\d{8}$/; // Format "06 90 97 90 90"
    // Validation du numéro de téléphone
    if (!phoneNumberRegex.test(phoneNumber)) {
        errors.phoneNumber = "Le numéro de téléphone est invalide. Format désiré : 0634321254";
    }

    return errors;
}

export const validateEmail = (email, err) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Vérification du format d'email
    // Validation de l'email
    if (!emailRegex.test(email)) {
        errors.email = "L'email invalide. Format désiré : johndoe@domain.com";
    }
    // console.log(errors)
    err = errors;
    return err;
}



export const validateIdAssociation = (str) => {
    const errors = {};
    const stringRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ-]+$/; // Les caractères alphabétiques uniquement (y compris les accents et les tirets)
    if (!stringRegex.test(str)) {
        errors.str = "Veuillez rentrer une donnée valide.";
    }

    return errors;
}

export const validateImage = (image) => {
    const errors = {};
    const allowedExtensions = ['png', 'jpg', 'jpeg'];
    const fileExtension = image ? image.name.split('.').pop().toLowerCase() : '';
    if (!allowedExtensions.includes(fileExtension)) {
        errors.imageStr = "Impossible de charger la photo. Formats autorisés : png/jpg/jpeg.";
    }

    return errors;
}

// export const validate