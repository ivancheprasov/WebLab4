import React from "react";
import {connect} from "react-redux";
import MainForm from "./MainForm";
import {ErrorLog} from './ErrorLog';
import MainTable from "./MainTable";

class MainPage extends React.Component{
    render() {
        const style=this.props.style;
        return(
            <div>
                <MainForm/>
                <MainTable/>
                <ErrorLog bottomTableStyle={style.bottomTable} errorTableStyle={style.errorTable} errorLogStyle={style.errorLog}/>
            </div>
        );
    }
}
const mapStateToProps=store=>{
    return{
        style:store.style.deviceType
    }
};
export default connect(mapStateToProps)(MainPage);