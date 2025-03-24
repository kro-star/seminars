import {observer} from "mobx-react-lite";

interface IButtonProps{
    title: string;
    type: 'delete' | 'update' | 'add' | 'cancle';
    fun: (id?: string) => Promise<void> | void;
    id? : string
}
const Button = observer(({title, type, fun, id}: IButtonProps) => {
    const handleOnClick = () => {
        if (id){
            fun(id);
        } else {
            fun();
        }
    }
    return <button className={ type ? 'btn btn-'+ type : 'btn'} onClick={handleOnClick}>{title}</button>
});

export default Button;