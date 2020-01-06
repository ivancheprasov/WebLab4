import {actionEnum} from "../const/actionEnum";

const initialState={
    userMessage:"",
    isLogIn:false
};

export function user(state=initialState,action) {
    switch (action.type) {
        case actionEnum.SET_LOG_IN:{
            return Object.assign({},state,{isLogIn: action.payload});
        }
        case actionEnum.SET_USER_MESSAGE:case actionEnum.LOG_IN_FAILED:{
            return Object.assign({},state,{userMessage: action.payload});
        }
        case actionEnum.SET_LOGIN_INPUT:{
            return Object.assign({},state,{loginInput: action.payload});
        }
        case actionEnum.SET_PASSWORD_INPUT:{
            return Object.assign({},state,{passwordInput: action.payload});
        }
        default:
            return state;
    }
}