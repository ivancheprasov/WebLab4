import React from 'react';

export function ErrorLog(props) {
    return(
        <div className='bottomTable' style={props.bottomTableStyle}>
            <table className='errorTable' style={props.errorTableStyle}>
                <thead>
                <tr>
                    <td>Полезные советы</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <ul id='errorLog' style={props.errorLogStyle}>
                        </ul>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}