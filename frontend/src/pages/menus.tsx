import Navigation from '@/components/Navigation/Navigation'
import LayoutMenu from '@/layouts/LayoutMenu'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import CheckAuth from '../utils/checkAuth'

const MenusPage = () => {
    const [isLoading, setIsLoading] = useState(true)
    const checkAuth = CheckAuth()
    
    useEffect(()=>{
    if(checkAuth){
        setIsLoading(false)
    }else{
        setIsLoading(true)
    }
    },[checkAuth])

    return(
        <div className='bg-white'>
            <Head>
                <title>ARENA - PT. AEON Indonesia</title>
            </Head>
            {
                !isLoading && <Navigation content={<LayoutMenu/>}/>
            }
        </div>
    )
}

export default MenusPage