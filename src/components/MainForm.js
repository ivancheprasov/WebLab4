import React from 'react';
import {connect} from 'react-redux';
import {setRInput, setXInput, setYInput, setDots} from '../actions/formActions';
import $ from 'jquery';
import axios from 'axios';
import {port} from "../const/port";
import {DotArray} from "../classes/DotArray";
import {Dot} from "../classes/Dot";

class MainForm extends React.Component {

    formSubmit(event) {
        event.preventDefault();
        let x = $('input[name=xInput]:checked').val();
        let y = $('#yInput').val();
        let r = $('input[name=rInput]:checked').val();
        if (this.validate(x, y, r)) {
            this.sendDot(x, y, r).then(()=>this.drawDots(r));
        }
        return false;
    }

    componentDidMount() {
        this.renderCanvas();
        $(document).on('keypress', function (e) {
            if (e.which === 13) {
                e.preventDefault();
            }
        });
    }

    validate(x, y, r) {
        this.clearErrorLog();
        let isValid = true;
        if (x === undefined) {
            this.pushErrorLog('Вы не выбрали значение Х. Сделайте это.');
            isValid = false;
        } else if (x.match(/^[0-3](([.,]0+)|)$/) == null
            && x.match(/^-[0-5](([.,]0+)|)$/) == null &&
            x.match(/^[0-2][.,]\d+$/) == null &&
            x.match(/^-[0-4][.,]\d+$/) == null) {
            isValid = false;
            this.pushErrorLog('Выбрано некорректное значение Х или не входящее в допустимый диапозон.<br/>Введите значение от -5 до 3.');
        }
        if (y.match(/^[0-3](([.,]0+)|)$/) == null
            && y.match(/^-[0-5](([.,]0+)|)$/) == null &&
            y.match(/^[0-2][.,]\d+$/) == null &&
            y.match(/^-[0-4][.,]\d+$/) == null) {
            isValid = false;
            this.pushErrorLog('Выбрано некорректное значение Y или не входящее в допустимый диапозон.<br/>Введите значение от -5 до 3.');
        }
        if (r === undefined) {
            this.pushErrorLog('Вы не выбрали значение R. Сделайте это.');
            isValid = false;
        } else if (r.match(/^[1-3](([.,]0+)|)$/) == null && r.match(/^[1-2][.,]\d+$/) == null) {
            isValid = false;
            this.pushErrorLog('Выбрано некорректное значение R или не входящее в допустимый диапозон.<br/>Введите значение от 1 до 3.');
        }
        return isValid;
    }

    canvasClickHandler(event) {
        let R = $('input[name=rInput]:checked').val();
        let errorJquery = $('#error-log');
        errorJquery.html('');
        let canvas = $('#canvas').get(0);
        let context = canvas.getContext('2d');
        R = Number(parseFloat(R.toString().replace(',', '.')).toPrecision(3));
        if (!(R >= 1.0 && R <= 3.0)) {
            R = 'R';
        }
        this.drawCanvas(R);
        let x = event.clientX - canvas.getBoundingClientRect().left;
        let y = event.clientY - canvas.getBoundingClientRect().top;
        context.fillStyle = 'rgb(227, 93, 214)';
        context.beginPath();
        context.arc(x, y, 3, 0, 2 * Math.PI, true);
        context.closePath();
        context.fill();
        context.strokeStyle = 'rgb(227, 93, 214)';
        context.lineWidth = 2;
        context.beginPath();
        context.arc(x, y, 7, 0, 2 * Math.PI, true);
        context.closePath();
        context.stroke();
        let xVal;
        let yVal;
        if (R >= 1.0 && R <= 3.0) {
            xVal = (-canvas.height / 2 + x) / (0.35 * canvas.height) * R;
            yVal = (canvas.height / 2 - y) / (0.35 * canvas.height) * R;
            this.sendDot(Number(parseFloat(xVal).toPrecision(3)), Number(parseFloat(yVal).toPrecision(3)), R)
                .then(()=>this.drawDots(R));
        }
    }

