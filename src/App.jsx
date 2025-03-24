import React from 'react';
import SeminarsList from './components/SeminarsList.js';
import RootStoreProvider from './store/RootStoreProvider';
import  './assets/scss/vars.scss';

function App() {
    return (
        <RootStoreProvider>
                <SeminarsList />
        </RootStoreProvider>
    );
}

export default App;