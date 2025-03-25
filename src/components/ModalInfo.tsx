import {observer} from "mobx-react-lite";
import Button from "./Button";
import {useRootStore} from "../store/RootStoreProvider";
import {useState} from "react";


const ModalInfo = observer(() => {

    const {seminarsStore} = useRootStore();
    const {
        deleteSeminar,
        newUpdateSeminar,
        clearNewUpdateSeminar,
        updateSeminar,
        seminars,
        showInfo,
        toggleShowModal,
        toggleShowInfo,
        showModal,
        updateNewUpdateSeminar
    } = seminarsStore;

    const [text, setText] = useState('Вы действительно хотите удалить ');
    const [isVisibleInfo, setIsVisibleInfo] = useState(false);
    const handleCloseWindow = () => {
        toggleShowInfo();
    }

    const handleDelete = () => {
        deleteSeminar(newUpdateSeminar.id);
        setText('Семинар удалён');
        clearNewUpdateSeminar();
    }

    return <div className="modal-body-info-text">

        <div style={{paddingBottom: '1rem'}}>
                {text}{newUpdateSeminar.title}{text !== 'Семинар удалён' ? '?' : '.'}
        </div>

        <div className="seminars-cards-item-info-buttons">
            {text !== 'Семинар удалён' && <Button title='Отмена' type='cancle' fun={handleCloseWindow}/>}
            <Button title={text !== 'Семинар удалён' ? "Удалить" : " Ok"} type='update'
                    fun={text !== 'Семинар удалён' ? handleDelete : handleCloseWindow}/>
        </div>
    </div>

})


export default ModalInfo;