import React from 'react';
import {connect} from 'react-redux';
import $ from 'jquery';
import {setLogIn} from "../actions/userActions";
import {DotArray} from "../classes/DotArray";
import {deviceEnum} from "../const/deviceEnum";

class MainTable extends React.Component {
    componentDidMount() {
        if(this.props.deviceType===deviceEnum.DESKTOP){
            let leftTable = $('#leftTable');
            let rightTable = $('#rightTable');
            if (leftTable.height() > rightTable.height()) {
                rightTable.height(leftTable.height());
            } else {
                leftTable.height(rightTable.height());
            }
        }
    }

    handleLogOutButtonClick() {
        this.props.setLogIn(false);
    }

    getDots() {
        const dots = new DotArray(this.props.dots);
        return dots.getFullArray();
    }

    render() {
        const style = this.props.style;
        return (
            <div className='rightTable' style={this.props.rightTable} id='rightTable'>
                <table className="pointTable" style={style.pointTable}>
                    <thead>
                    <tr>
                        <td className="tableHeading" style={style.tableHeading}>
                            Результат обработки данных
                        </td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            <table className="resultTable" style={style.resultTable}>
                                <thead id="resultTableHead" style={style.resultTableHead}>
                                <tr>
                                    <td>
                                        Координата Х
                                    </td>
                                    <td>
                                        Координата Y
                                    </td>
                                    <td>
                                        Координата R
                                    </td>
                                    <td>
                                        Попадание
                                    </td>
                                </tr>
                                </thead>
                                <tbody>
                                {this.getDots().map((dot, id) => (
                                    <tr key={id}>
                                        <td style={style.resultTableCell}>
                                            {String(dot.getX()) || <br/>}
                                        </td>
                                        <td style={style.resultTableCell}>
                                            {String(dot.getY()) || ''}
                                        </td>
                                        <td style={style.resultTableCell}>
                                            {String(dot.getR()) || ''}
                                        </td>
                                        <td style={style.resultTableCell}>
                                            {String(dot.getHit()) || ''}
                                        </td>
                                    </tr>))}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div className="logOutButtonDiv" style={style.logOutButtonDiv}>
                    <button id='logOutButton' style={style.logOutButton}
                            onClick={() => this.handleLogOutButtonClick()}>Выйти
                    </button>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setLogIn: flag => dispatch(setLogIn(flag))
    }
};
const mapStateToProps = store => {
    return {
        deviceType: store.style.deviceType,
        rightTable: store.style.deviceType.rightTable,
        style: store.style.deviceType.mainTable,
        dots: store.form.dots
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(MainTable);