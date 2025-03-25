import {useRootStore} from "../store/RootStoreProvider";
import Button from "./Button";
import {ISeminar} from "../store/SeminarsStore";
import ModalWindow from "./ModalWindow";
import {observer} from "mobx-react-lite";
import Image from "./Image";
import ModalInfo from "./ModalInfo";

interface ICardSeminarProps {
    seminar: ISeminar;
}

const CardSeminar = observer(({seminar}: ICardSeminarProps) => {

    const {seminarsStore} = useRootStore();
    const {deleteSeminar, updateSeminar, seminars,showInfo, toggleShowModal,toggleShowInfo, showModal, updateNewUpdateSeminar} = seminarsStore;

    const handleUpdateSeminar = () =>{
        updateNewUpdateSeminar(seminar);
        toggleShowModal();
    }
    const handleDeleteSeminar = () => {
        updateNewUpdateSeminar(seminar);
        toggleShowInfo();
    }


    return (
        <div className="seminars-cards-item">
            <div className="seminars-cards-item-container">
                <div className="seminars-cards-item-img">
                     <Image src={seminar.photo} alt={seminar.title}/>
                </div>

                <div className="seminars-cards-item-info">
                    <div>
                        <h2>{seminar.title}</h2>
                        <h4>{seminar.date} в {seminar.time}</h4>
                        <p>
                            {seminar.description}
                        </p>
                    </div>

                    <div className="seminars-cards-item-info-buttons">
                        <Button title="Удалить" type="delete" fun={handleDeleteSeminar}/>
                        <Button title="Редактировать" type="update" fun={handleUpdateSeminar}/>
                    </div>
                </div>

            </div>
        </div>

    )
});

export default CardSeminar;
