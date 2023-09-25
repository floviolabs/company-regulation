import Link from 'next/link'

const ButtonSubmit = ({ label }: {label:string }) => {

    return(
        <>
            <button
                className="btn btn-primary w-full px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit">
                {label}
            </button>
        </>
    )
}

export default ButtonSubmit