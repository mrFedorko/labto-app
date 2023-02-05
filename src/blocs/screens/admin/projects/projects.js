import '../admin.scss'
import '../../profile/profile.scss'

import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { ProjectItem } from './projectItem'
import { useGetProjectsQuery } from '../../../../redux/api/projectApi'
import { CustomSelect } from '../../../customSelect/customSelect'

export const Projects = (props) => {
    const [projectActive, setProjectActive] = useState('active')
    const [showAddProject, setShowAddProject] = useState(false);
    const [filterName, setFilterName] = useState('')

    const {data: closedProjects, isSuccess} = useGetProjectsQuery('true')
    console.log(closedProjects)
    const {projects} = useSelector(state => state.project)
    const { allUsers } = useSelector(state => state.global)
    const handleChange = (target) => {
        setProjectActive(target.value)
    }
    
    let content = <h5>Загрузка...</h5>
    if(projectActive === 'active'){if(projects.length){
        content = projects.map(item => {
            let creatorName = ''
            const {name, code, descr, creator, closed} = item
            const user = allUsers.filter(user => user._id === creator)
            if(user.length) {creatorName = user[0].name}
            return <ProjectItem name = {name} descr = {descr} code = {code} creator = {creatorName} closed = {closed} key={code}/>
        })
    } else {
        content = <h5>Проектов пока что нет</h5>
    }}

    if(projectActive === 'closed'){
       
        if(closedProjects?.projects?.length && isSuccess){
            
            content = closedProjects.projects.map(item => {
                let creatorName = ''
                const {name, code, descr, creator, closed} = item
                const user = allUsers.filter(user => user._id === creator)
                if(user.length) {creatorName = user[0].name}
                return <ProjectItem name = {name} descr = {descr} code = {code} creator = {creatorName} closed = {closed} key={code}/>
            })
        } else {
        content = <h5>Закрытых проектов пока что нет</h5>
        }
    }



    const options = [
        {value: 'active', label: 'Активные проекты'},
        {value: 'closed', label: 'Неактивные проекты'},
        
    ]

    return(
        <>

            <div className="admin__top">
                <div className="filter__wrap">
                    <div className="filter__label">Поиск по названию проекта</div>
                    <input type="text" />
                    
                    <button className="filter__btn"><svg xmlns="http://www.w3.org/2000/svg" width="21" height="10" fill="white" class="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                            </svg></button> 
                <CustomSelect
                    handleChange = {handleChange}
                    fontSize = {'15px'}
                    width = {'250px'}
                    input = {'none'}
                    options = {options}
                    selected = {projectActive}
                />
                </div>
               

                <div className="admin__add">
                    <img src="icons/plus-circle.svg" alt="" />
                    <p >Создать новый проект</p>
                </div>
            </div>

            <div className="list overflow">

               {content}

            </div>
        </>
    )
  }