

const initialStateUser = {
    currentUser: {}
}

export const authReducer = (state = initialStateUser, action) => {
    switch(action.type){
        case "LOGIN_USER":
            return {
                ...state,
                authenticated: true,
                currentUser:action.creds.email
            }
        
        case "LOGOUT_USER":
            return {
                ...state,
                authenticated: false,
                currentUser: {}
            }

        default:
            return state;
    }
}