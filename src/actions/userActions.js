import {actionEnum} from "../const/actionEnum";

export function setLogIn(flag) {
    return{
        type: actionEnum.SET_LOG_IN,
        payload: flag
    }
}
export function setUserMessage(message) {
    return{
        type: actionEnum.SET_USER_MESSAGE,
        payload: message
    }
}
export function setLoginInput(login) {
    return{
        type: actionEnum.SET_LOGIN_INPUT,
        payload: login
    }
}
export function setPasswordInput(password) {
    return{
        type: actionEnum.SET_PASSWORD_INPUT,
        payload: password
    }
}