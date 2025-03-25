
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../store/RootStoreProvider';
import {useCallback, useEffect, useState} from "react";
import CardSeminar from "./CardSeminar";
import Button from "./Button";
import ModalWindow from "./ModalWindow";
import {Preloader} from "./Preloader";

const SeminarsList = observer(() => {
    const { seminarsStore } = useRootStore();
    const {error, loadSeminars, seminars, deleteSeminar,visibleSeminars,toggleShowInfo, setVisibleSeminars,showInfo, toggleShowModal, showModal,loading,checkHasMore, hasMore,seminarsPerPage, page, setPage } = seminarsStore;


    const [isloadingVisibleSeminars, setIsLoadingVisibleSeminars] = useState(true);





    const handleModalWindow = () => {
        toggleShowModal();

    }

    const lastSeminarRef = useCallback(
        (node) => {
            if (loading) return;
            if (node) {
                const observer = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting) {
                        setIsLoadingVisibleSeminars(false);
                            setPage((prevPage) => prevPage + 1);
                            setVisibleSeminars();
                            setIsLoadingVisibleSeminars(true);
                            checkHasMore();
                    }
                });
                observer.observe(node);
            }
        },
        [seminarsStore]
    );

    useEffect(() => {
        loadSeminars();
    }, []);

    useEffect(()=>{
        checkHasMore();
        hasMore && setVisibleSeminars();
    }, [seminars, lastSeminarRef]);



    return (
        <div className="seminars">

            {showModal && <ModalWindow   /> }
            {showInfo && <ModalWindow   /> }
            <h1>Семинары</h1>

            {loading ? <Preloader /> : (
                visibleSeminars && visibleSeminars.length > 0 ? ( isloadingVisibleSeminars ?
                    visibleSeminars.map((seminar, index) => {
                        const isLastSeminar = index === visibleSeminars.length - 1;
                        return (
                            <div key={seminar.id} ref={isLastSeminar ? lastSeminarRef : null}>
                                <CardSeminar seminar={seminar} key={seminar.id} />
                            </div>
                        );
                    }) : <Preloader />
                ) : (
                    <div>Нет семинаров</div>
                )
            )}
            {
                !showModal &&
                <Button title="Добавить семинар" type='add' fun={handleModalWindow} />
            }
            {error && <div className="error-store">Ошибка: {error}</div>}
        </div>


    );
});

export default SeminarsList;
