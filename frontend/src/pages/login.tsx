import LayoutLogin from "@/layouts/LayoutLogin"
import CheckAuth from '../utils/checkAuth'
import Head from "next/head"
import router from "next/router"
import { useEffect, useState } from "react"
  
const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(true)
    
    useEffect(() => {
        const storedToken = localStorage.getItem('arnToken')
        if (storedToken) {
          router.push('/dashboard')
        }else{
            setIsLoading(false)
        }
      }, [router])

    return(
        <>
            <Head>
                <title>ARENA - PT. AEON Indonesia</title>
            </Head>
            {!isLoading && <LayoutLogin/>}
        </>
    )
}

export default LoginPage