import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Action asynchrone pour récupérer les données SIREN
export const fetchSirenData = createAsyncThunk(
    'siren/fetchData',
    async (sirenNumber) => {
        const response = await fetch(`https://api.insee.fr/entreprises/sirene/V3/siren/${sirenNumber}`, {
            headers: {
                'Authorization': `Bearer 803c5229-02bc-3b23-a9d6-e77c07200349`
            }
        });
        const data = await response.json();
        console.log(data)
        return data;
    }
);

// Slice pour gérer l'état
const sirenSlice = createSlice({
    name: 'siren',
    initialState: {
        data: null,
        status: 'idle',
        error: null,
        isMairie: false,
        mairieName: null,
        isAssociation: false,
        associaionName: null
    },

    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSirenData.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchSirenData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
              console.log('succeed', state.data)
                const denomination = action.payload.uniteLegale.periodesUniteLegale[0].denominationUniteLegale || '';
                // const denominationAssociation = action.payload.uniteLegale.periodesUniteLegale[0].denominationUniteLegale || '';
                const identifiantAssociation = action.payload.uniteLegale.identifiantAssociationUniteLegale;
              
                if (denomination.includes('VILLE DE') || denomination.includes('MAIRIE DE') || denomination.includes('COMMUNE')) {
                  state.isMairie = true;
                  state.mairieName = denomination;
                } else if (identifiantAssociation) {
                  state.isMairie = false; // Assurez-vous de réinitialiser cette valeur
                  state.mairieName = null; // Assurez-vous de réinitialiser cette valeur
                  state.isAssociation = true;
                  state.associaionName = denomination;
                } else {
                  state.isMairie = false;
                  state.mairieName = null;
                  state.isAssociation = false;
                }
              })
            .addCase(fetchSirenData.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default sirenSlice.reducer;