     async sendDot(x, y, r) {
         const url = 'http://localhost:' + port + '/dots';
         await axios.post(url, JSON.stringify({x: x, y: y, r: r}),{
             headers: { Authorization:'Basic '+btoa(this.props.user.loginInput+':'+this.props.user.passwordInput)}}).then(result => {
                 if (result.status===200) {
                     this.updateDots(x,y,r);
                 } else {
                     this.clearErrorLog();
                     this.pushErrorLog('Не удалось добавить точку');
                 }
             }
         );
        // this.updateDots(x,y,r);
    }

    async getDots() {
        const url = 'http://localhost:' + port + '/dots';
        let dots=new DotArray(this.props.form.dots);
        await axios.get(url,{
            headers: { Authorization:'Basic '+btoa(this.props.user.loginInput+':'+this.props.user.passwordInput)}}).then(response => {
                if (response.status===200) {
                    let array=response.json();
                    let dots=new DotArray();
                    Array.from(array).forEach(dot=>dots.add(new Dot(dot.x,dot.y,dot.r)));
                } else {
                    this.clearErrorLog();
                    this.pushErrorLog('Не удалось получить координаты точек');
                }
            }
        );
        this.props.setDots(dots.getDots());
        return dots;
    }
    async updateDots(x,y,r){
        const dots = await this.getDots();
        dots.add(x, y, r);
        await this.props.setDots(dots.getDots());
    }
    pushErrorLog(message) {
        let errorJquery = $('#errorLog');
        let li = document.createElement('li');
        li.setAttribute('style', 'padding-bottom:1%;padding-top:1%;text-align:left;');
        errorJquery.append(li);
        li.innerHTML = li.innerHTML + message;
    }

    clearErrorLog() {
        let errorJquery = $('#errorLog');
        errorJquery.html('');
    }

    yInputChangeHandler(event) {
        this.props.setYInput(event.target.value);
    }

    renderCanvas() {
        let R = $('input[name=rInput]:checked').val();
        this.drawCanvas(R);
        this.drawDots(R);
    }

