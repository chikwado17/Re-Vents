import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirestore } from 'react-redux-firebase';
import { Grid } from 'semantic-ui-react';
import EventDetailedHeader from './EventDetailedHeader';
import EventDetailedInfo from './EventDetailedInfo';
import EventDetailedChat from './EventDetailedChat';
import EventDetailedSiderbar from './EventDetailedSidebar';
import { objectToArray } from '../../../app/common/utils/helpers';
import { goingToEvent, cancelGoingToEvent } from '../../user/userActions';


//mapstate to props to retrive events by it's particular ID in firestore matching with the id
const mapStateToProps = (state) => {
  
    let event = {};

    if(state.firestore.ordered.events && state.firestore.ordered.events[0]){
        event = state.firestore.ordered.events[0];
    }

    return {
        event,
        auth: state.firebase.auth
    }
}

const mapDispatchToProps = {
    goingToEvent,
    cancelGoingToEvent
}

class EventDetailedPage extends Component {

    //making our data avaliable to be accessed from firestore. then use state.firestore.ordered.events to get the data's
    async componentDidMount(){
        const { firestore, match} = this.props;
        await firestore.setListener(`events/${match.params.id}`)
    }

     //resetting setListener after use
     async componentWillUnMount(){
        const { firestore, match} = this.props;
        await firestore.unsetListener(`events/${match.params.id}`)
    }



    state = {  }
    render() { 
        const { event, auth , goingToEvent, cancelGoingToEvent } = this.props;
        //objectToArray coming from '../../../app/common/utils/helpers' that convert object to array with values and keys
        const attendees = event && event.attendees && objectToArray(event.attendees);

        //checking if the host matches event host id and the auth id of the host
        const isHost = event.hostUid === auth.uid;

        //checking if a user is attending an event with the users auth id
        const isGoing = attendees && attendees.some(a => a.id === auth.uid);

        return ( 
            <Grid>
                <Grid.Column width={10}>
                    <EventDetailedHeader 
                        event={event}
                        isHost={isHost} 
                        isGoing={isGoing} 
                        goingToEvent={goingToEvent}
                        cancelGoingToEvent={cancelGoingToEvent}
                     />
                    <EventDetailedInfo event={event}/>
                    <EventDetailedChat/>
                </Grid.Column>
                <Grid.Column width={6}>
                    <EventDetailedSiderbar attendees={attendees}/>
                </Grid.Column>
            </Grid>
         );
    }
}
 
 //using withFirestore to get access to firestore props that will help us to get data from firestore
export default withFirestore(connect(mapStateToProps,mapDispatchToProps)(EventDetailedPage));