/*global google*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { withFirestore } from 'react-redux-firebase';
import { composeValidators, combineValidators, isRequired, hasLengthGreaterThan } from 'revalidate';
import { Segment, Form, Button , Grid , Header} from 'semantic-ui-react'; 
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import Script from 'react-load-script';
import { createEvent, updateEvent, cancelToggle } from '../eventActions';
import TextInput from '../../../app/common/form/TextInput';
import TextArea from '../../../app/common/form/TextArea';
import SelectInput from '../../../app/common/form/SelectInput';
import DateInput from '../../../app/common/form/DateInput';
import PlaceInput from '../../../app/common/form/PlaceInput';


//mapstate to props to retrive / (view) events by it's particular ID
const mapStateToProps = (state) => {
    let event = {};

    if(state.firestore.ordered.events && state.firestore.ordered.events[0]){
        event = state.firestore.ordered.events[0];
    }

    return {
        //initialvalues is redux form props to populate data to form inputs from firestore
       initialValues:event,
       event
    }
}

//mapping event actions, not to call it with dispatch then the action
const mapDispatchToProps = {
    updateEvent,
    createEvent,
    cancelToggle
}

const category = [
    {key: 'drinks', text: 'Drinks', value: 'drinks'},
    {key: 'culture', text: 'Culture', value: 'culture'},
    {key: 'film', text: 'Film', value: 'film'},
    {key: 'food', text: 'Food', value: 'food'},
    {key: 'music', text: 'Music', value: 'music'},
    {key: 'travel', text: 'Travel', value: 'travel'},
];


//pass the validate down to reduxForm at export default line
const validate = combineValidators({
    title: isRequired({message: 'The event title is required'}),
    category: isRequired({message: 'Please provide a category'}),
    description: composeValidators(
        isRequired({ message: 'Please enter a description' }),
        hasLengthGreaterThan(4)({ message: 'Description needs to be at least 5 characters' }),
    )(),
    city:isRequired('city'),
    venue:isRequired('venue'),
    date:isRequired('date')
})



class EventForm extends Component {


    state = {
        cityLatLng: {},
        venueLatLng: {},
        scriptLoaded: false
    }


    //getting events from firestore then populate to manage event which is showing the initialValues from firestore
    //making our data avaliable to be accessed from firestore. then use state.firestore.ordered.events to get the data's
    async componentDidMount(){
    const { firestore, match } = this.props;
     await firestore.setListener(`events/${match.params.id}`);
    }

    //removing events after getting it firestore, changing the state of the setListener
    async componentWillUnmount(){
        const { firestore, match } = this.props;
        await firestore.unsetListener(`events/${match.params.id}`);
    }



    handleScriptLoaded = () => {
        this.setState({
            scriptLoaded: true
        })
    }

    handleCitySelect = (selectedCity) => {
        geocodeByAddress(selectedCity)
        .then(results => getLatLng(results[0]))
        .then(latlng => {
            this.setState({
                cityLatLng:latlng
            });
        })
        .then(() => {
            this.props.change('city', selectedCity)
        })
    }

    handleVenueSelect = (selectedVenue) => {
        geocodeByAddress(selectedVenue)
        .then(results => getLatLng(results[0]))
        .then(latlng => {
            this.setState({
                venueLatLng:latlng
            });
        })
        .then(() => {
            this.props.change('venue', selectedVenue)
        })
    }

    onFormSubmit = (values) => {
       
        //for venue input form field.
        values.venueLatLng = this.state.venueLatLng;
        //check if the selected list event matches the initial value selected ID then update it, this also shows the data of the initial form selected
        if(this.props.initialValues.id){

            this.props.updateEvent(values);
            this.props.history.goBack();

        }else{

            //createEvent will grap the whole data field and store in firestore
            this.props.createEvent(values);
            this.props.history.push('/events');
        }
    }

  render() {
        const { invalid, submitting, pristine, event, cancelToggle } = this.props;
    return (
        
        <Grid>
            <Script
            url="https://maps.googleapis.com/maps/api/js?key=AIzaSyC2g6dnrgufku9FR16xf1h93frUchAXBkM&libraries=places"
            onLoad={this.handleScriptLoaded}
                />
            <Grid.Column width={10}>
                <Segment>
                    {/* handleSubmit, is redux form promising method for form submition */}
                    <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
                        <Header sub color="teal" content="Event Details"/>
                            <Field name="title" type="text" component={TextInput} placeholder="Please Give Your Event A Name" />
                            <Field name="category" type="text" options={category} component={SelectInput} placeholder="what is your Event about?" />
                            <Field name="description" rows={3} type="text" component={TextArea} placeholder="Tell us about your Event" />
                            <Header sub color="teal" content="Event Location Details"/>

                            <Field name="city" options={{ types: ['(cities)'] }} type="text" component={PlaceInput} placeholder="City of the Event" onSelect={this.handleCitySelect}/>

                             {this.state.scriptLoaded && <Field name="venue" options={{location: new google.maps.LatLng(this.state.cityLatLng), radius:1000, types: ['establishment']}} type="text" component={PlaceInput} onSelect={this.handleVenueSelect} placeholder="Venue of the Event"  />}

                            <Field name="date" dateFormat="YYYY-MM-DD HH:mm" timeFormat="HH:mm" showTimeSelect placeholder="Date and Time of event" type="text" component={DateInput}/>
                        <Button disabled={invalid || submitting || pristine} positive type="submit"> Submit </Button>
                        <Button onClick={this.props.history.goBack} type="button">Cancel</Button>
                        <Button 
                            onClick={() => cancelToggle(!event.cancelled, event.id)}
                            type='button'
                            color={event.cancelled ? 'green' : 'red'}
                            floated='right'
                            content={event.cancelled ? "Reactivate Event" : "Cancel Event"}
                        />
                    </Form>
                </Segment>
            </Grid.Column>
        </Grid>  
    )
  }
}

export default withFirestore(connect(mapStateToProps, mapDispatchToProps)(
                                            //reinitialize when the form props change.
    reduxForm({ form: 'eventForm', enableReinitialize: true, validate })(EventForm))
);