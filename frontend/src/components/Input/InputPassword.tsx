import { ChangeEventHandler, useState } from "react"
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'

const InputPassword = ({onChange}: {onChange:ChangeEventHandler}) => {
    const [ showPassword, setShowPassword ] = useState(false)
    return(
        <>
            <label className="block text-gray-700 text-sm font-bold mb-2 text capitalize" htmlFor='password'>password</label>
            <div className='flex border-2 border-gray-200 rounded-md flex-row p-1 items-center'>
                <input
                className="appearance-none text-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={onChange}
                id='password' type={showPassword ? 'text':'password'} placeholder={`Enter ${'password'}`}>
                </input>
                <label className='text-gray-400 cursor-pointer' onClick={()=>{
                setShowPassword(!showPassword)
                }}>{showPassword ? <AiFillEyeInvisible/>:<AiFillEye/>}</label>
            </div>
        </>
    )
}

export default InputPassword