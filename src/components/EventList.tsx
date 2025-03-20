
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../store/RootStoreProvider';
import {useEffect} from "react";

const EventList: React.FC = observer(() => {
    const { seminarsStore } = useRootStore();
    const { loadSeminars, seminars,deleteSeminar } = seminarsStore;

    useEffect(()=>{
        loadSeminars();
    }, [])

    return (
        <ul>
            {seminars.length > 0 ? seminars.map(event => (
                <li key={event.id}>
                    {event.title} - {event.date}
                    <button onClick={() => deleteSeminar(event.id)}>Delete</button>
                    <button onClick={() => loadSeminars()}>load</button>
                </li>
            )) : ''}
        </ul>
    );
});

export default EventList;