    drawCanvas(R) {
        let canvas = $('#canvas').get(0);
        let context = canvas.getContext('2d');
        let size = this.props.size;
        canvas.width = size;
        canvas.height = size;
        context.clearRect(0, 0, size, size);
        context.strokeStyle = 'rgb(0,0,0)';
        context.lineWidth = 3;
        context.fillStyle = 'rgb(255,255,255)';
        context.font = 'small-caps 20px Times New Roman';
        context.fillRect(0, 0, size, size);
        //область
        context.fillStyle = 'rgb(44,103,191)';
        context.fillRect(0.325 * size, 0.5 * size, 0.175 * size, 0.35 * size);
        context.beginPath();
        context.moveTo(0.5 * size, 0.5 * size);
        context.lineTo(0.675 * size, 0.5 * size);
        context.lineTo(0.5 * size, 0.325 * size);
        context.lineTo(0.5 * size, 0.5 * size);
        context.closePath();
        context.fill();
        context.beginPath();
        context.moveTo(0.325 * size, 0.5 * size);
        context.arcTo(0.325 * size, 0.325 * size, 0.5 * size, 0.325 * size, 0.175 * size);
        context.lineTo(0.5 * size, 0.5 * size);
        context.lineTo(0.15 * size, 0.5 * size);
        context.closePath();
        context.fill();
        //оси и стрелочки
        context.beginPath();
        context.moveTo(0, size / 2);
        context.lineTo(size, size / 2);
        context.lineTo(size - 0.03 * size, size / 2 + 0.03 * size);
        context.lineTo(size, size / 2);
        context.lineTo(size - 0.03 * size, size / 2 - 0.03 * size);
        context.lineTo(size, size / 2);
        context.moveTo(size / 2, size);
        context.lineTo(size / 2, 0);
        context.lineTo(size / 2 - 0.03 * size, 0.03 * size);
        context.lineTo(size / 2, 0);
        context.lineTo(size / 2 + 0.03 * size, 0.03 * size);
        context.lineTo(size / 2, 0);
        context.closePath();
        context.stroke();
        let halfR;
        if (R === 'R') {
            halfR = 'R/2'
        } else {
            halfR = parseFloat((R / 2).toPrecision(4));
        }
        context.fillStyle = 'rgb(0,0,0)';
        context.fillText('Y', size / 2 + 0.05 * size, 0.06 * size);
        context.fillText('X', 0.94 * size, size / 2 - 0.05 * size);
        //R на Y
        context.fillText(R, size / 2 + 0.05 * size, 0.175 * size);
        context.fillText(halfR, size / 2 + 0.05 * size, 0.35 * size);
        context.fillText('-' + halfR, size / 2 + 0.05 * size, 0.7 * size);
        context.fillText('-' + R, size / 2 + 0.05 * size, 0.875 * size);
        //R на X
        context.fillText('-' + R, 0.175 * size - 0.065 * size, size / 2 - 0.05 * size);
        context.fillText('-' + halfR, 0.35 * size - 0.065 * size, size / 2 - 0.05 * size,);
        context.fillText(halfR, 0.7 * size - 0.045 * size, size / 2 - 0.05 * size);
        context.fillText(R, 0.875 * size - 0.045 * size, size / 2 - 0.05 * size);
        //засечки Y
        context.beginPath();
        context.moveTo(size / 2 - 0.02 * size, 0.15 * size);
        context.lineTo(size / 2 + 0.02 * size, 0.15 * size);
        context.closePath();
        context.stroke();
        context.beginPath();
        context.moveTo(size / 2 - 0.02 * size, 0.325 * size);
        context.lineTo(size / 2 + 0.02 * size, 0.325 * size);
        context.closePath();
        context.stroke();
        context.beginPath();
        context.moveTo(size / 2 - 0.02 * size, 0.675 * size);
        context.lineTo(size / 2 + 0.02 * size, 0.675 * size);
        context.closePath();
        context.stroke();
        context.beginPath();
        context.moveTo(size / 2 - 0.02 * size, 0.85 * size);
        context.lineTo(size / 2 + 0.02 * size, 0.85 * size);
        context.closePath();
        context.stroke();
        //засечки X
        context.beginPath();
        context.moveTo(0.325 * size, size / 2 - 0.02 * size);
        context.lineTo(0.325 * size, size / 2 + 0.02 * size);
        context.closePath();
        context.stroke();
        context.beginPath();
        context.moveTo(0.15 * size, size / 2 - 0.02 * size);
        context.lineTo(0.15 * size, size / 2 + 0.02 * size);
        context.closePath();
        context.stroke();
        context.beginPath();
        context.moveTo(0.675 * size, size / 2 - 0.02 * size);
        context.lineTo(0.675 * size, size / 2 + 0.02 * size);
        context.closePath();
        context.stroke();
        context.beginPath();
        context.moveTo(0.85 * size, size / 2 - 0.02 * size);
        context.lineTo(0.85 * size, size / 2 + 0.02 * size);
        context.closePath();
        context.stroke();
    }

    setXInput(event) {
        this.props.setXInput(Number(event.target.value));
    }

    setR(event) {
        this.props.setRInput(Number(event.target.value));
        this.drawCanvas(event.target.value);
        this.drawDots(event.target.value);
    }

