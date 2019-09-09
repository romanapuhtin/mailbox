import React, { Component } from 'react';
import './ReadingPaneToolbar.css';

export default class ReadingPaneToolbar extends Component {
    constructor(props) {
        super(props);
        this.selectContainer = React.createRef();
        this.movetoContainer = React.createRef();
    }
    //checkboxIsChecked
    handleClickFilters = (filter) => {
        if (this.props.isMessageSelected)
            this.setState({isSelected: true})
        else {
            this.setState({isSelected: false});
        }

        this.props.selectMessages(filter);

        const className = this.selectContainer.current.className;
        this.selectContainer.current.className = 'invisible';
        setTimeout(() => { this.selectContainer.current.className = className; }, 1000);
    }

    handleChangeCheckbox = () => {
        this.props.setCheckbox(!this.props.stateToolbarComponents.checkboxIsChecked);
        this.props.stateToolbarComponents.checkboxIsChecked ?
            this.props.selectMessages('NONE') :
            this.props.selectMessages('ALL'); 
    }

    handleClickMoveto = (folder) => {
        this.props.moveMessages(folder);
        this.props.setCheckbox(false);

        const className = this.movetoContainer.current.className;
        this.movetoContainer.current.className = 'invisible';
        setTimeout(() => { this.movetoContainer.current.className = className; }, 1000);
    }

    render() {
        const elementsNavFilters = this.props.filterNames.map((filter) =>
            <span
                key={filter}
                onClick={() => this.handleClickFilters(filter)}>
                {filter}
            </span>
        );
        const elementsNavFolders = this.props.folderNames.map((folderName) =>
            <span
                key={folderName}
                onClick={() => this.handleClickMoveto(folderName)}>
                {folderName}
            </span>
        );
            
        return (
            <div className={this.props.stateToolbarComponents.close ? 'reading-pane-tlbr center' : 'reading-pane-tlbr'} >
                <div
                    onClick={() => this.props.messageOpenToolbar('close')}
                    className={this.props.stateToolbarComponents.close ? 'reading-pane-tlbr-close' : 'invisible'}>
                    <i className="material-icons">clear</i>
                    <span>  CLOSE</span>
                </div>
                <div className={this.props.stateToolbarComponents.select ? 'checkbox-btn-dropdown' : 'invisible'}>
                    <label className="checkbox">
                        <input 
                            disabled={this.props.displayedMessagesLength > 0 ? false : true}
                            type="checkbox"
                            checked={this.props.stateToolbarComponents.checkboxIsChecked}
                            onChange={this.handleChangeCheckbox}
                        />
                        <span className="checkmark"></span>
                    </label>
                    <div className="btn-dropdown">
                        <button >
                            <i className="material-icons">arrow_drop_down</i>
                        </button>
                        <div className="dropdown" ref={this.selectContainer}>
                            {elementsNavFilters}
                        </div>
                    </div>
                </div>
                <div className={this.props.stateToolbarComponents.move ? 'move-to' : 'invisible'}>
                    <i className="material-icons">folder_open</i>
                    <span> MOVE TO</span>
                    <div className="dropdown" ref={this.movetoContainer}>
                        {elementsNavFolders}
                    </div>
                </div>
            </div>
        );
    }
}