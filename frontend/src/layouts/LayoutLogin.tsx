// @ts-nocheck

import Compact from '../utils/compact'
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import PulseLoader from 'react-spinners/PulseLoader'
import { BsCheckCircleFill, BsFillExclamationCircleFill } from 'react-icons/bs'
import { RiCloseCircleFill } from 'react-icons/ri'
import Copyright from '@/components/Text/Copyright'
import LogoPrimary from '@/components/Image/LogoPrimary'
import Greeting from '@/components/Text/Greeting'
import SubGreeting from '@/components/Text/SubGreeting'
import InputPassword from '@/components/Input/InputPassword'
import ButtonSubmit from '@/components/Button/ButtonSubmit'
import axios from 'axios'
import ButtonSubmitOnClick from '@/components/Button/ButtonSubmitOnClick'
import InputText from '@/components/Input/InputText'
import InputTextWithoutTitle from '@/components/Input/InputTextWithoutTitle'
const CryptoJS = require('crypto-js');

const LayoutLogin = () => {
    // ENDPOINT
    const endpoint = process.env.NEXT_PUBLIC_EP

    // INIT
    const router = useRouter()
    const mobile = Compact()

    // NOTIF
    const [showNotification, setShowNotification] = useState(false)
    const [statNotif, setStatNotif] = useState(true)
    const [msgNotif, setMsgNotif] = useState('')

    // INPUT
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [subject, setSubject] = useState('')
    const [requestor, setRequestor] = useState([])
    const [service, setService] = useState([])
    const [pic, setPic] = useState([])

    // OPTION
    const [opsService, setOpsService] = useState([])

    // HANDLING INPUT
    const handleUsername = (event:any) => {
        setUsername(event.target.value.toLowerCase())
        setShowNotification(false)
    }
    const handlePassword = (event:any) => {
        setPassword(event.target.value)
        setShowNotification(false)
    }
    const handleEmail = (event:any) => {
        setEmail(event.target.value.toLowerCase())
    }

    const handleSubject = (event:any) => {
        setSubject(event.target.value)
      }

    // HANDLING INIT
    const initialCreateTicket = () => {
        setEmail('')
        setSubject('')
    }

    const fetchAllData = useCallback(async () => {
        try {
          const arrayService = await axios.post('https://tic.aeonindonesia.co.id/api/v1/problems/all-login-trouble', {});
          setOpsService(arrayService.data.data);
        } catch (error) {
        }
    }, [setOpsService]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    // SUBMIT
    function submitCreateTicket(email:string, service:string) {
        (async () => {
          const x = {
            email: email,
          };
          const y = {
            in_mser_id: service,
          };
          const arrayRequestor = await axios.post('https://tic.aeonindonesia.co.id/api/v1/login/email-check', x);
          const arrayService = await axios.post('https://tic.aeonindonesia.co.id/api/v1/problems/detail', y);
          setRequestor(arrayRequestor.data.data);
          setService(arrayService.data.service);
          setPic(arrayService.data.pic);
        })();
    }

    const handleSelectProblem = useCallback(async () => {
        try {
          const now = new Date();

          const dateOpt = { year: 'numeric', month: '2-digit', day: '2-digit' };
          const timeOpt = { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
 
          const formatDate = now.toLocaleDateString('en-US', dateOpt).replace(/\//g, '');
          const formatTime = now.toLocaleTimeString('en-US', timeOpt).replace(/:/g, '');
      
          const year = formatDate.slice(4, 8);
          const yearAlt = formatDate.slice(6, 8);
          const month = formatDate.slice(0, 2);
          const day = formatDate.slice(2, 4);
      
          const hour = formatTime.slice(0, 2);
          const minute = formatTime.slice(2, 4);
          const second = formatTime.slice(4, 6);
      
          const date = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
          const date_alt = yearAlt + month + day + hour + minute + second;
      
          const message = {
            "uid": requestor[0].iid,
            "sender": requestor[0].name,
            "time": date,
            "message": service[0].mser_service
          }
    
          const x = {
            in_number: 'TIC-' + requestor[0].iid + '-' + date_alt,
            in_requestor_id: requestor[0].iid,
            in_requestor: requestor[0].name,
            in_msit_id: '9000',
            in_msit_name: 'HQ',
            in_mcat_id: service[0].mser_mcat_id,
            in_mcat_name: 'ACCESS',
            in_mser_id: service[0].mser_id,
            in_mser_service: service[0].mser_service,
            in_mser_response_time: service[0].mser_response_time,
            in_mser_solve_time: service[0].mser_solve_time,
            in_ttic_mser_severity: 'SV001 - Urgent',
            in_ttic_mser_type: 'Request', 
            in_mpic_pic1: pic[0].mpic_pic1,
            in_mpic_pic2: pic[0].mpic_pic2,
            in_subject: service[0].mser_service,
            in_description: service[0].mser_service,
            in_date: date
          };
          await axios.post('https://tic.aeonindonesia.co.id/api/v1/problems/ticket-login-trouble', x);
        } catch (error) {
        }
      }, [requestor, service, pic]);
      
    useEffect(() => {
        if(requestor.length && service.length)
        {
            handleSelectProblem()
        }
    }, [requestor,service,pic,handleSelectProblem]);

    const handleLogin = async (event:any) => {
        event.preventDefault()
        const encryptedUsername = CryptoJS.AES.encrypt(username, process.env.NEXT_PUBLIC_SECRET_KEY).toString();
        const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.NEXT_PUBLIC_SECRET_KEY).toString();
        // console.log(encryptedPassword)
        // const response = await fetch('https://tic.aeonindonesia.co.id/api/v1/login/checks', {
        const response = await fetch(endpoint + 'access/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ username, password }),
          body: JSON.stringify({ a : CryptoJS.AES.encrypt(encryptedUsername + 'rfw3252fr2g25t-5gtg355=' + encryptedPassword, process.env.NEXT_PUBLIC_SECRET_KEY).toString() }),
        })
    
        const data = await response.json()
        if (data.status) {
          localStorage.setItem('arnToken', data.token)
          localStorage.setItem('arnUser', JSON.stringify(data.attribute))
          localStorage.setItem('_XPlow', encryptedUsername + 'rfw3252fr2g25t-5gtg355=' + encryptedPassword)
     
          setStatNotif(data.status)
          setMsgNotif(data.message)
          setShowNotification(true)
          setTimeout(() => {
            setShowNotification(false)
            router.push('/dashboard')
          }, 3000)
        } else {
          setStatNotif(data.status)
          setMsgNotif(data.message)
          setShowNotification(true)
          setTimeout(() => {
            setShowNotification(false)
          }, 3000)
        }
    }

    return(
        <>
            {
                showNotification &&
                    <div className={`absolute max-w-[80%] top-5 right-5`}>
                        {
                            statNotif ?
                                <div className='flex flex-row bg-success justify-center items-center gap-1 p-3 shadow-md radius-xs rounded-lg'>
                                    <span className='text-white'><BsCheckCircleFill/></span>
                                    <span className={`${mobile && 'text-xs'} text-white`}>{msgNotif}</span>
                                    <PulseLoader size={10} color="#ffffff" speedMultiplier={0.4}/>
                                </div>:
                                    <div className='flex flex-row bg-error justify-center items-center gap-1 p-3 shadow-md radius-xs rounded-lg'>
                                    <span className='text-white'><BsFillExclamationCircleFill/></span>
                                    <span className={`${mobile && 'text-xs'} text-white`}>{msgNotif}</span>
                                </div>
                        }
                    </div>
            }
            <div className='flex w-screen h-screen bg-white justify-center items-center'>
                <div className={`flex flex-col bg-white h-fit ${mobile ? 'py-5':'px-6 py-10 border'} rounded-lg items-center justify-center ${mobile ? 'w-full mx-10':'w-[420px]'}`}>
                    <header className='w-full'>
                        <LogoPrimary/>
                        {/* <div className="flex flex-row w-full text-sm font-light text-secondary justify-center mb-6 gap-2">ARENA</div> */}
                        <div className='flex flex-col my-6 w-full items-center'>
                            <Greeting text='Welcome!'/>
                            <SubGreeting text='Sign in to continue to ARENA'/>
                        </div>
                    </header>
                    
                    <form className='w-full' onSubmit={handleLogin}>
                        <div className="mb-4">
                            <InputText label='username' onChange={handleUsername}/>
                        </div>
                        <div className="mb-8">
                            <InputPassword onChange={handlePassword}/>
                        </div>
                        <ButtonSubmit label={"Login"}/>
                    </form>

                    <div className='mb-8 mt-1 w-full justify-end flex'>
                        <label htmlFor='cannot-login-modal' onClick={initialCreateTicket} className='text-gray-400 text-xs hover:text-primary cursor-pointer'>Can not login</label>
                    </div>

                    <footer>
                        <Copyright/>
                    </footer>
                </div>
            </div>

            <input type="checkbox" id="cannot-login-modal" className="modal-toggle" />
            <div className="modal">
                <div className="flex flex-col modal-box relative">
                    <div className='flex flex-row mb-3'>
                        <h1 className="text-sm font-bold text-secondary-focus">CAN NOT LOGIN</h1>
                        <label htmlFor="cannot-login-modal" className="absolute right-3 top-3 text-primary cursor-pointer"><RiCloseCircleFill className="w-7 h-7"/></label>
                    </div>
                    <InputTextWithoutTitle label='email' onChange={handleEmail}/>
                    <select value={`${subject}`} className="appearance-none border-2 h-11 border-gray-200 rounded-md my-3 text-sm w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" onChange={handleSubject} id='subject' name="subject">
                    <option value={''}>Why you can not login?</option>   
                        {
                        opsService.map((option:any, index:any) => (
                            <option key={index} value={option.mser_id}>
                                {option.mser_service}
                            </option>
                        ))
                        }  
                    </select>
                    <ButtonSubmitOnClick htmlFor="cannot-login-modal" label='send' onClick={()=>submitCreateTicket(email,subject)}/>
                </div>
            </div>
        </>
    )
}

export default LayoutLogin