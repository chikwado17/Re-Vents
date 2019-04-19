import React, { Component } from 'react';
import EventListItem from './EventListItem';

class EventList extends Component {
  render() {

    //destructuring events props
    const {events, deleteEvent} = this.props;

    return (
      <div>
        {/* looping through the events props to get the datas */}
        { events && events.map((event) => (
          //passing the event data from the loop as a props to EventListItem
          <EventListItem key={event.id} event={event}  deleteEvent={deleteEvent} />

        ))} 
      </div>
    )
  }
}

export default EventList;