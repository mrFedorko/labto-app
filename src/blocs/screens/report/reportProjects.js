import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useOutletContext } from 'react-router-dom'
import { useProjectReportMutation } from '../../../redux/api/reportApi'
import { sMessageCh } from '../../../redux/store/sMessageSlice'
import { CustomSelect } from '../../customSelect/customSelect'
import { ReportColumnItem, ReportReagItem } from './reportItem'



export const ReportProjects = (props) => {
    const [initialise, setInitialise] = useState(false)
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [project, setProject] = useState({
        name: '',
        code: '',
    })
    const [current, setCurrent] = useState('reag') // 'reag' | 'rs' | 'subst' | 'column' 

    const {projects} = useSelector(state => state.project); 
    const dispatch = useDispatch();

    const [ createReport, {data, isLoading, isSuccess}] = useProjectReportMutation();

    const handleCreateReport = () => {
        if (!endDate || !startDate || !project.code) return dispatch(sMessageCh('Заполните все поля формы!'));
        console.log('click trigger')
        createReport({startDate, endDate, project});
    }


    const handleSelectProject = (target) => {
        setProject(target.value)
    }

    const projectOptions = projects.map(item => {
        return { value: {code: item.code, name: item.name}, label: `${item.code}, ${item.name}`}
    });

    const handleActive = (v) => {
        if(v === current) return "filter__item filter__item_active"
        return "filter__item"
    }
   
    let ReagentTable = <>
        <table table className="table__wrap"> 
            <thead>     
                <tr>
                    <th>№</th>
                    <th>дата</th>
                    <th>Пользователь</th>
                    <th style={{minWidth:'120px'}}>Анализ</th>
                    <th>Вещество</th>
                    <th>Количество</th>
                    <th>Стоимость</th>
                </tr>
            </thead>
            <tbody>
                {isSuccess && data?.resultReags?.filter(item => item.type === current).map((item, index) => {
                    const {itemId, date, userName, test, name, quan, units, price} = item;

                   return <ReportReagItem
                        index = {index}
                        key = {itemId}
                        date = {date}
                        userName = {userName}
                        test = {test}
                        name = {name}
                        quan = {quan}
                        units = {units}
                        price = {price}
                    />
                })}

            </tbody>
            
        </table>
    </>
    let ColumnTable = <>
        <h6>Стоимость из рассчета pecypca колонки 40000 инжекций</h6>
        <table table className="table__wrap"> 
            <thead>     
                <tr>
                    <th>№</th>
                    <th>Период</th>
                    <th>Пользователь</th>
                    <th style={{minWidth:'120px'}}>Анализ</th>
                    <th>Колонка</th>
                    <th>Тип</th>
                    <th>Инжекций</th>
                    <th>Стоимость</th>
                </tr>
            </thead>
            <tbody>
                {isSuccess &&  data?.resultColumns?.map((item, index) => {
                    const {itemId, type, sn, name, userName, countInj, test, fromDate, toDate, price} = item;
                    return <ReportColumnItem
                        itemId = {itemId}
                        key = {itemId}
                        type = {type}
                        sn = {sn}
                        name = {name}
                        userName = {userName}
                        countInj = {countInj}
                        test = {test}
                        fromDate = {fromDate}
                        toDate = {toDate}
                        price = {price}
                        index = {index}
                    />
                })}

            </tbody>
            
        </table>
    </>

    return(
        <div className="report">
            <div className="filter"style={{padding:'15px', paddingBottom:'0px', position:'relative', width:'100%'}}>
                <h5 style={{marginBottom:'30px'}}>Задайте период и интересующий проект</h5>

                <div className="filter__wrap" style={{marginBottom:'5px'}}>
                    <div className="filter__inputs" >
                        <div className="filter__inner" style={{marginBottom:'10px', marginRight:'20px'}}>
                            <div className="filter__label">От</div>
                            <input 
                                type="date" 
                                className="filter__input" 
                                style={{height:'33px'}}
                                onChange = {(e) => {setStartDate(e.target.value)}}
                                value = {startDate}
                            />
                        </div>

                        <div className="filter__inner" style={{marginBottom:'10px', marginRight:'20px'}}>
                            <div className="filter__label">До</div>
                            <input 
                                type="date" 
                                className="filter__input" 
                                style={{height:'33px'}}
                                onChange = {(e) => {setEndDate(e.target.value)}}
                                value = {endDate}
                            />
                        </div>

                        <div className="filter__inner" style={{marginBottom:'10px', marginRight:'20px'}} >
                            <div className="filter__label">Проект</div>
                            <CustomSelect
                                initialise = {initialise}
                                setInitialise = {setInitialise}
                                handleChange = {handleSelectProject}
                                height = {'25px'}
                                fontSize = {'12px'}
                                width = {'250px'}
                                options = {projectOptions}
                            /> 
                        </div>
                    </div>
                    <button className="btn" style={{height:'33px'}} onClick={handleCreateReport}>Создать отчет</button>  
                </div>

                <div className="filter__wrap" style={{marginTop:'5px', marginBottom:'10px', marginRight:'120px'}}>
                    {(isSuccess && data?.resultReags && data.resultColumns) && <><div 
                        className = {handleActive('reag')}  
                        style={{marginTop:'5px'}}
                        onClick = {() => {setCurrent('reag')}}
                    >Реактивы</div>
                    <div 
                        className = {handleActive('rs')}  
                        style={{marginTop:'5px'}}
                        onClick = {() => {setCurrent('rs')}}
                    >Стандарты</div>
                    <div 
                        className = {handleActive('subst')}  
                        style={{marginTop:'5px'}}
                        onClick = {() => {setCurrent('subst')}}
                    >Субстанции</div>
                    <div 
                        className = {handleActive('column')}  
                        style={{marginTop:'5px'}}
                        onClick = {() => {setCurrent('column')}}
                    >ВЭЖХ/ГХ</div> </>}
                </div>
                <div className="filter__print">Распечатать</div>
            </div>

            <div className="history overflow overflow__mt50"  style={{height: '60vh'}}>
			 	{(data?.resultReags && current === 'column') && <ColumnTable/>}
			 	{(data?.resultReags && current !== 'column') && <ReagentTable/>}
                {isLoading && <h5>Загрузка отчета...</h5>}
                
			</div>
        </div>
    )
  }