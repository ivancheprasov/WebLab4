import {actionEnum} from "../const/actionEnum";

export function setXInput(value) {
    return{
        type:actionEnum.SET_X_INPUT,
        payload:value
    }
}
export function setYInput(value) {
    return{
        type:actionEnum.SET_Y_INPUT,
        payload:value
    }
}
export function setRInput(value) {
    return{
        type:actionEnum.SET_R_INPUT,
        payload:value
    }
}
export function setDots(array) {
    return{
        type:actionEnum.SET_DOTS,
        payload:array
    }
}