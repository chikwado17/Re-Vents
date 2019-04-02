import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import EventList from '../EventList/EventList';
import {  deleteEvent  } from '../../event/eventActions';


//My HOC component for redux mapstate to props
const mapStateToProps = (state) => ({
  events:state.events
})


 class EventDashboard extends Component {

//handling the deleting events
    handleDeleteEvent = (eventId) => () => {
      //redux
      this.props.dispatch(deleteEvent(eventId))
    }

  render() {
    const { events } = this.props;
    return ( 
        <Grid>
            <Grid.Column width={10}>
                {/* Passing eventsListData down to EventList component as events props            from redux map state to props */}
                <EventList deleteEvent={this.handleDeleteEvent} onEditEvent={this.handleEditEvent} events={events} />
            </Grid.Column>
      
            <Grid.Column width={6}>
                
            </Grid.Column>
        </Grid>
    )
  }
}

export default connect(mapStateToProps)(EventDashboard);