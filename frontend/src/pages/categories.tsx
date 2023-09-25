import Navigation from '@/components/Navigation/Navigation'
import LayoutCategory from '@/layouts/LayoutCategory'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import CheckAuth from '../utils/checkAuth'

const CategoriesPage = () => {
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
                !isLoading && <Navigation content={<LayoutCategory/>}/>
            }
        </div>
    )
}

export default CategoriesPage