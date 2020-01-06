import {deviceEnum} from "../const/deviceEnum";
import {actionEnum} from "../const/actionEnum";
import {desktop} from "../style/desktop";
import {phone} from "../style/phone";
import {tablet} from "../style/tablet";

const initialState = {deviceType:desktop};

export function style(state = initialState, action) {
    switch (action.type) {
        case actionEnum.SET_STYLE:
            switch (action.payload) {
                case deviceEnum.DESKTOP:
                    return Object.assign({},state,{deviceType:desktop});
                case deviceEnum.PHONE:
                    return Object.assign({},state,{deviceType:phone});
                case deviceEnum.TABLET:
                    return Object.assign({},state,{deviceType:tablet});
                default:
                    return state;
            }
        default:
            return state;
    }
}