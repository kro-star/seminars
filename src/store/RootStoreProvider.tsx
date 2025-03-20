import  { createContext, useContext } from 'react';
import { useLocalObservable } from 'mobx-react-lite';
import RootStore from './RootStore';

const RootStoreContext = createContext<RootStore | null>(null);

export const useRootStore = (): RootStore => {
    const store = useContext(RootStoreContext);
    if (!store) {
        throw new Error('useRootStore must be used within RootStoreProvider');
    }
    return store;
};

interface RootStoreProviderProps {
    children: React.ReactNode;
}

const RootStoreProvider: React.FC<RootStoreProviderProps> = ({ children }) => {
    const store = useLocalObservable(() => new RootStore());

    return (
        <RootStoreContext.Provider value={store}>
            {children}
        </RootStoreContext.Provider>
    );
};

export default RootStoreProvider;