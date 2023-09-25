import router from "next/router";
import { useEffect } from "react"

const LogoutPage = () => {

    useEffect(()=>{
        localStorage.removeItem('arnToken');
        localStorage.removeItem('arnUser');
        localStorage.removeItem('_XPlow');
        localStorage.removeItem('ally-supports-cache');
        router.push('/login')
    })

    return(
        <>
        </>
    )
}

export default LogoutPage