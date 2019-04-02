import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import EventDetailedHeader from './EventDetailedHeader';
import EventDetailedInfo from './EventDetailedInfo';
import EventDetailedChat from './EventDetailedChat';
import EventDetailedSiderbar from './EventDetailedSidebar';


//mapstate to props to retrive events by it's particular ID
const mapStateToProps = (state, ownProps) => {
    const eventId = ownProps.match.params.id;

    let event = {};

    if(eventId && state.events.length > 0){
        event = state.events.filter(event => event.id === eventId)[0];
    }

    return {
        event
    }
}

const EventDetailedPage = ({event}) => {
    return ( 
        <Grid>
            <Grid.Column width={10}>
                <EventDetailedHeader event={event}/>
                <EventDetailedInfo event={event}/>
                <EventDetailedChat/>
            </Grid.Column>
            <Grid.Column width={6}>
                <EventDetailedSiderbar attendees={event.attendees}/>
            </Grid.Column>
        </Grid>
     );
}   
 
export default connect(mapStateToProps)(EventDetailedPage);