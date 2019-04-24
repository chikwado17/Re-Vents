import moment from 'moment';
import { toastr } from 'react-redux-toastr';
import cuid from 'cuid';
import { asyncStart, asyncFinish, asyncError } from '../async/asyncAction';

//react redux firebase update profile method for aboutpage and accountpage
export const updateProfile = (user) => {
    return async (dispatch, getState, {getFirebase}) => {

        const firebase = getFirebase();

        const { isLoaded, isEmpty, ...updatedUser } = user;

        if(updatedUser.dateOfBirth !== getState().firebase.profile.dateOfBirth){

            updatedUser.dateOfBirth = moment(updatedUser.dateOfBirth).toDate();
        }

        try{
            await firebase.updateProfile(updatedUser);
            toastr.success("Success","Profile updated");

        }catch(error){
            console.log(error);
        }

    }
}


//storing our images on firebase storage
export const uploadProfileImage = (file, fileName) => {
    return async (dispatch, getState, { getFirebase, getFirestore }) => {
            
        const imageName = cuid();
        const firebase = getFirebase();
        const firestore = getFirestore();
        const user = firebase.auth().currentUser;
        const path = `${user.uid}/user_images`;
        const options = {
            name: imageName
        }
        try{
            dispatch(asyncStart());
            //upload the file to firebase storage
            let uploadedFile = await firebase.uploadFile(path, file, null, options);

            // get url of image
            let downloadURL = await uploadedFile.uploadTaskSnapshot.downloadURL;

            // get userdoc
            let userDoc = await firestore.get(`users/${user.uid}`);
            
            // check if user has photo, if not update profile with new image
            if(!userDoc.data().photoURL){
                //update firestore userDoc
                await firebase.updateProfile({
                    photoURL: downloadURL
                });

                    //update profile inside the firebase authentication
                await user.updateProfile({
                    photoURL: downloadURL
                }); 

            }  

            //add the new photo to photos collection
            await firestore.add({
                collection:'users',
                doc: user.uid,
                subcollections: [{collection: 'photos'}]
            }, {
               name:imageName,
               url:downloadURL 
            })
            dispatch(asyncFinish());
        }catch(error){
            console.log(error);
            dispatch(asyncError());
            throw new Error("Problem uploading photo");
        }

    }
}


//deleting photo from firebase storage
export const deletePhoto = (photo) => {
    return async (dispatch, getState, { getFirebase, getFirestore }) => {
        const firebase = getFirebase();
        const firestore = getFirestore();
        const user = firebase.auth().currentUser;

        try {
            await firebase.deleteFile(`${user.uid}/user_images/${photo.name}`);
            await firestore.delete({
                collection:'users',
                doc:user.uid,
                subcollections: [{ collection: 'photos', doc: photo.id }]
            })
        }catch(error){
            console.log(error);
            throw new Error('Problem deleting the photo');
        }

    }
}

export const setMainPhoto = (photo) => {
    return async (dispatch, getState, {getFirebase}) => {

        const firebase = getFirebase();

        try{
            return await firebase.updateProfile({
                photoURL: photo.url
            })
        }catch(error){
            console.log(error);
            throw new Error("Problem setting main photo");
        }
    }
}

//for users which are going for an event
export const goingToEvent = (event) => {
    return async (dispatch, getState, {getFirestore}) => {
        const firestore = getFirestore();
        const user = firestore.auth().currentUser;
        const photoURL = getState().firebase.profile.photoURL;
        const attendee = {
            going: true,
            joinDate: Date.now(),
            photoURL: photoURL || '/assets/user.png',
            displayName: user.displayName,
            host:false
        }

        try{
            await firestore.update(`events/${event.id}`, {
                //  [`attendees.${user.uid}`] this will be our object key, into our existing object map with is attendees
                [`attendees.${user.uid}`] : attendee
            })
            await firestore.set(`event_attendee/${event.id}_${user.uid}`, {
                eventId: event.id,
                userUid: user.uid,
                eventDate: event.date,
                host: false
            })
            toastr.success('Success', 'You have signed in to the Event');
        }catch(error){
            console.log(error);
            toastr.error('Oops!', 'Problem signing up to event');
        }
    }
}


//for your that wants to cancel event going
export const cancelGoingToEvent = (event) => {
    return async (dispatch, getState, { getFirestore }) => {
        const firestore = getFirestore();
        const user = firestore.auth().currentUser;

        try{
            await firestore.update(`events/${event.id}`, {
                //deleting a field in firestore
                [`attendees.${user.uid}`]: firestore.FieldValue.delete()
            })
            await firestore.delete(`event_attendee/${event.id}_${user.uid}`);
            toastr.success('Success', 'You have removed yourself from the Event.');
        }catch(error){
            console.log(error);
            toastr.error('Oops!','Something went wrong');
        }
    }
}