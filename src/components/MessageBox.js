import React, { Component } from 'react';
import './MessageBox.css';

export default class MessageBox extends Component {

    render() {
        const { openMessage } = this.props;
        let body;
        if (openMessage === undefined) return <div/>
        else {
            try {
                if (openMessage.body !== null) {
                    if (openMessage.body.indexOf('redd.it') !== -1 ) {
                        if (openMessage.body.indexOf('jpg') !== -1 || openMessage.body.indexOf('png') !== -1  || openMessage.body.indexOf('gif') !== -1) {
                            body = <img className="message-img" src={openMessage.body} style={{maxWidth: '1000px'}} alt="Animal" />;
                        }
                        else
                            body = <video style={{maxWidth: '1000px', minWidth: '480px'}} controls>
                                        <source src={openMessage.body} type="video/mp4"/>
                                            Your browser does not support HTML5 video.
                                    </video>;
                    }
                    else
                        body = <span style={{padding: '28px'}}><a href={openMessage.body} target="_blank" rel="noopener noreferrer">View post</a></span>
                }
                else
                    body = <div/>
            }
            catch(err) {
                body = <div/>;
            }

        return (
            <div className="message-cntr">
                <div className="message-cntr-scroll">
                    <div className="message-tlbr">
                        <span style={{padding: '10px'}}>From: {this.props.openMessage.from}</span>
                        <span style={{padding: '10px'}}>Subject: {this.props.openMessage.subject}</span>
                    </div>
                    <div className="message">
                        {body}
                    </div>
                </div>
            </div>
        );}
    }
}