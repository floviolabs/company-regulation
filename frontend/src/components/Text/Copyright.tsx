const Copyright = () => {
    const year = (new Date().getFullYear())

    return(
        <>
            <p className='text-xs text-center text-secondary'>© {year} PT. AEON Indonesia</p>
        </>
    )
}

export default Copyright