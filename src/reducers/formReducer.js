import {actionEnum} from "../const/actionEnum";

const initialState={
    xInput:-5,
    yInput:'',
    rInput:1,
    dots:[]
};

export function form(state=initialState,action) {
    switch (action.type) {
        case actionEnum.SET_X_INPUT:
            return Object.assign({},state,{xInput: action.payload});
        case actionEnum.SET_Y_INPUT:
            return Object.assign({},state,{yInput: action.payload});
        case actionEnum.SET_R_INPUT:
            return Object.assign({},state,{rInput: action.payload});
        case actionEnum.SET_DOTS:
            return Object.assign({},state,{dots: action.payload});
        default:
            return state;
    }
}