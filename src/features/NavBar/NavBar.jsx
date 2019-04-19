import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFirebase } from 'react-redux-firebase';
import { openModal } from '../modals/modalActions';
import { Menu, Container, Button } from 'semantic-ui-react';
import { NavLink, Link, withRouter } from 'react-router-dom';
import SignedOutMenu from '../../features/NavBar/Menus/SignedOutMenu';
import SignedInMenu from './Menus/SignedInMenu';
// import { logout } from '../auth/authActions';

//authentication from firebase
//the profile is getting the logged in user details
const mapStateToProps = (state) => ({
    auth: state.firebase.auth,
    profile: state.firebase.profile
})

class NavBar extends Component {
 

    handleSignIn = () => {
        //coming from lookupmodal from modal manager
       this.props.dispatch(openModal('LoginModal'))
    }
    handleSignUp = () => {
        //coming from lookupmodal from modal manager
       this.props.dispatch(openModal('RegisterModal'))
    }
    handleSignOut = () => {
        //using firebase logout method
        this.props.firebase.logout();
        this.props.history.push('/');
    }


  render() {
      //dispatching auth from redux
      const { auth, profile } = this.props;
      //to check if user is authenticated from firebase
      const authenticated = auth.isLoaded && !auth.isEmpty;
    return (
    
        <Menu inverted fixed="top">
            <Container>
                <Menu.Item header as={Link} to="/">
                    <img src="/assets/logo.png" alt="logo" />
                        Re-vents 
                </Menu.Item>
                <Menu.Item as={NavLink} to='/events' name="Events" />
                {/* checking if user is logged in before showing some nav menu */}
                {authenticated && 
                <Menu.Item as={NavLink} to='/people' name="People" />}

                {authenticated &&
                    <Menu.Item>
                        <Button
                         as={Link} 
                         to="/createEvent" 
                         floated="right" 
                         positive 
                         inverted
                         content="Create Event" 
                         />
                    </Menu.Item>}
                {authenticated ? (
                                 //authentication from firebase
                    <SignedInMenu profile={profile} signOut={this.handleSignOut} /> 
                    ) : (
                    <SignedOutMenu signIn={this.handleSignIn} register={this.handleSignUp}/>
                    )}    
            </Container>
        </Menu>
    )
  }
}

export default withRouter(withFirebase(connect(mapStateToProps)(NavBar)));