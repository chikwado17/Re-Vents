import React, { Component } from 'react'
import { Segment, Item, Button, Icon, List } from 'semantic-ui-react';
import EventListAttendee from '../EventList/EventListAttendee'; 


class EventLisItem extends Component {
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
                            <Item.Header as="a">{event.title}</Item.Header>
                            <Item.Description>
                            Hosted by <a>{event.hostedBy}</a>
                            </Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name="clock" /> {event.date} |
                    <Icon name="marker" /> {event.venue}
                </span>
            </Segment>
            <Segment secondary>
                <List horizontal>
                    {event.attendees.map((attendee) => (
                        //passing down the attendees data as a props to EvenaListAttendee component after looping.
                        <EventListAttendee key={attendee.id} attendee={attendee}/>
                     ))} 
                </List>
            </Segment>
            <Segment clearing>
                <span>{event.description}</span>
                <Button as="a" color="teal" floated="right" content="View" />
            </Segment>
        </Segment.Group>
    )
  }
}

export default EventLisItem;