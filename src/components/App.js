import React from "react";
import {BrowserRouter, Route} from "react-router-dom";
import {connect} from 'react-redux';
import WelcomePage from './WelcomePage';
import MainPage from './MainPage'
import {setStyle} from "../actions/styleActions";
import {setCanvasWidth} from "../actions/canvasActions";
import {setDeviceType} from "../actions/deviceActions";
import {deviceEnum} from "../const/deviceEnum";
import {Redirect} from "react-router";

class App extends React.Component {
    constructor(props) {
        super(props);
        const width = window.screen.availWidth;
        if (width >= 1138) {
            this.setDevice(0);
        }else{
            if(width < 646) {
                this.setDevice(1);
            }else{
                this.setDevice(2);
            }
        }
    }

    setDevice(i) {
        if (i === 0) {
            this.props.setStyle(deviceEnum.DESKTOP);
            this.props.setDeviceType(deviceEnum.DESKTOP);
            this.props.setCanvasWidth(window.screen.availWidth*0.25);
        } else if (i === 1) {
            this.props.setStyle(deviceEnum.PHONE);
            this.props.setDeviceType(deviceEnum.PHONE);
            this.props.setCanvasWidth(window.screen.availWidth*0.5);
        } else {
            this.props.setStyle(deviceEnum.TABLET);
            this.props.setDeviceType(deviceEnum.TABLET);
            this.props.setCanvasWidth(window.screen.availWidth*0.25);
        }
    }
    render() {
        return (
            <BrowserRouter>
                <Route strict path="/welcome" component={WelcomePage}/>
                <Route exact strict path="/main" component={MainPage}/>
                {this.props.user.isLogIn && <Redirect to={'/main'}/>}
                {(!this.props.user.isLogIn && <Redirect to={'/welcome'}/>)}
            </BrowserRouter>
            // <MainPage/>
        )
    };
}
const mapStateToProps = store => {
    return {
        user: store.user
    }
};
const mapDispatchToProps = dispatch => {
    return {
        setStyle: deviceType => dispatch(setStyle(deviceType)),
        setCanvasWidth: width => dispatch(setCanvasWidth(width)),
        setDeviceType: deviceType => dispatch(setDeviceType(deviceType)),
    }
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App)