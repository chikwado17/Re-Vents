import React, { Component } from 'react';
import { Segment, Item, Button, Icon, List , Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import EventListAttendee from './EventListAttendee'; 
import format from 'date-fns/format';
import { objectToArray } from '../../../app/common/utils/helpers';


class EventListItem extends Component {
  render() {
      //passing down to get datas
      const { event } = this.props;
     
    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size="tiny" circular src={event.hostPhotoURL} />
                        <Item.Content>
                            <Item.Header as={Link} to={`/event/${event.id}`}>{event.title}</Item.Header>
                            <Item.Description>
                            Hosted by <Link to={`/profile/${event.hostUid}`}>{event.hostedBy}</Link>
                            </Item.Description>
                            {event.cancelled &&
                            <Label style={{top: '-40px'}} ribbon='right' color='red' content='this event has been cancelled'/> }
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name="clock" /> {format(event.date.toDate(), 'dddd Do MMM')} at {format(event.date.toDate(), 'HH:mm')}  |
                    <Icon name="marker" /> {event.venue}, {event.city}
                </span>
            </Segment>
            <Segment secondary>
                <List horizontal>
                    {/* if there is attendee use the one avaliable else also use the one avaliable */}
                    {event.attendees && objectToArray(event.attendees).map((attendee) => (
                        //passing down the attendees data as a props to EvenaListAttendee component after looping.
                        <EventListAttendee key={attendee.id} attendee={attendee}/>
                     ))} 
                </List>
            </Segment>
            <Segment clearing>
                <span>{event.description}</span>
                {/* <Button onClick={deleteEvent(event.id)} as="a" color="red" floated="right" content="Delete" /> */}
                                        {/* A method to select our event for edit, after this pass selectedEvent as a props to EventDashboard down to EventForm*/}
                <Button as={Link} to={`/event/${event.id}`} color="teal" floated="right" content="View" />
                
            </Segment>
        </Segment.Group>
    )
  }
}

export default EventListItem;