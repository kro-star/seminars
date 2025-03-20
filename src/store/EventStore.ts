import {makeAutoObservable} from 'mobx';

export interface ISeminar {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    photo: string;
}

class SeminarsStore {
    seminars: ISeminar[] = [];
    loading: boolean = false;
    error: string = '';

    constructor() {
        makeAutoObservable(this);
    }

   loadSeminars = async () => {
        this.loading = true;
        try {
            //const url = process.env.URL_API;
            const responce = await fetch('http://localhost:3000/seminars', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!responce.ok) {
                throw new Error(`HTTP error! status: ${responce.status}`);
            }
                const data =  responce.json();
            this.seminars = await data;


        } catch (e) {
            console.error('Ошибка загрузки семинаров:', e);
            this.loading = false;
        } finally {
            this.loading = false;
        }
    }
     addSeminar = async (newSeminar: Omit<ISeminar, 'id'>)=> {
        this.loading = true;
        this.error = null;

        try {
            const response = await fetch('http://localhost:3000/seminars', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSeminar),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
            }

            const addedSeminar = await response.json();
            this.seminars.push(addedSeminar);
        } catch (error: any) {
            this.error = error.message;
            console.error('Ошибка добавления семинара:', error);
        } finally {
            this.loading = false;
        }
    }


    // Удаление семинара
     deleteSeminar = async (id: string)  => {
        this.loading = true;
        this.error = null;
        try {
            const response = await fetch(`http://localhost:3000/seminars/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
            }
            this.seminars = this.seminars.filter(seminar => seminar.id !== id);
        } catch (error: any) {
            this.error = error.message;
            console.error('Ошибка удаления семинара:', error);
        } finally {
            this.loading = false;
        }
    }


    updateSeminar = async (updatedSeminar: ISeminar)=> {
        this.loading = true;
        this.error = null;
        try {
            const response = await fetch(`http://localhost:3000/seminars/${updatedSeminar.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedSeminar),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
            }
            const updated = await response.json();

            this.seminars = this.seminars.map(seminar =>
                seminar.id === updatedSeminar.id ? updated : seminar
            );
        } catch (error: any) {
            this.error = error.message;
            console.error('Ошибка обновления семинара:', error);
        } finally {
            this.loading = false;
        }
    }

}

export default SeminarsStore;

