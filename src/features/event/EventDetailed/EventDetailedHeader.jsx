import React from 'react';
import { Segment, Image, Item, Button, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';

const eventImageStyle = {
    filter: 'brightness(30%)'
};

const eventImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

const EventDetailedHeader = ({event, isHost, isGoing, goingToEvent, cancelGoingToEvent}) => {

  let eventDate;
  if(event.date){
    eventDate = event.date.toDate();
  }

  return (
      <Segment.Group>
          <Segment basic attached="top" style={{ padding: '0' }}>
            <Image style={eventImageStyle} src={`/assets/categoryImages/${event.category}.jpg`} fluid />
              <Segment style={eventImageTextStyle} basic>
                <Item.Group>
                  <Item>
                    <Item.Content>
                      <Header
                        size="huge"
                        content={event.title}
                        style={{ color: 'white' }}
                      />
                      <p>{format(eventDate, 'dddd Do MMM')}</p>
                      <p>
                        Hosted by <strong>{event.hostedBy}</strong>
                      </p>
                    </Item.Content>
                  </Item>
                </Item.Group>
              </Segment>
            </Segment>
          <Segment attached="bottom">
            {!isHost && (
                <div>
                  {isGoing ? (
                    /* if the user is going show the cancel my place button */
                  <Button onClick={() => cancelGoingToEvent(event)}>Cancel My Place</Button>
                  ) : (
                    /* if the user is not going / attending event then show the join this event button */
                  <Button onClick={() => goingToEvent(event)} color="teal">JOIN THIS EVENT</Button>
                  )}
                </div>
            )}

              {isHost &&
                <Button as={Link} to={`/manage/${event.id}`} color="orange">
                  Manage Event
                </Button>
              }
  
          </Segment>
      </Segment.Group>
  )
}

export default EventDetailedHeader
