import  { useState } from 'react';
import { useRootStore } from '../store/RootStoreProvider';

const SeminarsForm: React.FC = () => {
    const {seminarsStore} = useRootStore();
    const {loading, error, addSeminar, loadSeminars} = seminarsStore;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [photo, setPhoto] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newSeminar = {
            title,
            description,
            date,
            time,
            photo,
        };

        await addSeminar(newSeminar);
        setTitle('');
        setDescription('');
        setDate('');
        setTime('');
        setPhoto('');
    };

    return (
        <div>
            <h2>Добавить семинар</h2>
            {loading && <p>Добавление...</p>}
            {error && <p style={{color: 'red'}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Название:</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                    <label htmlFor="date">Дата:</label>
                    <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="time">Время:</label>
                    <input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="photo">Фото (URL):</label>
                    <input type="text" id="photo" value={photo} onChange={(e) => setPhoto(e.target.value)}/>
                </div>
                <button type="submit">Добавить семинар</button>
            </form>
        </div>
    );
}

export default SeminarsForm;