    async drawDots(R) {
        if (!(R === "R")) {
            let canvas = $('#canvas').get(0);
            let context = canvas.getContext("2d");
            let size = canvas.height;
            const dots = await this.getDots();
            dots.getDots().forEach(dot => {
                if (this.isHit(dot.getX(), dot.getY())) {
                    if (dots.getDots().indexOf(dot) === (dots.getDots().length - 1)) {
                        context.fillStyle = 'rgb(39, 219, 105)';
                        context.strokeStyle = 'rgb(39, 219, 105)';
                    } else {
                        context.fillStyle = 'rgb(18, 74, 39)';
                        context.strokeStyle = 'rgb(18, 74, 39)';
                    }
                } else {
                    if (dots.getDots().indexOf(dot) === (dots.getDots().length - 1)) {
                        context.fillStyle = 'rgb(138, 89, 179)';
                        context.strokeStyle = 'rgb(138, 89, 179)';
                    } else {
                        context.fillStyle = 'rgb(92, 44, 156)';
                        context.strokeStyle = 'rgb(92, 44, 156)';
                    }
                }
                context.beginPath();
                let x = dot.getX();
                let y = dot.getY();
                let r = dot.getR();
                let canvasX = this.calculateCanvasCoordinate(x * 0.35 * size / r + size / 2,r,R,size);
                let canvasY = this.calculateCanvasCoordinate(size / 2 - y * 0.35 * size / r,r,R,size);
                context.arc(canvasX, canvasY, 3, 0, 2 * Math.PI, true);
                context.closePath();
                context.fill();
                context.lineWidth = 2;
                context.beginPath();
                context.arc(canvasX, canvasY, 7, 0, 2 * Math.PI, true);
                context.closePath();
                context.stroke();
            });
        }
    }
    calculateCanvasCoordinate(value,r,R,size){
        if (value >= size / 2) {
            return (value - size / 2) * r / R + size / 2;
        } else {
            return  size / 2 - (size / 2 - value) * r / R;
        }
    }
    isHit(x, y) {
        let r = $('input[name=rInput]:checked').val();
        return ((x >= 0 && y >= 0) && (y <= -x + (r / 2))) ||
            ((x < 0 && y >= 0) && (Math.pow(x, 2) + Math.pow(y, 2) <= Math.pow(r/2, 2))) ||
            ((x < 0 && y < 0) && (x >= (-r / 2) && y >= -r));
    }

