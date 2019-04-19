import { toastr } from 'react-redux-toastr';
import { asyncStart, asyncFinish, asyncError } from '../async/asyncAction';
import { fetchSampleData } from '../../app/data/mockApi';

//to fetch event from mock API
export const fetchEvent = ({events} = {}) => {
    return {
        type: "FETCH_EVENT",
        events
    }
}

export const createEvent = (event) => {

    return async dispatch => {
        try{
            dispatch ({
                type: "CREATE_EVENT",
                event
            })
            toastr.success("SUCCESSFULL","New Event Created!");
        }catch(error){
            toastr.error("Oops!, something went wrong somewhere");
        }   
    }
}

  

export const updateEvent = (event) => {


    return async dispatch => {
        try{
            dispatch ({
                type: "UPDATE_EVENT",
                event
            })
            toastr.success("SUCCESS!","New Event Updated!");
        }catch(error){
            toastr.error("Oops!, something went wrong somewhere");
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