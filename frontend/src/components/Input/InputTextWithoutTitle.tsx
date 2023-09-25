import { ChangeEventHandler } from "react"

const InputTextWithoutTitle = ({onChange, label}: {onChange:ChangeEventHandler, label:string}) => {
    return(
        <>
            <div className='flex border-2 border-gray-200 rounded-md flex-row p-1'>
                <input
                className="appearance-none rounded text-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={onChange}
                id={'label'} type="text" placeholder={`Enter ${label}`}>
                </input>
            </div>
        </>
    )
}

export default InputTextWithoutTitle