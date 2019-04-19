import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import { Switch, Route, Redirect } from 'react-router-dom';
import SettingsNav from './SettingsNav';
import AboutPage from './AboutPage';
import AccountPage from './AccountPage';
import BasicPage from './BasicPage';
import PhotosPage from './PhotosPage';
import { updatePassword } from '../../auth/authActions';
import { updateProfile } from '../userActions';


const mapDispatchToProps = {
    updatePassword,
    updateProfile
}

const mapStateToProps = (state) => ({
    //coming from store. in firebase reducer giving us access to auth providerData
    providerId: state.firebase.auth.providerData[0].providerId,
    //coming from firebase reducer, our user information is stored in firebase.profile
    user: state.firebase.profile
})

const SettingsDashboard = ({ updatePassword, providerId, user, updateProfile }) => {
    return ( 
        <Grid>
            <Grid.Column width={12}>
                <Switch>
                    <Redirect exact from="/settings" to="settings/basic"/>
                    <Route path="/settings/basic" render={() => <BasicPage initialValues={user} updateProfile={updateProfile}/> }/>
                                                                            {/* popping out our initial values from database to our form input                                                                                                                                    */}
                    <Route path="/settings/about" render={() => <AboutPage  initialValues={user} updateProfile={updateProfile}/>}/>
                    <Route path="/settings/photos" component={PhotosPage}/>
                    <Route path="/settings/account" render={() => <AccountPage updatePassword={updatePassword} providerId={providerId} />}/>
                </Switch>
            </Grid.Column>
            <Grid.Column width={4}>
                <SettingsNav/>
            </Grid.Column>
        </Grid>
     );
}   
 
export default connect(mapStateToProps,mapDispatchToProps)(SettingsDashboard);