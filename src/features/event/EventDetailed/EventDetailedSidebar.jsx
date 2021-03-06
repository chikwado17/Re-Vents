import React from 'react';
import { Link } from 'react-router-dom';
import { Segment, List, Item, Label } from 'semantic-ui-react';

const EventDetailedSidebar = ({attendees}) => {
  const isHost = false;
  return (
       <div>
          <Segment
            textAlign="center"
            style={{ border: 'none' }}
            attached="top"
            secondary
            inverted
            color="teal"
          >
          {/* conditional rendering if the attendee is more than one person use person else use people */}
          {attendees && attendees.length} {attendees && attendees.length === 1 ? "Person" : "People"} Going
      
          </Segment>
          <Segment attached>
            <List relaxed divided>

              {/* looping through the attendees list then populate attendee that it is avaliable */}
              {attendees && attendees.map(attendee => (

                  <Item key={attendee.id} style={{ position: 'relative' }}>
                    {/* conditional rendering checking for the host of the event */}
                    {isHost &&
                    <Label
                      style={{ position: 'absolute' }}
                      color="orange"
                      ribbon="right"
                    >
                      Host
                    </Label>}

                    <Item.Image size="tiny" src={attendee.photoURL} />
                    <Item.Content verticalAlign="middle">
                      <Item.Header as="h3">
                        <Link to={`/profile/${attendee.id}`}>{attendee.displayName}</Link>
                      </Item.Header>
                    </Item.Content>
                  </Item>
              ))}
            </List>
          </Segment>
        </div>
  )
}

export default EventDetailedSidebar
