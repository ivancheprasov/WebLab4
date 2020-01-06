import {actionEnum} from "../const/actionEnum";

export function setStyle(deviceType) {
    return{
        type: actionEnum.SET_STYLE,
        payload: deviceType
    }
}