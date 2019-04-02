import { combineReducers } from 'redux';
import { reducer as FormReducer } from 'redux-form';
import { eventReducer } from '../../features/event/eventReducer.jsx';


const rootReducer = combineReducers({

    form:FormReducer,
    events:eventReducer
})

export default rootReducer;