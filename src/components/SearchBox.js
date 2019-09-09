import React, { Component } from 'react';
import './SearchBox.css';

export default class SearchBox extends Component {
    constructor(props) {
        super(props);
        this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    }

    handleFilterTextChange(e) {
        this.props.filterTextChange(e.target.value);
    }

    render() {
        return (
            <div className = "searchbox" >   
                <input
                    type="text"
                    name="search"
                    placeholder="Search mail..."
                    value={this.props.filterText}
                    onChange={this.handleFilterTextChange}
                /> 
            </div> 
        );
    }
}