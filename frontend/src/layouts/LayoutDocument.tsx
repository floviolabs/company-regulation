import Image from "next/image"
import { SetStateAction, useCallback, useEffect, useState } from "react";
import axios from "axios";
import router from "next/router"
import Link from "next/link";
import * as Icons from "react-icons/ri"
const CryptoJS = require('crypto-js');
import { Document, Page, pdfjs } from 'react-pdf';
import Compact from "@/utils/compact";
import { MdClose, MdSearch } from "react-icons/md";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const LayoutDocument = () => {
    const mobile = Compact()
    const endpoint = process.env.NEXT_PUBLIC_EP
    const storedToken = localStorage.getItem('regulationToken')

    const [token, setToken] = useState<string | null>(null)
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('regulationUser')!))
    const [menuCategory, setMenuCategory] = useState<any[]>([])

  return (
      <div className="flex flex-col overflow-y-auto w-full h-screen p-5 gap-3">
        <div className="flex flex-row items-center justify-between">
        <div className="text-secondary uppercase font-bold">Company Regulation</div>
         <div className={`${mobile && 'hidden'} z-10 relative flex bg-white w-1/3 border rounded-2xl p-1 items-center px-3 gap-1`}>             
          <input type={'text'} value={''} placeholder={'search application'} className={` text-xs text-gray-400 w-full appearance-none focus:outline-none focus:shadow-outline p-1 rounded-xl`} onChange={(e)=>handleSearch(e.target.value)}/>
          <MdSearch className="text-primary"/> 
          <MdClose onClick={()=>{}} className="text-secondary rounded-3xl cursor-pointer hover:bg-gray-200"/>
        </div>
        <div className="btn btn-primary px-5 text-sm">Print Statement</div>
        
        </div>
         <div className={`${!mobile && 'hidden'} z-10 relative flex bg-white w-full border rounded-2xl p-1 items-center px-3 gap-1`}>             
          <input type={'text'} value={''} placeholder={'search application'} className={` text-xs text-gray-400 w-full appearance-none focus:outline-none focus:shadow-outline p-1 rounded-xl`} onChange={(e)=>handleSearch(e.target.value)}/>
          <MdSearch className="text-primary"/> 
          <MdClose onClick={()=>{}} className="text-secondary rounded-3xl cursor-pointer hover:bg-gray-200"/>
        </div>
      </div>
  );
};

export default LayoutDocument;

