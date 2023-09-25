const TextSubtitle = ({ text }:{ text:string }) => {
    return(
        <>
            <h1 className='text-md font-semibold text-secondary mt-2 capitalize'>{text}</h1>
        </>
    )
}

export default TextSubtitle