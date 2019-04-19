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