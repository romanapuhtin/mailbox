import React, { Component } from 'react';
import './App.css';

import SearchBox from './components/SearchBox';
import FolderNavigation from './components/FolderNavigation';
import ReadingPaneToolbar from './components/ReadingPaneToolbar';
import ReadingPane from './components/ReadingPane';
import MessageBox from './components/MessageBox';

const serverURL = `https://www.reddit.com/r/aww/new.json`

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            error: null,
            isLoaded: false,
            result: null,

            //all received messages
            storedMessages: [],
            //messages depending on the selected folder and filter
            displayedMessages: [],

            //filter
            filterText: '',
            
            //if at least one message is selected
            isMessageSelected: false,

            //container of all folders
            folders: this.props.schemaFolders,
            currentFolderID: 0,



            stateToolbarComponents: {
                checkboxIsChecked : false,
                close: false,
                select: true,
                move: true
            },

            //to open a message
            isOpenedMessage: false,
            currentMessageID : null,
            nextIsOpenedMessage: true
        };
    }

    //update messages depending on the selected folder and filter
    updateDisplayedMessages() {
        this.setState((prevState) => {
            let { storedMessages, filterText, displayedMessages, currentFolderID } = prevState;
            displayedMessages = storedMessages.filter((messageItem) => {
                if (messageItem.subject.toLowerCase().indexOf(filterText) === -1 &&
                    messageItem.from.toLowerCase().indexOf(filterText) === -1)
                    return false;
                if (messageItem.folderID !== currentFolderID)
                    return false;
                return messageItem;
            });
            return {displayedMessages: displayedMessages};
        });
    }

    //set toolbar's checkbox state
    setToolbarCheckboxState = (isChecked) => {
        this.setState((prevState) => {
            return {stateToolbarComponents: {
                ...prevState.stateToolbarComponents,
                ...prevState.stateToolbarComponents.checkboxIsChecked = isChecked }}});
    }

    //set filter by words
    filterTextChange = (filterText) => {
        this.setState({ filterText: filterText });
    }

    //set current folder ID
    setCurrentFolderID = (currentFolderID) => {
        this.setState({ currentFolderID: currentFolderID });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.filterText !== this.state.filterText)
            this.updateDisplayedMessages();
        if (prevState.currentFolderID !== this.state.currentFolderID) {
            this.updateDisplayedMessages();
            this.selectMessages('UNSELECT_ALL');
        }
    }    

    //select displayed message
    selectMessage = (messageID) => {
        this.setState((prevState) => {
            prevState.displayedMessages.forEach((item) => {
                if (item.id === messageID) {
                    item.isSelected = !item.isSelected;
                }
            });
            return { displayedMessages: prevState.displayedMessages };
        });
    }

    //select multiple displayed messages
    selectMessages = (filter) => {
        this.setState((prevState) => {
            switch (filter.toUpperCase()) {
                case 'ALL':
                    prevState.displayedMessages.forEach((message) => {
                        if (message.folderID === prevState.currentFolderID)
                            message.isSelected = true;
                    });
                    this.setToolbarCheckboxState(true);
                    return {displayedMessages: prevState.displayedMessages};
                case 'NONE':
                    prevState.displayedMessages.forEach((message) => {
                        if (message.folderID === prevState.currentFolderID)
                            message.isSelected = false;
                    });
                    this.setToolbarCheckboxState(false);
                    return {displayedMessages: prevState.displayedMessages};
                case 'READ':
                    prevState.displayedMessages.forEach((message) => {
                        if (message.folderID === prevState.currentFolderID)
                            message.isRead === true ? message.isSelected = true : message.isSelected = false;
                    });
                    this.setToolbarCheckboxState(false);
                    return {displayedMessages: prevState.displayedMessages};
                case 'UNREAD':
                    prevState.displayedMessages.forEach((message) => {
                        if (message.folderID === prevState.currentFolderID)
                            message.isRead === false ? message.isSelected = true : message.isSelected = false;
                    });
                    this.setToolbarCheckboxState(false);
                    return {displayedMessages: prevState.displayedMessages};
                case 'UNSELECT_ALL':
                    prevState.displayedMessages.forEach((message) => {
                        message.isSelected = false;
                    });
                    return {displayedMessages: prevState.displayedMessages};
                default:
                    break;
            }
        });
    }

    //move messages
    moveMessages = (folderName) => {
        this.setState((prevState) => {
            for (let selectedMessage of prevState.displayedMessages) {
                if (selectedMessage.isSelected) {
                    for(let message of prevState.storedMessages) {
                        if(selectedMessage.id === message.id) {
                            for(let folder of prevState.folders) {
                                if (folder.name === folderName) {
                                    message.folderID = folder.id;
                                }
                            }
                        }
                    }
                }
            }
            return {storedMessages: prevState.storedMessages} 
        });
        this.selectMessages('UNSELECT_ALL');
        this.updateFolders();
        this.updateDisplayedMessages();
    }

    //show toolbar's control elements
    toolbarOps = (action) => {
        switch (action.toLowerCase()) {
            case 'read_message':
                this.setState({stateToolbarComponents: {checkboxIsChecked: false, close: true, select: false, move: false}});
                break;
            case 'list_messages':
                this.setState({stateToolbarComponents: {checkboxIsChecked: false, close: false, select: true, move: true}});
                break;
            default:
                break;
        }
    }

    messageOpenToolbar = (action) => {
        switch (action.toLowerCase()) {
            case 'close':
                this.setState({nextIsOpenedMessage: false});
                break;
                case 'open':
                    this.setState({nextIsOpenedMessage: true});
                    this.toolbarOps('list_messages');
                    break;
                default:
                    break;
        }
    }

    openMessage = (action, messageID) => {
        this.setState((prevState) => {
            if (action.toLowerCase() === 'open') {
                for (let itemMessages of prevState.storedMessages) {
                    if(messageID === itemMessages.id){
                        itemMessages.isRead = true;
                    }
                }
                return {isOpenedMessage: true, currentMessageID: messageID, storedMessages:prevState.storedMessages};
            }
            else 
                return {isOpenedMessage: false, currentMessageID: messageID} ;
        });
        this.updateFolders();
        this.updateDisplayedMessages();
    }

    //set updated messages state
    updateStoredMessages(json) {
        //if message state is empty
        if (this.state.storedMessages.length === 0) {
            this.setState({
                storedMessages: json.data.children.map((jsonChild, index) => {
                    let body = null;
                    try {
                        if (jsonChild.data.domain.indexOf('redd.it') !== -1 ) {
                            if (jsonChild.data.is_video) {
                                body = jsonChild.data.media.reddit_video.fallback_url
                            }
                            else
                                body = jsonChild.data.url
                        }
                        else
                            body = jsonChild.data.url
                    }
                    catch(err) {
                        body = null;
                    }
                    return {
                        id: jsonChild.data.id,
                        folderID: 0,
                        from: `${jsonChild.data.author.toLowerCase()}@${jsonChild.data.domain}`,
                        created_utc: `${jsonChild.data.created_utc}000`,
                        subject: jsonChild.data.title,
                        body: body,
                        isSelected: false,
                        isRead: false
                    }
                })
            });
        }
        //if messages already exist
        else {
            let _prevStateMessages = this.state.storedMessages;
            let _newMessages = [];
            json.data.children.forEach((jsonChild) => {
                let isIdEqual = false;
                for (let item of _prevStateMessages) {
                    if (item.id === jsonChild.data.id) {
                        isIdEqual = true;
                        break;
                    }
                }
                if (!isIdEqual) {
                    let body = null;
                    try {
                        if (jsonChild.data.domain.indexOf('redd.it') !== -1 ) {
                            if (jsonChild.data.is_video) {
                                body = jsonChild.data.media.reddit_video.fallback_url
                            }
                            else
                                body = jsonChild.data.url
                        }
                        else
                            body = jsonChild.data.url
                    }
                    catch(err) {
                        body = null;
                    }

                    _newMessages.push(
                        {
                            id: jsonChild.data.id,
                            folderID: 0,
                            from: `${jsonChild.data.author.toLowerCase()}@${jsonChild.data.domain}`,
                            created_utc: `${jsonChild.data.created_utc}000`,
                            subject: jsonChild.data.title,
                            body: body,
                            isSelected: false,
                            isRead: false
                        }
                    );
                    isIdEqual = false;
                }
            });
            //if new messages are received
            if (_newMessages.length) {
                this.setState({
                    storedMessages: [..._newMessages, ..._prevStateMessages]
                });
            }
        }
    }

    //set folders to current value (total, unread)
    updateFolders = () => {
        this.setState((prevState) => {
            prevState.folders.forEach((folder) => {
                folder.messages.total = 0;
                folder.messages.unread = 0;
            });
            for (let itemMessage of prevState.storedMessages) {
                //number of unread and total messages
                if (itemMessage.isRead === false) {
                    for (let itemFolder of prevState.folders) {
                        if (itemMessage.folderID === itemFolder.id) {
                            itemFolder.messages.unread += 1;
                            itemFolder.messages.total += 1;
                            break;
                        }
                    }
                }
                //number of total messages
                else {
                    for (let itemFolder of prevState.folders) {
                        if (itemMessage.folderID === itemFolder.id) {
                            itemFolder.messages.total += 1;
                            break;
                        }
                    }
                }
            }
            return {
                folders: prevState.folders
            }
        });
    }

    fetchData(url) {
        fetch(url)
            .then(res => res.json())
            .then((result) => {
                this.updateStoredMessages(result);
                this.updateDisplayedMessages();
                this.updateFolders();
                this.setState({
                    isLoaded: true
                });
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            })
    }

    componentDidMount() {
        this.fetchData(serverURL);
        this.timerID = setInterval(
            () => this.fetchData(serverURL),
            10000
          );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
        this.timerID = null;
    }

    render() {
        const { error, isLoaded } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            
        const { storedMessages, displayedMessages } = this.state;

        let openMessage = [];
        let readMessage = {};
        if (this.state.isOpenedMessage) {
            openMessage = this.state.displayedMessages.filter(value => {
                return value.id === this.state.currentMessageID;
            });
            openMessage = openMessage[0];
            readMessage = <MessageBox openMessage={openMessage} />
        }
        else
            readMessage = <div/>;


        let arrFolderNames = [];
        this.state.folders.forEach(folder => {
            if (folder.id !== this.state.currentFolderID)
                arrFolderNames.push(folder.name);
        });

        const arrFilterNames =  ['All', 'None', 'Read', 'Unread'];

        return (
            <div className="main">
                <header>
                    <div className="head">
                        <SearchBox
                            filterText={this.state.filterText}
                            filterTextChange={this.filterTextChange}
                        />
                    </div>
                </header>
                <section>
                    <div className="body">
                        <div className="side">
                            <FolderNavigation
                                folders={this.state.folders}
                                setCurrentFolderID={this.setCurrentFolderID}
                                currentFolderID={this.state.currentFolderID}
                            />
                        </div>
                        <div className="wall">
                            <div className="wall-toolbar">
                                <ReadingPaneToolbar
                                    setCheckbox={this.setToolbarCheckboxState}
                                    folderNames={arrFolderNames}
                                    filterNames={arrFilterNames}
                                    selectMessages={this.selectMessages}
                                    moveMessages={this.moveMessages}
                                    stateToolbarComponents={this.state.stateToolbarComponents}
                                    messageOpenToolbar={this.messageOpenToolbar}
                                    displayedMessagesLength={this.state.displayedMessages.length}
                                />
                            </div>
                            <div className="wall-feed">
                                <ReadingPane
                                    messages={this.state.displayedMessages}
                                    selectMessage={this.selectMessage}
                                    openMessage={this.openMessage}
                                    toolbarOps={this.toolbarOps}
                                    messageOpenToolbar={this.messageOpenToolbar}
                                    isOpenMessage={this.state.nextIsOpenedMessage}
                                    render={currentMessage => (<MessageBox openMessage={currentMessage} />)}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            
            );
        }
    }
}