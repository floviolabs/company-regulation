// @ts-nocheck

import { useRouter } from "next/router";
const CryptoJS = require('crypto-js');
import { useEffect, useState } from "react";

const SsoPage = () => {
    const router = useRouter();
    const { token }  = router.query;
    const endpoint = process.env.NEXT_PUBLIC_EP
    
    const [tokenDef, setTokenDef] = useState('')
    const [tokenAuth, setTokenAuth] = useState('')
    const [tokenSSO, setTokenSSO] = useState('')
    const [encUsername, setEncUsername] = useState('')
    const [encPassword, setEncPassword] = useState('')
    const [byteUsername, setByteUsername] = useState('')
    const [bytePassword, setBytePassword] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [sso, setSSO] = useState('')

    const handleLogin = async (event:any) => {
        event.preventDefault()
        const encryptedUsername = CryptoJS.AES.encrypt(username, process.env.NEXT_PUBLIC_SECRET_KEY).toString();
        const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.NEXT_PUBLIC_SECRET_KEY).toString();
        const encryptedSso = CryptoJS.AES.encrypt(sso, process.env.NEXT_PUBLIC_SECRET_KEY).toString();

        const response = await fetch(endpoint + 'login/checks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ a : CryptoJS.AES.encrypt(encryptedUsername + 'f22d23dji*m3210dk1d=' + encryptedPassword + 'dsfjksmdf2r23mwni-mdw=' + encryptedSso, process.env.NEXT_PUBLIC_SECRET_KEY).toString() }),
        })
    
        const data = await response.json()
        if (data.status) {
            localStorage.setItem('regulationToken', data.token)
            localStorage.setItem('regulationUser', JSON.stringify(data.attribute))
            localStorage.setItem('_XPlow', encryptedUsername + 'rfw3252fr2g25t-5gtg355=' + encryptedPassword)
            router.push('/document')
        }
    }


    useEffect(() => {
        const updateTokenDef = async () => {
            const formattedToken = token?.toString().replaceAll(' ', '+');
            await setTokenDef(formattedToken!);

            await setTokenAuth(tokenDef?.toString().split('x5*y84fw3421ss35-f43t=')[0])
            await setTokenSSO(tokenDef?.toString().split('x5*y84fw3421ss35-f43t=')[1])

            await setEncUsername(tokenAuth?.toString().split('rfw3252fr2g25t-5gtg355=')[0])
            await setEncPassword(tokenAuth?.toString().split('rfw3252fr2g25t-5gtg355=')[1])
          };
          updateTokenDef();

      }, [token,tokenDef,tokenAuth]);

    useEffect(()=>{
        const updateTokenDef = async () => {
            await setByteUsername(encUsername && CryptoJS.AES.decrypt(encUsername, process.env.NEXT_PUBLIC_SECRET_KEY))
            await setBytePassword(encPassword && CryptoJS.AES.decrypt(encPassword, process.env.NEXT_PUBLIC_SECRET_KEY))
    
            await setUsername(byteUsername && byteUsername.toString(CryptoJS.enc.Utf8))
            await setPassword(bytePassword && bytePassword.toString(CryptoJS.enc.Utf8))
          };
          updateTokenDef();

    },[encUsername,encPassword,byteUsername,bytePassword])

    return(
        <div className="flex flex-col">
            <label>{'SSO:' + tokenSSO}</label>
            <label>{'Username:' + username}</label>
            <label>{'Password:' + password}</label>
        </div>
    )
}

export default SsoPage