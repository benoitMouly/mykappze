export const getFilteredAnimals = (animals, selectedCity, selectedSector, selectedColor, filterByDisease, filterBySterilization, filterByIdentification, filterByOwner, filterBySex, filterByMom, filterByName) => {
    return animals.filter((animal) => {
        // Filtre par ville
        if (selectedCity && selectedCity !== 'Toutes' && animal.cityName !== selectedCity) {
            return false;
        }

        // Filtre par secteur
        if (selectedSector && selectedSector !== 'Tous' && animal.sectorName !== selectedSector) {
            return false;
        }

        // Filtre par couleur
        if (selectedColor && selectedColor !== 'Toutes' && !animal.colors.includes(selectedColor)) {
            return false;
        }
        // Filtre par maladie
        if (filterByDisease !== null && animal.isSick !== filterByDisease) {
            return false;
        }

        // Filtre par stérilisation
        if (filterBySterilization !== null && animal.isSterilise !== filterBySterilization) {
            return false;
        }

        // Filtre par identification
        if (filterByIdentification !== null && animal.hasIdNumber !== filterByIdentification) {
            return false;
        }

        // Filtre par propriétaire
        if (filterByOwner !== null && animal.isBelonged !== filterByOwner) {
            return false;
        }

        // Filtre par sexe
        if (filterBySex && filterBySex !== '-' &&  !animal.sex.toLowerCase().includes(filterBySex.toLowerCase())) {
            return false;
        }

        // Filtre par mère
        if (filterByMom !== null && animal.isMother !== filterByMom) {
            return false;
        }

        // Filtre par nom
        if (filterByName && !animal.name.toLowerCase().includes(filterByName.toLowerCase())) {
            return false;
        }

        return true;
    });
};
