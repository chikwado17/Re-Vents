

//quering the firestore, getting the photos saved of firestore getting them out using firestoreConnect. using auth as a props to query firestore
export const userDetailedQuery = ({auth, userUid}) => {

    //quering to get the current user loged in to match the host of the event person else show the user the posted the event
    if(userUid !== null){
        return [
            {
                collection: 'users',
                doc: userUid,
                storeAs: 'profile'
            },
            {
                collection: 'users',
                doc: userUid,
                subcollections: [{collection: 'photos'}],
                storeAs: 'photos'
            }
        ]
    }else {

        return [
            {
                collection: 'users',
                doc: auth.uid,
                subcollections: [{collection: 'photos'}],
                storeAs:'photos'
            }
        ]

    }   
}