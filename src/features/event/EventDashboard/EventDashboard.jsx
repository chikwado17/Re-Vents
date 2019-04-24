import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { Grid } from 'semantic-ui-react';
import EventList from '../EventList/EventList';
import EventActivity from '../EventActivity/EventActivity';
import {  deleteEvent  } from '../../event/eventActions';
import LoadingComponent from '../../../app/layout/LoadingComponent';


//My HOC component for redux mapstate to props
const mapStateToProps = (state) => ({
  events:state.firestore.ordered.events,
})


 class EventDashboard extends Component {

//handling the deleting events
    handleDeleteEvent = (eventId) => () => {
      //redux
      this.props.dispatch(deleteEvent(eventId))
    }

  render() {
    const { events } = this.props;
    //checking if loading from our redux rootreducer async reducer, if it is true then load our loading component
    //checking if there is an object which is data in events if there is data then load before showing the page
    if(!isLoaded(events) || isEmpty(events)) return <LoadingComponent inverted={true}/>


    return ( 
        <Grid>
            <Grid.Column width={10}>
                {/* Passing eventsListData down to EventList component as events props            from redux map state to props */}
                <EventList deleteEvent={this.handleDeleteEvent} onEditEvent={this.handleEditEvent} events={events} />
            </Grid.Column>
      
            <Grid.Column width={6}>
              <EventActivity/>
            </Grid.Column>
        </Grid>
    )
  }
}

export default connect(mapStateToProps)(firestoreConnect([{ collection: 'events' }])(EventDashboard));