


const initialState = {
    loading: false
}


export const asyncReducer = (state = initialState, action) => {
    switch(action.type){
        case "ASYNC_START":
            return {
                ...state,
                loading:true
            }
        case "ASYNC_FINISH":
            return {
                ...state,
                loading:false
            }
        case "ASYNC_ERROR":
            return {
                ...state,
                loading:false
            }
            
        default:
        return state;
    }
}