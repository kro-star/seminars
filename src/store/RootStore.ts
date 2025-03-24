import { makeAutoObservable } from 'mobx';
import SeminarsStore from './SeminarsStore';

class RootStore {
    seminarsStore: SeminarsStore;

    constructor() {
        this.seminarsStore = new SeminarsStore();
        makeAutoObservable(this);
    }
}

export default RootStore;