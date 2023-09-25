import Link from 'next/link'

const ButtonSubmitOnClick = ({ label, onClick, htmlFor }: {label:string, onClick:any, htmlFor:any }) => {

    return(
        <>
            <label
                htmlFor={htmlFor}
                className="btn btn-primary w-full px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={onClick}>
                {label}
            </label>
        </>
    )
}

export default ButtonSubmitOnClick