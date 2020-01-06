import {actionEnum} from "../const/actionEnum";

const initialState={
    canvasWidth:window.screen.availWidth*0.25
};

export function canvas(state=initialState,action) {
    switch (action.type) {
        case actionEnum.SET_CANVAS_WIDTH:
            return Object.assign({},state,{canvasWidth:action.payload});
        default:
            return state;
    }
}