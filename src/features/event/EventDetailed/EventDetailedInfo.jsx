import React from 'react';
import { Segment, Grid, Icon } from 'semantic-ui-react';
import format from 'date-fns/format';


const EventDetailedInfo = ({event}) => {

  let EventDate;
  if(event.date){
    EventDate = event.date.toDate();
  }


  return (
       <Segment.Group>
          <Segment attached="top">
            <Grid>
              <Grid.Column width={1}>
                <Icon size="large" color="teal" name="info" />
              </Grid.Column>
              <Grid.Column width={15}>
                <p>{event.description}</p>
              </Grid.Column>
            </Grid>
          </Segment>
          <Segment attached>
            <Grid verticalAlign="middle">
              <Grid.Column width={1}>
                <Icon name="calendar" size="large" color="teal" />
              </Grid.Column>
              <Grid.Column width={15}>
                <span>{format(EventDate, 'dddd Do MMM')} at {format(EventDate, 'h:mm A')}</span>
              </Grid.Column>
            </Grid>
          </Segment>
          <Segment attached>
            <Grid verticalAlign="middle">
              <Grid.Column width={1}>
                <Icon name="marker" size="large" color="teal" />
              </Grid.Column>
              <Grid.Column width={11}>
                <span>{event.venue}</span>
              </Grid.Column>
            </Grid>
          </Segment>
        </Segment.Group>
  )
}

export default EventDetailedInfo
