import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFirestore, collection, where, doc, query, getDocs, addDoc, getDoc, deleteDoc, writeBatch, updateDoc, arrayUnion } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/*
* Retrieve animals by Association
***    
*/

export const fetchAnimalsByAssociation = createAsyncThunk('animals/fetchAnimalsByAssociation', async (associationId) => {
    const db = getFirestore();
    const q = query(collection(db, 'animals'), where('associationId', '==', associationId));
    const querySnapshot = await getDocs(q);
    const animalsData = [];
    querySnapshot.forEach((doc) => {
        animalsData.push({ id: doc.id, ...doc.data() });
    });
    return animalsData;
});


/*
* Retrieve animal by ID
***    
*/

export const fetchAnimalById = createAsyncThunk('animals/fetchAnimalById', async (animalId) => {
    const db = getFirestore();
    const animalRef = doc(collection(db, 'animals'), animalId);
    const animalSnapshot = await getDoc(animalRef);
    return { id: animalSnapshot.id, ...animalSnapshot.data() };
});

/*
* Retrieve mother by ID
***    
*/

export const fetchMotherById = createAsyncThunk('animals/fetchMotherById', async (motherId, { rejectWithValue }) => {

    try {
        const db = getFirestore();
        const animalRef = doc(collection(db, 'animals'), motherId);
        const animalSnapshot = await getDoc(animalRef);
        return { id: animalSnapshot.id, ...animalSnapshot.data() };
    } catch (error) {
        return rejectWithValue(error.message);
    }

});


/*
* Retrieve animals by mother ID
***
*/

export const fetchAnimalsByMother = createAsyncThunk('animals/fetchAnimalsByMother', async (motherId) => {
    const db = getFirestore();
    const q = query(collection(db, 'animals'), where('motherAppId', '==', motherId));
    const querySnapshot = await getDocs(q);
    const animalsData = [];
    querySnapshot.forEach((doc) => {
        animalsData.push({ id: doc.id, ...doc.data() });
    });
    return animalsData;
});


/*
* Retrieve animals by City
***    
*/

export const fetchAnimalsByCity = createAsyncThunk('animals/fetchAnimalsByCity', async (cityId) => {
    const db = getFirestore();
    const q = query(collection(db, 'animals'), where('cityId', '==', cityId));
    const querySnapshot = await getDocs(q);
    const animalsData = [];
    querySnapshot.forEach((doc) => {
        animalsData.push({ id: doc.id, ...doc.data() });
    });
    return animalsData;
});

/*
* Retrieve animals by Sector
***    
*/

export const fetchAnimalsBySector = createAsyncThunk('animals/fetchAnimalsBySector', async (sectorId) => {
    const db = getFirestore();
    const q = query(collection(db, 'animals'), where('sectorId', '==', sectorId));
    const querySnapshot = await getDocs(q);
    const animalsData = [];
    querySnapshot.forEach((doc) => {
        animalsData.push({ id: doc.id, ...doc.data() });
    });
    return animalsData;
});



/*
* Add new animal
***    
*/


