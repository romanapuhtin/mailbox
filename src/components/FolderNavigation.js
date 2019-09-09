import React, { Component } from 'react';
import './FolderNavigation.css';

export default class FolderNavigation extends Component {
  
  handleSetCurrentFolderID = (id) => {
      this.props.setCurrentFolderID(id);
  }

  render() {
    return (
      <div className="folder-nav">
        {this.props.folders.map(item => {
          return (
            <div
              key={item.id}
              className={`folder-ntf${this.props.currentFolderID === item.id ? ' current' : ''}`}
                onClick={() => this.handleSetCurrentFolderID(item.id)} >
              <span className="folder-ntf__name">{item.name}</span>
              <span className="folder-ntf__unread">{item.messages.unread > 0 ? item.messages.unread : false}</span>
              <span className="folder-ntf__slash">{item.messages.unread > 0 ? '/' : false}</span>
              <span className="folder-ntf__total">{item.messages.total > 0 ? item.messages.total : false}</span>
            </div>
          ); 
        })}
      </div>
    );
  }
}

