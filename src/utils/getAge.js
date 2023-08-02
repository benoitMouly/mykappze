export const calculateAge = (birthdate, selectedDate = new Date()) => {
    const birth = new Date(birthdate);
    const selected = new Date(selectedDate);

    let years = selected.getFullYear() - birth.getFullYear();
    let months = selected.getMonth() - birth.getMonth();

    if (months < 0 || (months === 0 && selected.getDate() < birth.getDate())) {
        years--;
        months = months + 12;
    }

    if (selected.getDate() < birth.getDate()){
        months--;
    }

    let result = '';
    if (years > 0) result += `${years} an${years > 1 ? 's' : ''}`;
    if (years > 0 && months > 0) result += ' et ';
    if (months > 0) result += `${months} mois`;

    return result;
}
