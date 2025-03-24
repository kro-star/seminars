
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../store/RootStoreProvider';
import {useCallback, useEffect, useState} from "react";
import CardSeminar from "./CardSeminar";
import Button from "./Button";
import ModalWindow from "./ModalWindow";
import {Preloader} from "./Preloader";

const SeminarsList = observer(() => {
    const { seminarsStore } = useRootStore();
    const {error, loadSeminars, seminars, deleteSeminar, ToggleShowModal, showModal,loading, hasMore,seminarsPerPage, page, setPage } = seminarsStore;

    const [visibleSeminars, setVisibleSeminars] = useState([]);

    useEffect(() => {
        loadSeminars();
    }, [seminarsStore]);

    useEffect(()=>{
        console.log('seminars', seminars);
        console.log('loading',loading);
        setVisibleSeminars(seminars.slice(0, page * seminarsPerPage));

    }, [seminars, page]);



    const handleModalWindow = () => {
        ToggleShowModal();
    }

    const lastSeminarRef = useCallback(
        (node) => {
            if (loading) return;
            if (node) {
                const observer = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting) {
                        setPage(page + 1);
                    }
                });
                observer.observe(node);
            }
        },
        [seminarsStore]
    );
    /*const lastSeminarRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage(page + 1);
                    const endSeminar = page * seminarsPerPage;
                    endSeminar > seminars.length ? setVisibleSeminars(seminars) :
                    setVisibleSeminars(seminars.slice(0,endSeminar));
                }
            });
            if (node) observer.current.observe(node);
        },
        [page, visibleSeminars]
    );*/

    return (
        <div className="seminars">

            {showModal && <ModalWindow   /> }
            <h1>Семинары</h1>

            {loading ? <Preloader /> : (
                seminars && seminars.length > 0 ? (
                    seminars.map((seminar, index) => {
                        return (
                            <div key={seminar.id}>
                                <CardSeminar seminar={seminar} key={seminar.id} />
                            </div>
                        );
                    })
                ) : (
                    <div className="no-seminars">Нет семинаров</div>
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


/*
 {loading ? <Preloader /> : (
                seminars && seminars.length > 0 ? (
                    seminars.map((seminar, index) => {
                        const isLastSeminar = index === seminars.length - 1;
                        return (
                            <div key={seminar.id} ref={isLastSeminar ? lastSeminarRef : null}>
                                <CardSeminar seminar={seminar} key={seminar.id} />
                            </div>
                        );
                    })
                ) : (
                    <div>Нет семинаров</div>
                )
            )}
 */