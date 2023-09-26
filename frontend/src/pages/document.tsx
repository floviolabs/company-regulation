import Navigation from '@/components/Navigation/Navigation'

import Head from 'next/head'
import { useEffect, useState } from 'react'
import CheckAuth from '../utils/checkAuth'
import LayoutDocument from '@/layouts/LayoutDocument'

const DocumentPage = () => {
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
                <title>Company Regulation - PT. AEON Indonesia</title>
            </Head>
            {
                !isLoading && <Navigation content={<LayoutDocument/>}/>
            }
        </div>
    )
}

export default DocumentPage