export const addAnimal = createAsyncThunk(
    'animals/addAnimal',
    async (animalData, { rejectWithValue }) => {
        try {
            const db = getFirestore();
            const animalRef = collection(db, 'animals');
            const newAnimalRef = await addDoc(animalRef, animalData);
            const newAnimalSnapshot = await getDoc(newAnimalRef);
            const newAnimal = { id: newAnimalRef.id, ...newAnimalSnapshot.data() };
            return newAnimal;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);



/*
* Update animal sector name
***    
*/

export const updateAnimalSectorName = createAsyncThunk(
    'animals/updateAnimalSectorName',
    async ({ sectorId, newSectorName }, { rejectWithValue }) => {
        try {
            const db = getFirestore();
            const q = query(collection(db, 'animals'), where('sectorId', '==', sectorId));
            const querySnapshot = await getDocs(q);

            const batch = writeBatch(db);
            querySnapshot.forEach((animalDoc) => {
                const animalRef = doc(db, 'animals', animalDoc.id);
                batch.update(animalRef, { sectorName: newSectorName });
            });
            await batch.commit();

            // Return the payload
            return { sectorId, newSectorName };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/*
* Update animal sector name
***    
*/

export const updateAnimalCityName = createAsyncThunk(
    'animals/updateAnimalCityName',
    async ({ cityId, newCityName }, { rejectWithValue }) => {
        try {
            const db = getFirestore();
            const q = query(collection(db, 'animals'), where('cityId', '==', cityId));
            const querySnapshot = await getDocs(q);

            const batch = writeBatch(db);
            querySnapshot.forEach((animalDoc) => {
                const animalRef = doc(db, 'animals', animalDoc.id);
                batch.update(animalRef, { cityName: newCityName });
            });
            await batch.commit();

            // Return the payload
            return { cityId, newCityName };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/*
* Remove animal sector
***    
*/

export const removeSectorFromAnimals = createAsyncThunk(
    'animals/removeSectorFromAnimals',
    async ({ sectorId, cityId }, { rejectWithValue }) => {
        try {
            const db = getFirestore();
            const q = query(
                collection(db, 'animals'),
                where('sectorId', '==', sectorId),
                where('cityId', '==', cityId)
            );
            const querySnapshot = await getDocs(q);

            const batch = writeBatch(db);
            querySnapshot.forEach((animalDoc) => {
                const animalRef = doc(db, 'animals', animalDoc.id);
                batch.update(animalRef, { sectorId: '', sectorName: '' });
            });
            await batch.commit();

            // Return the sectorId
            return sectorId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

/*
* Remove animal city
***    
*/

export const removeCityFromAnimals = createAsyncThunk(
    'animals/removeCityFromAnimals',
    async (cityId, { rejectWithValue }) => {
        try {
            const db = getFirestore();
            const q = query(collection(db, 'animals'), where('cityId', '==', cityId));
            const querySnapshot = await getDocs(q);

            const batch = writeBatch(db);
            querySnapshot.forEach((animalDoc) => {
                const animalRef = doc(db, 'animals', animalDoc.id);
                batch.update(animalRef, { cityId: '', cityName: '' });
            });
            await batch.commit();

            // Return the sectorId
            return cityId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


/*
* Add animal profile image
***    
*/


export const uploadImage = async (image) => {
    try {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(storageRef, image);
        const imageUrl = await getDownloadURL(storageRef);
        return imageUrl;
    } catch (error) {
        throw new Error(`Une erreur s'est produite lors du téléchargement de l'image : ${error.message}`);
    }
};

/*
* Update animal image
***
*/

export const updateAnimalImage = createAsyncThunk(
    'animals/updateAnimalImage',
    async ({ animalId, image }, { rejectWithValue }) => {
        try {
            const imageUrl = await uploadImage(image);

            const db = getFirestore();
            const animalRef = doc(db, 'animals', animalId);
            await updateDoc(animalRef, { image: imageUrl });

            return { animalId, imageUrl };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


/*
* Add animal pdf
***    
*/

// export const uploadFile = async (file) => {
//     try {
//         const storage = getStorage();
//         const storageRef = ref(storage, `files/${file.name}`);
//         await uploadBytes(storageRef, file);
//         const fileUrl = await getDownloadURL(storageRef);
//         return {
//             name: file.name,
//             url: fileUrl
//         }

//     } catch (error) {
//         throw new Error(`Une erreur s'est produite lors du téléchargement du fichier : ${error.message}`);
//     }
// };

export const addDocumentToAnimal = createAsyncThunk(
    'animals/addDocumentToAnimal',
    async ({ animalId, documents }, thunkAPI) => {
        try {
            // Assuming you have a Firestore reference to your animals collection
            const db = getFirestore();
            const animalRef = doc(db, 'animals', animalId);
            await updateDoc(animalRef, { documents: arrayUnion(...documents) });
            return animalId;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
export const uploadFile = createAsyncThunk(
    'animals/uploadFile',
    async (file, thunkAPI) => {
        try {
            const storage = getStorage();
            const storageRef = ref(storage, `files/${file.name}`);
            await uploadBytes(storageRef, file);
            const fileUrl = await getDownloadURL(storageRef);
            return {
                name: file.name,
                url: fileUrl
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


export const uploadDocumentsAndUpdateAnimal = createAsyncThunk(
    'animals/uploadDocumentsAndUpdateAnimal',
    async ({ animalId, documents }, thunkAPI) => {
        try {
            // Map each document to a Promise that will resolve to an object {name, url}
            const uploadPromises = documents.map((doc) => thunkAPI.dispatch(uploadFile(doc)));
            // console.log(uploadPromises);
            // Wait for all uploads to complete

            const uploadedDocuments = await Promise.all(uploadPromises);

            // Add the uploaded documents to the animal
            await thunkAPI.dispatch(addDocumentToAnimal({ animalId, documents: uploadedDocuments }));

            return uploadedDocuments;
        } catch (error) {
            // console.log(error)
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


export const uploadSingleFile = async (file) => {
    try {
        const storage = getStorage();
        const storageRef = ref(storage, `files/${file.name}`);
        await uploadBytes(storageRef, file);
        const fileUrl = await getDownloadURL(storageRef);
        return {
            name: file.name,
            url: fileUrl
        };
    } catch (error) {
        throw new Error(error.message);
    }
};




/*
* Delete file
***    
*/

export const deleteFileFromStorage = createAsyncThunk(
    'animals/deleteFileFromStorage',
    async (fileName, thunkAPI) => {
        try {
            const storage = getStorage();
            const fileRef = ref(storage, `files/${fileName}`);
            await deleteObject(fileRef);
            return fileName;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const deleteDocumentFromAnimal = createAsyncThunk(
    'animals/deleteDocumentFromAnimal',
    async (payload, thunkAPI) => {
        try {
            const { animalId, documentName } = payload;
            const animals = thunkAPI.getState().animals;
            const animal = animals.data.find(a => a.id === animalId);

            if (!animal) {
                throw new Error('Animal not found');
            }

            // Create a new copy of the animal and modify the copy
            const animalData = {
                ...animal,
                documents: animal.documents.filter(singleDocument => singleDocument.name !== documentName),
            };
            
            
            // Here you should persist the changes in your backend as well
            // For example, by calling a function like `updateAnimal(animalId, animal)`
            const updatePayload = {
                animalId: animalId,
                animalData: animalData
            };

            await thunkAPI.dispatch(updateAnimal(updatePayload));            console.log("After update:", animalData);
            
            return { animalId: animalId, documentName: documentName }; // Returning updated animal's id and documentName
        } catch (error) {
            console.log(error)
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);



/*
* Update animal informations
***    
*/

export const updateAnimal = createAsyncThunk(
    'animals/updateAnimal',
    async ({ animalId, animalData }, { rejectWithValue }) => {

        try {
            const db = getFirestore();
            const animalRef = doc(db, 'animals', animalId);
            await updateDoc(animalRef, animalData);
            return { animalId, animalData };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);




export const deleteAnimal = createAsyncThunk(
    'animals/deleteAnimal',
    async (animalId, { rejectWithValue }) => {
        try {
            const db = getFirestore();
            const animalRef = doc(db, 'animals', animalId);
            await deleteDoc(animalRef);
            return animalId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


/*
* * * Animal Slice
***    
*/

const animalsSlice = createSlice({
    name: 'animals',
    initialState: {
        status: 'idle',
        data: [],
        selectedAnimal: null,
        motherAnimal: null,
        motherAnimalsList: null,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAnimalsByCity.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAnimalsByCity.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchAnimalsByCity.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(fetchAnimalsBySector.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAnimalsBySector.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchAnimalsBySector.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(fetchAnimalsByAssociation.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAnimalsByAssociation.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload;
            })
            .addCase(fetchAnimalsByAssociation.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(fetchAnimalById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAnimalById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedAnimal = action.payload;
            })
            .addCase(fetchAnimalById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(fetchMotherById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMotherById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.motherAnimal = action.payload;
            })
            .addCase(fetchMotherById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(fetchAnimalsByMother.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAnimalsByMother.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.motherAnimalsList = action.payload;
            })
            .addCase(fetchAnimalsByMother.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
                // state.motherAnimal = '';
            })

            .addCase(addAnimal.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addAnimal.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data.push(action.payload);
                // addDocumentToAnimal(action.payload.id, action.payload.documents)
                // console.log('OUAI LE PAYLOAD')
                // console.log(action.payload)
            })
            .addCase(addAnimal.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            .addCase(updateAnimalSectorName.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateAnimalSectorName.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = state.data.map((animal) => {
                    if (animal.sectorId === action.payload.sectorId) {
                        return { ...animal, sectorName: action.payload.newSectorName };
                    }
                    return animal;
                });
            })
            .addCase(updateAnimalSectorName.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(removeSectorFromAnimals.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = state.data.map((animal) => {
                    if (animal.sectorId === action.payload) {
                        return { ...animal, sectorId: '' };
                    }
                    return animal;
                });
            })
            .addCase(updateAnimalCityName.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateAnimalCityName.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = state.data.map((animal) => {
                    if (animal.cityId === action.payload.cityId) {
                        return { ...animal, cityName: action.payload.newCityName };
                    }
                    return animal;
                });
            })
            .addCase(updateAnimalCityName.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(removeCityFromAnimals.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = state.data.map((animal) => {
                    if (animal.cityId === action.payload) {
                        return { ...animal, cityId: '' };
                    }
                    return animal;
                });
            })
            .addCase(deleteAnimal.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteAnimal.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = state.data.filter((animal) => animal.id !== action.payload);
            })
            .addCase(deleteAnimal.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateAnimal.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateAnimal.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = state.data.map((animal) => {
                    if (animal.id === action.payload.animalId) {
                        return { ...animal, ...action.payload.animalData };
                    }
                    return animal;
                });
                if (state.selectedAnimal && state.selectedAnimal.id === action.payload.animalId) {
                    state.selectedAnimal = { ...state.selectedAnimal, ...action.payload.animalData };
                }
            })
            .addCase(updateAnimal.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateAnimalImage.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateAnimalImage.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const { animalId, imageUrl } = action.payload;
                const animal = state.data.find((animal) => animal.id === animalId);
                if (animal) {
                    animal.image = imageUrl;
                }
                if (state.selectedAnimal && state.selectedAnimal.id === animalId) {
                    state.selectedAnimal.image = imageUrl;
                }
            })
            .addCase(updateAnimalImage.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(deleteFileFromStorage.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteFileFromStorage.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // supprimer l'entrée correspondante de documents dans le state
                state.selectedAnimal.documents = state.selectedAnimal.documents.filter(document => document.name !== action.payload);
            })
            .addCase(deleteFileFromStorage.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(deleteDocumentFromAnimal.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteDocumentFromAnimal.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = state.data.map((animal) => {
                    if (animal.id === action.payload.animalId) {
                        const newDocuments = animal.documents.filter(document => {
                            return document.name !== action.payload.documentName
                        });
                        animal.documents = newDocuments;
                        return {
                            ...animal
                        };
                    }
                    return animal;
                });
            })
            
            

            .addCase(deleteDocumentFromAnimal.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(uploadDocumentsAndUpdateAnimal.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })







        // .addCase(uploadFile.pending, (state) => {
        //     state.status = 'loading';
        // })
        // .addCase(uploadFile.fulfilled, (state, action) => {
        //     state.status = 'succeeded';
        //     state.data = state.data.map((animal) => {
        //         if (animal.id === action.payload.animalId) {
        //             return {
        //                 ...animal,
        //                 documents: animal.documents.filter(document => document.name !== action.payload.documentName),
        //             };
        //         }
        //         return animal;
        //     });
        // })
        // .addCase(uploadFile.rejected, (state, action) => {
        //     state.status = 'failed';
        //     state.error = action.payload;
        // })




    },
});

export default animalsSlice.reducer;