    render() {
        const style = this.props.style;
        const form = this.props.form;
        return (
            <div className='leftTable' style={this.props.leftTable} id='leftTable'>
                <form id='form' name='form'>
                    <table className='inputTable' style={style.inputTable}>
                        <thead>
                        <tr>
                            <td className='tableHeading' colSpan='4' style={style.tableHeading}>Выберите координаты
                                точки и
                                радиус
                            </td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Область</td>
                            <td colSpan='3'>Значения</td>
                        </tr>
                        <tr>
                            <td rowSpan='8' id='canvasCell'>
                                <div id='canvasContainer'>
                                    <canvas id='canvas' onClick={event => this.canvasClickHandler(event)}>Здесь должен
                                        был
                                        быть Canvas, но ваш браузер его не поддерживает.
                                    </canvas>
                                </div>
                            </td>
                            <td colSpan='3'>
                                Координата Х:
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input type='radio'
                                       id='x-5'
                                       className='xInput'
                                       name='xInput'
                                       form='form'
                                       value={-5}
                                       style={style.radioButton}
                                       checked={form.xInput === -5}
                                       onClick={event => this.setXInput(event)}
                                />
                                <label htmlFor='x-5' style={style.label}>-5</label>
                            </td>
                            <td>
                                <input type='radio'
                                       id='x-4'
                                       className='xInput'
                                       name='xInput'
                                       form='form'
                                       value={-4}
                                       style={style.radioButton}
                                       checked={form.xInput === -4}
                                       onClick={event => this.setXInput(event)}
                                />
                                <label htmlFor='x-4'>-4</label>
                            </td>
                            <td>
                                <input type='radio'
                                       id='x-3'
                                       className='xInput'
                                       name='xInput'
                                       form='form'
                                       value={-3}
                                       style={style.radioButton}
                                       checked={form.xInput === -3}
                                       onClick={event => this.setXInput(event)}
                                />
                                <label htmlFor='x-3'>-3</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input type='radio'
                                       id='x-2'
                                       className='xInput'
                                       name='xInput'
                                       form='form'
                                       value={-2}
                                       style={style.radioButton}
                                       checked={form.xInput === -2}
                                       onClick={event => this.setXInput(event)}
                                />
                                <label htmlFor='x-2'>-2</label>
                            </td>
                            <td>
                                <input type='radio'
                                       id='x-1'
                                       className='xInput'
                                       name='xInput'
                                       form='form'
                                       value={-1}
                                       style={style.radioButton}
                                       checked={form.xInput === -1}
                                       onClick={event => this.setXInput(event)}
                                />
                                <label htmlFor='x-1'>-1</label>
                            </td>
                            <td>
                                <input type='radio'
                                       id='x0'
                                       className='xInput'
                                       name='xInput'
                                       form='form'
                                       value={0}
                                       style={style.radioButton}
                                       checked={form.xInput === -0}
                                       onClick={event => this.setXInput(event)}
                                />
                                <label htmlFor='x0'> 0</label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input type='radio'
                                       id='x1'
                                       className='xInput'
                                       name='xInput'
                                       form='form'
                                       value={1}
                                       style={style.radioButton}
                                       checked={form.xInput === 1}
                                       onClick={event => this.setXInput(event)}
                                />
                                <label htmlFor='x1'> 1</label>
                            </td>
                            <td>
                                <input type='radio'
                                       id='x2'
                                       className='xInput'
                                       name='xInput'
                                       form='form'
                                       value={2}
                                       style={style.radioButton}
                                       checked={form.xInput === 2}
                                       onClick={event => this.setXInput(event)}
                                />
                                <label htmlFor='x2'> 2</label>
                            </td>
                            <td>
                                <input type='radio'
                                       id='x3'
                                       className='xInput'
                                       name='xInput'
                                       form='form'
                                       value={3}
                                       style={style.radioButton}
                                       checked={form.xInput === 3}
                                       onClick={event => this.setXInput(event)}
                                />
                                <label htmlFor='x3'> 3</label>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan='3'>
                                Координата Y:
                            </td>
                        </tr>
                        <tr>
                            <td colSpan='3'>
                                <input type='text'
                                       id='yInput'
                                       maxLength={10}
                                       name='yInput'
                                       placeholder='от -5 до 3'
                                       form='form'
                                       style={style.yInput}
                                       value={this.props.form.yInput || ''}
                                       onChange={event => this.yInputChangeHandler(event)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan='3'>
                                Радиус:
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input type='radio'
                                       id='r1'
                                       className='rInput'
                                       name='rInput'
                                       form='form'
                                       value={1}
                                       checked={form.rInput === 1}
                                       onClick={event => this.setR(event)}
                                       style={style.radioButton}
                                />
                                <label htmlFor='r1'> 1</label>
                            </td>
                            <td>
                                <input type='radio'
                                       id='r2'
                                       className='rInput'
                                       name='rInput'
                                       form='form'
                                       value={2}
                                       checked={form.rInput === 2}
                                       onClick={event => this.setR(event)}
                                       style={style.radioButton}
                                />
                                <label htmlFor='r2'> 2</label>
                            </td>
                            <td>
                                <input type='radio'
                                       id='r3'
                                       className='rInput'
                                       name='rInput'
                                       form='form'
                                       value={3}
                                       checked={form.rInput === 3}
                                       onClick={event => this.setR(event)}
                                       style={style.radioButton}
                                />
                                <label htmlFor='r3'> 3</label>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <div className='submitButtonDiv' style={style.submitButtonDiv}>
                        <button value='Отправить'
                                onClick={event => this.formSubmit(event)}
                                className='submitButton'
                                form='form'
                                style={style.submitButton}
                        >
                            Отправить
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = store => {
    return {
        user: store.user,
        leftTable: store.style.deviceType.leftTable,
        style: store.style.deviceType.mainForm,
        form: store.form,
        size: store.canvas.canvasWidth
    };
};
const mapDispatchToProps = dispatch => {
    return {
        setDots: array => dispatch(setDots(array)),
        setXInput: value => dispatch(setXInput(value)),
        setYInput: value => dispatch(setYInput(value)),
        setRInput: value => dispatch(setRInput(value))
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(MainForm);