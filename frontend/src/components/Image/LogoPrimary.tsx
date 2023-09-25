import Image from 'next/image'

const LogoPrimary = () => {

    return(
        <>
            <Image className={`mx-auto`}
                alt='Arena'
                width={70} height={50}
                src={'/arena.png'}
                priority={true}
            />
        </>
    )
}

export default LogoPrimary