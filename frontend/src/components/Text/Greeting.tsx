const Greeting = ({ text}: {text:string}) => {
    return(
        <>
            <h1 className={`text-xl font-bold text-primary animate-pulse`}>{text}</h1>
        </>
    )
}

export default Greeting