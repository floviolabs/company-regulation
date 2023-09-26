import router from "next/router";
import { useEffect } from "react"

const LogoutPage = () => {

    useEffect(()=>{
        localStorage.removeItem('regulationToken');
        localStorage.removeItem('regulationUser');
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