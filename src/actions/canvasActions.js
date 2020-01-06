import {actionEnum} from "../const/actionEnum";

export function setCanvasWidth(style) {
    return{
        type:actionEnum.SET_CANVAS_WIDTH,
        payload:style
    }
}