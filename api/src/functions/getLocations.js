const { app } = require('@azure/functions');
const {db} = require('./firebaseDB');

app.http('getLocations', {
    route: "main/locations",
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {

        try {
            const snapshot = await db.collection('Main Locations').get();
        
            let data = [];
            snapshot.forEach((doc) => {
              data.push({ id: doc.id, ...doc.data() });
            });
            return { body: JSON.stringify(data) };
          } catch (error) {
            return { message: 'Error fetching data', error };
          }
    }
});
