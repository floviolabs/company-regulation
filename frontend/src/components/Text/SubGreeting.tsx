const SubGreeting = ({ text}: {text:string}) => {
    return(
        <>
            <h1 className={`text-xs font-md text-primary`}>{text}</h1>
        </>
    )
}

export default SubGreeting