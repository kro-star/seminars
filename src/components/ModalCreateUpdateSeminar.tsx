import {useRootStore} from "../store/RootStoreProvider";
import {useEffect, useRef, useState} from "react";
import Button from "./Button";
import {observer} from "mobx-react-lite";


const ModalCreateUpdateSeminar = observer(() => {
    const {seminarsStore} = useRootStore();
    const {
        loading,
        error,
        addSeminar,
        loadSeminars,
        toggleShowModal,
        updateError,
        updateSeminar,
        newUpdateSeminar,
        clearNewUpdateSeminar
    } = seminarsStore;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dateSem, setDateSem] = useState('');
    const [time, setTime] = useState('');
    const [photo, setPhoto] = useState('');
    const [modalTitle, setModalTitle] = useState('Новый семинар');


    const photoRef = useRef(null);
    const dateSemRef = useRef(null);
    const timeRef = useRef(null);
    const descriptionRef = useRef(null);
    const titleRef = useRef(null);

    let initialDate = '';
    useEffect(() => {
        if (newUpdateSeminar.id !== '') {
            setTitle(newUpdateSeminar.title);
            setDescription(newUpdateSeminar.description);
            setDateSem(newUpdateSeminar.date);
            setTime(newUpdateSeminar.time);
            setPhoto(newUpdateSeminar.photo);
            setModalTitle('Редактирование семинара');
        }
    }, [])

    const validation = (): boolean => {
        let val = 0;
        if (title.trim() === '') {
            updateError('Введите не достающие данные');
            const element = document.querySelector('#title');
            element.classList.add('error');
            val++;
        }
        if (description.trim() === '') {
            updateError('Введите не достающие данные');
            const element = document.querySelector('#description');
            element.classList.add('error');
            val++;
        }
        if (dateSem.trim() === '') {
            updateError('Введите не достающие данные');
            const element = document.querySelector('#date');
            element.classList.add('error');
            val++;
        }
        if (time.trim() === '') {
            updateError('Введите не достающие данные');
            const element = document.querySelector('#time');
            element.classList.add('error');
            val++;
        }
        if (photo.trim() === '') {
            updateError('Введите не достающие данные');
            const element = document.querySelector('#photo');
            element.classList.add('error');
            val++;
        }
        if (val > 0) {
            return false;
        } else {
            return true;
        }
    }
    const convertDateFormat = (inputDate: string): string => {
        if (inputDate) {
            const [year, month, day] = inputDate.split('-');
            const result = `${day}.${month}.${year}`;
            return result;
        }
        return '';
    }

    const handleSubmit = async () => {
        if (!validation()) {
            return;
        }
        let newDate;
        if (dateSem.includes('-')) {
            newDate = convertDateFormat(dateSem);
        }
        const newSeminar = {
            id: '',
            title: title,
            description: description,
            date: newDate,
            time: time,
            photo: photo,
        };
        if (newUpdateSeminar.id !== '') {
            newSeminar.id = newUpdateSeminar.id;
            updateSeminar(newSeminar);
        } else {
            addSeminar(newSeminar);
        }

        setTitle('');
        setDescription('');
        setDateSem('');
        setTime('');
        setPhoto('');
        setModalTitle('Новый семинар');
        clearNewUpdateSeminar();
        toggleShowModal();
    };
    const handleOpenWindow = () => {
        toggleShowModal();
        setTitle('');
        setDescription('');
        setDateSem('');
        setTime('');
        setPhoto('');
        setModalTitle('Новый семинар');
        clearNewUpdateSeminar();
    }

    const handleInputChange = (e, setState, inputRef, updateError) => {
        const value = e.target.value;
        setState(value);

        if (value.trim() === '') {
            updateError('Введите недостающие данные');
            if (inputRef.current) {
                inputRef.current.classList.add('error');
            }
        } else {
            updateError('');
            if (inputRef.current) {
                inputRef.current.classList.remove('error');
            }
        }
    };


    return <>
        <div className="modal-body-img">
            <div>
                {
                    photo !== '' ?
                        <img src={photo} alt={title}/> :
                        ''
                }
            </div>

            <div>
                <label htmlFor="photo">Фото (URL):</label>
                <input type="text" id="photo" value={photo} ref={photoRef}
                       onChange={(e) => handleInputChange(e, setPhoto, photoRef, updateError)} required/>
            </div>
        </div>

        <div className="modal-body-info">
            <div className="modal-body-info-text">
                <div>
                    <label htmlFor="title">Название:</label>
                    <input placeholder="Название семинара" type="text" id="title" value={title} ref={titleRef}
                           onChange={(e) => handleInputChange(e, setTitle, titleRef, updateError)} required/>
                </div>
                <div>
                    <label htmlFor="date">Дата:</label>
                    <input type="date" id="date" value={dateSem || initialDate} ref={dateSemRef}
                           onChange={(e) => handleInputChange(e, setDateSem, dateSemRef, updateError)} required/>
                </div>
                <div>
                    <label htmlFor="time">Время:</label>
                    <input type="time" id="time" value={time} ref={timeRef}
                           onChange={(e) => handleInputChange(e, setTime, timeRef, updateError)} required/>
                </div>
                <div>
                    <label htmlFor="description">Описание:</label>
                    <textarea placeholder="Введите описание семинара" id="description" name="description" rows="7"
                              value={description} ref={descriptionRef}
                              onChange={(e) => handleInputChange(e, setDescription, descriptionRef, updateError)}
                              required></textarea>

                </div>
                <div>
                    {error && <p style={{color: 'red'}}>{error}</p>}
                </div>
            </div>

            <div className="seminars-cards-item-info-buttons">
                <Button title='Отмена' type='cancle' fun={handleOpenWindow}/>
                <Button title="Сохранить" type='update' fun={handleSubmit}/>
            </div>


        </div>
    </>
})

export default ModalCreateUpdateSeminar;