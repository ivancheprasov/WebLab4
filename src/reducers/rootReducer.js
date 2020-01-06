import { combineReducers } from 'redux'
import {style} from './styleReducer';
import {user} from "./userReducer";
import {form} from "./formReducer";
import {canvas} from "./canvasReducer";

export const rootReducer = combineReducers({
    style: style,
    user: user,
    form: form,
    canvas: canvas
});