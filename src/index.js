import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import schemaFolders from './schemaFolders';

ReactDOM.render(<App
    schemaFolders={schemaFolders} />,
    document.getElementById('root'));

serviceWorker.unregister();
