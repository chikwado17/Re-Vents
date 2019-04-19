import { SubmissionError, reset } from 'redux-form';
import { toastr } from 'react-redux-toastr';
import { closeModal } from '../modals/modalActions';


//email and password authentication with firebase
export const login = (creds) => {
    //a call to dispatch from redux thunk
   return async (dispatch, getState, { getFirebase }) => { 
       const firebase = getFirebase();
        try {
            await firebase.auth().signInWithEmailAndPassword(creds.email, creds.password);
            dispatch(closeModal());
        }catch(error){
            console.log(error);
            //pass to loginForm to have access to the error message from SubmissionError
            throw new SubmissionError({
                _error: error.message
            })
        }
       
   }
}

//social login authentication step 2 pass down to login form and down again to socialLogin Component
export const socialLogin = (selectedProvider) => {
    return async (dispatch, getState, { getFirebase, getFirestore }) => {

        const firebase = getFirebase();
        const firestore = getFirestore();

        try{
            dispatch(closeModal());
        let user = await firebase.login({
                provider:selectedProvider,
                type:'popup'
            })

          if(user.additionalUserInfo.isNewUser){
            await firestore.set(`users/${user.user.uid}`, {
                displayName: user.profile.displayName,
                photoURL: user.profile.avatarUrl,
                createdAt: firestore.FieldValue.serverTimestamp()
            })
          }

        }catch(error){
            console.log(error);
        }

    }
}

//registering new users with email and password 
export const registerUser = (user) => {
    return async (dispatch, getState, { getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        const firestore = getFirestore();

        try{
            dispatch(closeModal());
            //creating a new user
            let createdUser = await firebase.auth().createUserWithEmailAndPassword(user.email,user.password);

            //updating the users profile
            await createdUser.updateProfile({
                displayName: user.displayName
            });

            //store the user to firestore
            let newUser = {
                displayName: user.displayName,
                createdAt:firestore.FieldValue.serverTimestamp()
            }

            await firestore.set(`users/${createdUser.uid}`,{...newUser})

            

        }catch(error){

            console.log(error);
             //pass to loginForm to have access to the error message from SubmissionError
             throw new SubmissionError({
                _error: error.message
            })
        }
    }
}

//updating users password
export const updatePassword = (creds) => {
    return async (dispatch, getState, { getFirebase }) => {
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;

        try{
            await user.updatePassword(creds.newPassword1);
            //the account is the form name from accountpage component
            await dispatch(reset('account'));
            toastr.success('Success', "Your Password has been updated!!!");
        }catch(error){
            throw new SubmissionError({
                _error: error.message
            })
        }
    }
}
