import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFirestore, collection, doc, getDoc, query, where, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';


export const fetchAssociationUsers = createAsyncThunk(
    'associations/fetchAssociationUsers',
    async (associationId) => {
        const db = getFirestore();

        // Get the association data
        const associationRef = doc(db, 'associations', associationId);
        const associationSnapshot = await getDoc(associationRef);
        const associationData = associationSnapshot.data();

        // Get the users associated with this association
        const usersQuery = query(collection(db, 'userAssociations'), where('associationId', '==', associationId));
        const usersSnapshot = await getDocs(usersQuery);

        const usersData = [];
        for (const userDoc of usersSnapshot.docs) {
            const userAssociationData = userDoc.data();
            const userId = userAssociationData.userId;

            // Get the user's information from its reference
            const userRef = doc(db, 'users', userId);
            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
                const userData = { id: userId, ...userSnapshot.data() };

                // Check if the user is an admin
                let isAdmin = false;
                if (Array.isArray(associationData.role)) {
                    for (let role of associationData.role) {
                        if (role.uid === userId && role.isAdmin) {
                            isAdmin = true;
                            break;
                        }
                    }
                }
                userData.isAdmin = isAdmin;

                usersData.push(userData);
            }
        }

        return usersData;
    }
);


export const removeUserFromAssociation = createAsyncThunk(
    'associations/removeUserFromAssociation',
    async ({ userId, associationId }) => {
        const db = getFirestore();

        // Query to get the document ID of the user-association link
        const userAssociationQuery = query(collection(db, 'userAssociations'), where('userId', '==', userId), where('associationId', '==', associationId));
        const userAssociationSnapshot = await getDocs(userAssociationQuery);

        if (!userAssociationSnapshot.empty) {
            // Assuming there is only one document that matches the query
            const docId = userAssociationSnapshot.docs[0].id;

            // Delete the document
            await deleteDoc(doc(db, 'userAssociations', docId));
        } else {
            throw new Error('La liaison entre l\'utilisateur et l\'association n\'a pas été trouvée');
        }

        // Get the association document
        const associationRef = doc(db, 'associations', associationId);
        const associationSnap = await getDoc(associationRef);
        
        if (associationSnap.exists) {
            // Filter out the user from the roles array
            const associationData = associationSnap.data();
            const filteredRoles = associationData.role.filter(role => role.uid !== userId);

            // Update the association document with the filtered roles array
            await updateDoc(associationRef, { role: filteredRoles });
        } else {
            throw new Error('L\'association n\'a pas été trouvée');
        }
    }
);




const associationUsersSlice = createSlice({
    name: 'associationUsers',
    initialState: {
        status: 'idle',
        data: [],
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAssociationUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAssociationUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // console.log(state.data)
                state.data = action.payload;
            })
            .addCase(fetchAssociationUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default associationUsersSlice.reducer;
