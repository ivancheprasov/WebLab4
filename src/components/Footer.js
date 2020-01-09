import React from "react";

export function Footer(props) {
    return(
    <div className="footer" style={props.style}>
        <p>Ссылка на исходные файлы:
            <a id="gitLink" href="https://github.com/ivancheprasov/WebLab4">github.com/ivancheprasov/WebLab4</a>
            <br/>
            <a id="gitLink" href="https://github.com/NotNaturalSelection/back4lab4">github.com/NotNaturalSelection/back4lab4</a>
        </p>
    </div>
    );
}