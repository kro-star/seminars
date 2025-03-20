import React from 'react';
import EventList from './components/EventList';
import RootStoreProvider from './store/RootStoreProvider';
import SeminarsForm from "./components/EventForm";

function App() {
    return (
        <RootStoreProvider>
            <div>
                <h1>Events</h1>
                <SeminarsForm />
                <EventList />
            </div>
        </RootStoreProvider>
    );
}

export default App;