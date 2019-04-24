import { toastr } from 'react-redux-toastr';
import { asyncStart, asyncFinish, asyncError } from '../async/asyncAction';
import { fetchSampleData } from '../../app/data/mockApi';
import { createNewEvent } from '../../app/common/utils/helpers';
import moment from 'moment';

//to fetch event from mock API
export const fetchEvent = ({events} = {}) => {
    return {
        type: "FETCH_EVENT",
        events
    }
}

//creating Event with firestore, storing our event data to firestore
export const createEvent = (event) => {

    return async (dispatch, getState, { getFirestore }) => {

        const firestore = getFirestore();
        const user = firestore.auth().currentUser;
        const photoURL = getState().firebase.profile.photoURL;
        //createNewEvent setup to firestore coming from ../../app/common/utils/helpers as export creatNewEvent
        let newEvent = createNewEvent(user, photoURL, event);

        try{
           
            let createdEvent = await firestore.add(`events`, newEvent);
            //for host, because they will be attending the event they are creating. so we have to store the current user at the attendees collection
            await firestore.set(`event_attendee/${createdEvent.id}_${user.uid}`,{
                eventId: createdEvent.id,
                userUid: user.uid,
                eventDate: event.date,
                host:true
            })

            toastr.success("SUCCESSFULL","New Event Created!");

        }catch(error){
            toastr.error("Oops!, something went wrong somewhere");
        }   
    }
}

  
//updating event from firestore
export const updateEvent = (event) => {

    return async (dispatch, getState, { getFirestore }) => {
        const firestore = getFirestore();
        if(event.date !== getState().firestore.ordered.events[0].date){
            event.date = moment(event.date).toDate();
        }
        try{
           await firestore.update(`events/${event.id}`, event);
            toastr.success("SUCCESS!","New Event Updated!");
        }catch(error){
            toastr.error("Oops!, something went wrong somewhere");
        }   
    }
}


//to cancel event from firestore.
export const cancelToggle = (cancelled, eventId) => {
    return async (dispatch, getState, { getFirestore}) => {
        const firestore = getFirestore();
        const message = cancelled ? 'Are you sure you want to cancel the event?' : 'This will reactivate the event - are you sure?';
        try{
            toastr.confirm(message, {
                onOk: () => firestore.update(`events/${eventId}`,{
                        cancelled: cancelled
                })
            });
         
        }catch(error){
            console.log(error);
        }
    }
}














export const deleteEvent = (eventId) => {
    return async dispatch => {
        try{
            dispatch ({
                type: "DELETE_EVENT",
                eventId
            })
            toastr.success("SUCCESS!","Event deleted!");
        }catch(error){
            toastr.error("Oops!, something went wrong somewhere");
        }   
    }
}


//redux thunk to fetch events from the mock api and load in our project 
export const loadEvents = () => {
    return async dispatch => {
        try{
            dispatch(asyncStart())

            let events = await fetchSampleData();

            dispatch(fetchEvent(events))

            dispatch(asyncFinish())

        }catch (error){
            console.log(error)
            dispatch(asyncError())
        }
    }
}