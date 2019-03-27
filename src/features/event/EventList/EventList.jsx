import React, { Component } from 'react';
import EventListItem from './EventLisItem';

class EventList extends Component {
  render() {

    //destructuring events props
    const {events} = this.props;

    return (
      <div>
        <h1>Event List</h1>
        {/* looping through the events props to get the datas */}
        {events.map((event) => (
          //passing the event data from the loop as a props to EventListItem
          <EventListItem key={event.id} event={event} />

        ))} 
      </div>
    )
  }
}

export default EventList;