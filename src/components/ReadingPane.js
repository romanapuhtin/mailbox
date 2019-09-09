import React, { Component, Fragment } from 'react';
import './ReadingPane.css';

export default class ReadingPane extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: {},
            isDisplayMessageBody: false
        }
    }

    сlickOnTableCheckBox = (e, messageID) => {
        e.stopPropagation(); 
        this.props.selectMessage(messageID);
    }

    onChange() {
        //---
      }

    componentDidUpdate() {
        let { isDisplayMessageBody } = this.state;
        let { isOpenMessage, messageOpenToolbar } = this.props;

        if (!isOpenMessage && isDisplayMessageBody) {
            this.setState({
                isDisplayMessageBody: false,
                message: undefined
            });
        messageOpenToolbar('open');
        }
    }

    render() {
        let { message, isDisplayMessageBody } = this.state;
        let { messages } = this.props;
        
        let rowTable = messages.map((item, index) =>
            <Fragment key={index}>
                <tr
                    key={item.id}
                    onClick={() => {
                        this.setState({
                            message: item,
                            isDisplayMessageBody: true
                        });
                        this.props.toolbarOps('READ_MESSAGE');
                        this.props.openMessage('OPEN', item.id); } }
                    >
                    <td className="td1">
                        <input
                            type="checkbox"
                            key={item.id}
                            checked={item.isSelected}
                            onChange={() => this.onChange()}
                            onClick={(e) => this.сlickOnTableCheckBox(e, item.id)}
                        />
                    </td>
                    <td className="td2" style={item.isRead ? {fontWeight: 'normal'} : {fontWeight: 'bold'}}>{item.from}</td>
                    <td className="td3" style={item.isRead ? {fontWeight: 'normal'} : {fontWeight: 'bold'}}>{item.subject}</td>
                </tr>
            </Fragment>
        );

        return (
            <div style={{position: 'relative', width: '100%', height: '100%'}}>
                <div className="reading-pane">
                    <div className="message-pane">
                        <table id="myTable">
                            <tbody>
                                {rowTable}
                            </tbody>
                        </table>
                    </div>
                </div>
                {isDisplayMessageBody ? this.props.render(message): false}
            </div>
        );
    }
}