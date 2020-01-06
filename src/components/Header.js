import React from "react";
import {Title} from "./Title";
import {connect} from "react-redux";

 function Header(props) {
    return(
        <div className="header" style={props.style}>
            <Title style={props.titleStyle}/>
            Чепрасов Иван Андреевич, Окишор Александр Александрович P3200
            <br/>Лабораторная №4. Вариант: 200042
        </div>
    );
}
const mapStateToProps=store=>{
    return{
        titleStyle:store.style.deviceType.header.h1.firstLine
    }
};
export default connect(mapStateToProps)(Header)