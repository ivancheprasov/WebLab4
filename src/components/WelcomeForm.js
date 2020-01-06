import React from "react";
import {connect} from "react-redux";
import {setUserMessage} from "../actions/userActions";
import {setLoginInput} from "../actions/userActions";
import {setPasswordInput} from "../actions/userActions";
import {setLogIn} from "../actions/userActions";
import axios from 'axios';
import {port} from "../const/port";

class WelcomeForm extends React.Component {
    constructor(props) {
        super(props);
        this.props.setUserMessage('');
    }

    checkInput() {
        const login=this.props.user.loginInput;
        const password=this.props.user.passwordInput;
        return !(
            login === "" ||
            login == null ||
            password === "" ||
            password == null
        );
    }

    handleLogIn() {
        this.props.setUserMessage('');
        if (this.checkInput()) {
            const data = this.getData();
            const url='http://localhost:'+port+'/';
            axios.post(url,{data},{
                headers: { Authorization:'Basic '+btoa(data.login+':'+data.password)}}).then(result=>{
                if(result.ok){
                    this.props.setLogIn(true);
                }else{
                    this.props.setUserMessage('Не удалось войти в систему. Проверьте логин и пароль');
                }
            });
        } else {
            this.props.setUserMessage("Введите логин и пароль, пожалуйста.");
        }
    }

    handleRegister() {
        this.props.setUserMessage('');
        if (this.checkInput()) {
            const data = this.getData();
            const url='http://localhost:'+port+'/register';
            axios.post(url,JSON.stringify({username:data.login,password:data.password})).then(result=>{
                if(result.ok){
                    this.props.setUserMessage("Регистрация прошла успешно.");
                }else{
                    this.props.setUserMessage("Не удалось зарегистрироваться. Возможно, выбранный логин уже занят.");
                }
            });
        } else {
            this.props.setUserMessage("Введите логин и пароль, пожалуйста.");
        }
    }

    getData() {
        return {
            login: this.props.user.loginInput,
            password: this.props.user.passwordInput
        };
    }

    handleLoginChange(event) {
        this.props.setLoginInput(event.target.value);
    }

    handlePasswordChange(event) {
        this.props.setPasswordInput(event.target.value);
    }

    render() {
        return (
            <div className="welcomeFormDiv" style={this.props.style}>
                <form className="welcomeForm">
                    <input className="loginInput"
                           type="text"
                           value={this.props.user.loginInput||""}
                           placeholder="Введите логин"
                           onChange={event => {
                               this.handleLoginChange(event)
                           }}
                           maxLength={40}
                           style={this.props.style.loginInput}
                           form="welcomeForm"/>
                    <input className="passwordInput"
                           type="password"
                           value={this.props.user.passwordInput||""}
                           placeholder="Введите пароль"
                           onChange={event => this.handlePasswordChange(event)}
                           maxLength={20}
                           style={this.props.style.passwordInput}
                           form="welcomeForm"/>
                    <button className="logInButton"
                            style={this.props.style.logInButton}
                            type="button"
                            form="welcomeForm"
                            onClick={() => this.handleLogIn()}>
                        Вход
                    </button>
                    <button className="registerButton"
                            style={this.props.style.registerButton}
                            type="button"
                            form="welcomeForm"
                            onClick={() => this.handleRegister()}>
                        Регистрация
                    </button>
                    <div className="userMessage" style={this.props.style.userMessage}>
                        {this.props.user.userMessage === "" ? <br/> : this.props.user.userMessage}
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        user: store.user,
        style: store.style.deviceType.welcomeForm
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setLoginInput: login =>dispatch(setLoginInput(login)),
        setPasswordInput: password=>dispatch(setPasswordInput(password)),
        setUserMessage: message => dispatch(setUserMessage(message)),
        setLogIn: flag => dispatch(setLogIn(flag)),
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(WelcomeForm);