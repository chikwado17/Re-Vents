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


const mapDispatchToProps = {
    updatePassword
}

const mapStateToProps = (state) => ({
    //coming from store. in firebase reducer giving us access to auth providerData
    providerId: state.firebase.auth.providerData[0].providerId
})

const SettingsDashboard = ({ updatePassword, providerId }) => {
    return ( 
        <Grid>
            <Grid.Column width={12}>
                <Switch>
                    <Redirect exact from="/settings" to="settings/basic"/>
                    <Route path="/settings/basic" component={BasicPage}/>
                    <Route path="/settings/about" component={AboutPage}/>
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