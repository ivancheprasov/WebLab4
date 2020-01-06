import React from 'react';
import {connect} from "react-redux";
import WelcomeForm from './WelcomeForm';
import Header from './Header';
import {Footer} from "./Footer";

class WelcomePage extends React.Component {
    render() {
        const {style, user} = this.props;
        return (
            <div>
                <Header style={style.deviceType.header}/>
                <WelcomeForm user={user}/>
                <Footer style={style.deviceType.footer}/>
            </div>
        )
    }
}

const mapStateToProps = store => {
    return {
        user: store.user,
        header: store.header,
        style: store.style,
    }
};

export default connect(mapStateToProps)(WelcomePage)