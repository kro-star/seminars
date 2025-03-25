import {ISeminar} from "../store/SeminarsStore";
import {useRootStore} from "../store/RootStoreProvider";
import {useEffect, useRef, useState} from "react";
import Button from "./Button";
import {observer} from "mobx-react-lite";
import ModalCreateUpdateSeminar from "./ModalCreateUpdateSeminar";
import ModalInfo from "./ModalInfo";

interface IModalWindow{
    seminar?: ISeminar
}


const ModalWindow = observer(({seminar} : IModalWindow) => {
    const {seminarsStore} = useRootStore();
    const {loading, error, addSeminar, loadSeminars, toggleShowModal, showModal, showInfo, toggleShowInfo, updateError, updateSeminar, newUpdateSeminar, clearNewUpdateSeminar} = seminarsStore;

    const [modalTitle, setModalTitle] = useState('Новый семинар');


    useEffect(() => {
        if (newUpdateSeminar.id !== '') {
            setModalTitle('Редактирование семинара');
            if (showInfo === true){
                setModalTitle('Удаление семинара');
            }
        }
    }, [])

    const handleOpenWindow = () => {
        showModal && toggleShowModal();
        showInfo && toggleShowInfo();
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


    return <div className="modal">
        <div className="modal-container">
            <div className="modal-header">
                <h2>{modalTitle}</h2>
                <button className="modal-close-button" onClick={handleOpenWindow}>
                    <span>&times;</span>
                </button>
            </div>
            <div className="modal-body">
                {showModal && <ModalCreateUpdateSeminar />}
                {showInfo && <ModalInfo seminar={seminar}/>}
            </div>
        </div>
    </div>
})

export default ModalWindow;