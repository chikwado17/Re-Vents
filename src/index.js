import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import  ReduxToastr  from 'react-redux-toastr';
import 'semantic-ui-css/semantic.min.css';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import './index.css';
import App from './app/layout/App';
import * as serviceWorker from './serviceWorker';
import { configureStore } from './app/store/configureStore';
import ScrollToTop from './app/common/utils/ScrollToTop';
//loadEvents action to load our initialData as a mock api
// import { loadEvents } from './features/event/eventActions';

 

const store = configureStore();
//dispatching the loadevents to load the event in our mock api to our application
//causing delay on our page from redux thunk
// store.dispatch(loadEvents());

const rootEl = document.getElementById('root');

let render = () => {
    ReactDOM.render(
   <Provider store={store}>
        <BrowserRouter>
            <ScrollToTop>
                <ReduxToastr
                position='bottom-right'
                transitionIn='bounceIn'
                transitionOut='fadeOut'
                progressBar
                />
                <App/>
            </ScrollToTop>
        </BrowserRouter>
   </Provider>, 
    rootEl );
}

if(module.hot){
    module.hot.accept('./app/layout/App', () => {
        setTimeout(render)
    })
}

//when using firebase authentication : check if use is logged in before rendering
store.firebaseAuthIsReady.then(() => {
    render();
});



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
