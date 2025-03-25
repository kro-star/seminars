import {action, makeAutoObservable, runInAction} from 'mobx';

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
    showModal: boolean = false;
    showInfo: boolean = false;
    newUpdateSeminar: ISeminar = {
        id: '',
        title: '',
        description: '',
        date: '',
        time: '',
        photo: '',
    };
    page: number = 1;
    seminarsPerPage: number = 5; // показ по 5 семинаров на странице
    visibleSeminars: ISeminar[] = [];
    hasMore: boolean = true;

    constructor() {
        makeAutoObservable(this);
    }

    setSeminars = action((newSeminars: ISeminar[]) => {
        this.seminars = newSeminars;
    });
    setVisibleSeminars = () => {
        if(this.page * this.seminarsPerPage <= (Math.ceil(this.seminars.length/ this.seminarsPerPage) * this.seminarsPerPage))
        {
            const startSeminar = (this.page - 1) * this.seminarsPerPage;
            const endSeminar = this.page * this.seminarsPerPage;
            console.log('startSeminar', startSeminar);
            console.log('endSeminar', endSeminar);
            const newVisibleSeminars: ISeminar[] = (this.seminars.slice(startSeminar, endSeminar));
            console.log('newVisibleSeminars', newVisibleSeminars);
            this.visibleSeminars.push(...newVisibleSeminars);
            console.log('this.visibleSeminars', this.visibleSeminars);
        }
    }
    clearVisibleSeminars = () => {
        this.visibleSeminars = [];
    }


    setPage = action((fn: (prevPage: number) => number) => {
        this.page = fn(this.page);
    });
    checkHasMore = () => {
        this.hasMore = this.seminars.length > this.page * this.seminarsPerPage;
    };
    clearNewUpdateSeminar = () => {
        this.newUpdateSeminar = {
            id: '',
            title: '',
            description: '',
            date: '',
            time: '',
            photo: '',
        }
    }

    updateError = (er: string) => {
        this.error = er;
    }

    updateNewUpdateSeminar = (seminar : ISeminar) => {
        let newDate = seminar.date;
        if (seminar.date){
            const [day, month, year] = seminar.date.split('.');
            newDate = `${year}-${month}-${day}`
        }
        this.newUpdateSeminar = {
            id: seminar.id,
            title: seminar.title,
            description: seminar.description,
            date: newDate,
            time: seminar.time,
            photo: seminar.photo,
        }
    }
    parseDate = (dateString:string) => {
        if(dateString){
            const [day, month, year] = dateString.split('.').map(Number);
            return new Date(year, month - 1, day);
        }
        return new Date();

    }

    parseTime = (timeString: string)=> {
        if(timeString){
            const [hours, minutes] = timeString.split(':').map(Number);
            return hours * 60 + minutes;
        }
        return 0;

    }
    sortSeminars = () => {
        this.seminars.sort((a, b) => {
            const dateA = this.parseDate(a.date);
            const dateB = this.parseDate(b.date);
            const dateComparison = dateA.getTime() - dateB.getTime();

            if (dateComparison === 0) {
                const timeA = this.parseTime(a.time);
                const timeB = this.parseTime(b.time);
                return timeA - timeB;
            }

            return dateComparison;
        });
    }
    toggleShowModal = () => {
        this.showModal = !this.showModal;
    }
    toggleShowInfo = () =>{
        this.showInfo = !this.showInfo;
    }
   loadSeminars = async () => {
       runInAction(() => {
           this.loading = true;
       });
        try {
            const url = process.env.URL_API;
            const responce = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!responce.ok) {
                throw new Error(`HTTP error! status: ${responce.status}`);
            }
            const data = await responce.json();

            runInAction(() => {
                this.setSeminars(data);
            });


        } catch (e) {
            // console.error('Ошибка загрузки семинаров:', e);
            runInAction(() => {
                this.error = e.message;
                this.loading = false;
            });
        } finally {
            runInAction(() => {
                    this.loading = false;
            });
            this.sortSeminars();
            this.clearVisibleSeminars();
            this.setPage(()=> 1);
        }
    }
     addSeminar = async (newSeminar: Omit<ISeminar, 'id'>)=> {
         runInAction(() => {
             this.loading = true;
         });
        this.error = null;
        const seminar = {
            title: newSeminar.title,
            description: newSeminar.description,
            date: newSeminar.date,
            time: newSeminar.time,
            photo: newSeminar.photo,
        }
        try {
            const url = process.env.URL_API;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(seminar),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
            }

            const addedSeminar = await response.json();
            this.seminars.push(addedSeminar);
        } catch (error: any) {
            runInAction(() => {
                this.loading = false;
                this.error = error.message;
            });
            //console.error('Ошибка добавления семинара:', error);
        } finally {
            runInAction(() => {
                this.loading = false;
            });
            this.sortSeminars();
            this.clearVisibleSeminars();
            this.setPage(()=> 1);
            this.setVisibleSeminars();
        }
    }

     deleteSeminar = async (id: string)  => {
         runInAction(() => {
             this.loading = true;
         });
        this.error = null;
        try {
            const url = process.env.URL_API;
            const response = await fetch(`${url}/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
            }
            this.setSeminars(this.seminars.filter(seminar => seminar.id !== id));
        } catch (error: any) {
            this.error = error.message;
            console.error('Ошибка удаления семинара:', error);
        } finally {
            runInAction(() => {
                this.loading = false;
            });
            this.loadSeminars();
            this.clearVisibleSeminars();
            this.setPage(()=> 1);
            this.setVisibleSeminars();

        }
    }


    updateSeminar = async (seminar: ISeminar)=> {
        runInAction(() => {
            this.loading = true;
        });
        this.error = null;
        try {
            const url = process.env.URL_API;
            const response = await fetch(`${url}/${seminar.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(seminar),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
            }
            const updated = await response.json();

            this.setSeminars(this.seminars.map(s =>
                s.id === seminar.id ? updated : s
            ));
        } catch (error: any) {
            this.error = error.message;
            console.error('Ошибка обновления семинара:', error);
        } finally {
            runInAction(() => {
                this.loading = false;
            });
            this.sortSeminars();
            this.clearVisibleSeminars();
            this.setPage(()=> 1);
            this.setVisibleSeminars();
        }
    }

}

export default SeminarsStore;

