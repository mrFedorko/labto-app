import { CustomSelect } from '../../../customSelect/customSelect'
import { useDispatch, useSelector } from 'react-redux'
import '../admin.scss'
import '../../profile/profile.scss'
import { useState } from 'react'
import { addUserReset, departmentCh, directionrCh, emailCh, nameCh, passwordCh, phoneCh, positionCh, roleCh } from '../../../../redux/store/addUserSlice'
import { useCreateUserMutation } from '../../../../redux/api/userApi'
import { sMessageCh } from '../../../../redux/store/sMessageSlice'




export const AddUser = (props) => {
    const {allDepartments, allPositions, allDirections, allRoles} = useSelector(state=> state.global)
    const {name, email, phone, password, role, position, direction, department} = useSelector(state => state.addUser)
    const dispatch = useDispatch();

    const [confirmPassword, setConfirmPassword] = useState('')

    const {setShowAddUser} = props
    
    const [createUser, {isLoading}] = useCreateUserMutation()


    const handleCancel = () => {
        setShowAddUser(false);
        dispatch(addUserReset());
    }

    const handleSetPosition = (target) => {
        dispatch(positionCh(target.value))
    } 
    const handleSetDepartment = (target) => {
        dispatch(departmentCh(target.value))
    } 
    const handleSetDirection = (target) => {
        dispatch(directionrCh(target.value))
    } 
    const handleSetRole = (target) => {
        dispatch(roleCh(target.value))
    } 
    const handleSetPhone = (e) => {
        dispatch(phoneCh(e.target.value))
    }
    const handleSetName = (e) => {
        dispatch(nameCh(e.target.value))
    }
    const handleSetEmail = (e) => {
        dispatch(emailCh(e.target.value))
    }
    const handleSetPassword = (e) => {
        dispatch(passwordCh(e.target.value))
    }
    
    const isPasswordConfirmed = Boolean(password && password === confirmPassword);
    
    const handleCreateUser = async () => {
        if(isLoading || !(name && password && email && phone && role && direction && department && position)){
            return dispatch(sMessageCh('?????????????????? ?????? ????????'))
        }
        const body = {name, password, email, phone, role, direction, department, position}
        await createUser(body).unwrap();
        dispatch(addUserReset());
        setShowAddUser(false);
    }

    return(
        <>
            <div className="overlay">
                <div className="overlay__window">
                    <div className="close" onClick={()=>setShowAddUser(false)}></div>
                    <div className="overlay__heading"> <p>?????????? ??????????????????</p>
                    </div>

                    <div className="flow__destination">
                        <div className="flow__label">???????????? ??????</div>
                        <input
                            placeholder='??????'
                            style ={{width: '60%', height: '30px'}}
                            onChange = {handleSetName}
                            value={name}
                        />
                    </div>
                    <div className="flow__destination">
                        <div className="flow__label">??????????</div>
                        <CustomSelect
                            options = {allRoles}
                            width = {'60%'}
                            height = {'20px'}
                            fontSize = {'10px'}
                            handleChange = {handleSetRole}
                            selected = {role}
                        />
                    </div>
                    <div className="flow__destination">
                        <div className="flow__label">??????????????????</div>
                        <CustomSelect
                            options = {allPositions}
                            width = {'60%'}
                            height = {'20px'}
                            fontSize = {'10px'}
                            handleChange = {handleSetPosition}
                            selected = {position}
                        />
                    </div>
                    
                    <div className="flow__destination">
                        <div className="flow__label">??????????</div>
                        <CustomSelect
                            options = {allDirections}
                            width = {'60%'}
                            height = {'20px'}
                            fontSize = {'10px'}
                            selected = {direction}
                            handleChange = {handleSetDirection}
                        />
                    </div>
                    <div className="flow__destination">
                        <div className="flow__label">????????????????????</div>
                        <CustomSelect
                            options = {allDepartments}
                            width = {'60%'}
                            height = {'20px'}
                            fontSize = {'10px'}
                            selected = {department}
                            handleChange = {handleSetDepartment}
                        />
                    </div>


                    <div className="flow__destination">
                        <div className="flow__label">?????????? ????????????????</div>
                        <input
                            placeholder='??????????'
                            style ={{width: '60%', height: '30px'}}
                            onChange = {handleSetPhone}
                            value={phone}
                        />
                    </div>

                    <div className="flow__destination">
                        <div className="flow__label">Email</div>
                        <input
                            placeholder='??????????'
                            style ={{width: '60%', height: '30px'}}
                            onChange = {handleSetEmail}
                            value={email}
                        />
                    </div>
                    <div className="flow__destination">
                        <div className="flow__label">????????????</div>
                        <input
                            placeholder='????????????'
                            style ={{width: '60%', height: '30px'}}
                            onChange = {handleSetPassword}
                            value={password}
                        />
                    </div>
                    <div className="flow__destination">
                        <div className="flow__label">?????????????????????????? ????????????</div>
                        <input
                            placeholder='????????????'
                            style ={{width: '60%', height: '30px'}}
                            onChange = {(e) => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                        />
                        
                    </div>
                    {!isPasswordConfirmed && <p className='overlay__warn'>???????????? ???? ??????????????????</p>}
                    <div className="flow__btn-wrap">
                        <button 
                            className="btn btn_white flow__btn" 
                            disabled = {!isPasswordConfirmed}
                            onClick = {handleCreateUser}
                        >????????????????</button>
                        <button className="btn flow__btn" onClick={handleCancel}>????????????????</button>
                    </div>
                </div>
            </div>

        </>
    )
}

