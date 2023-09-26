import TextSubtitle from "@/components/Text/TextSubtitle"
import Compact from "@/utils/compact"
import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { BsCheckCircleFill, BsExclamationCircleFill, BsFillPencilFill, BsTrashFill } from "react-icons/bs"
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi"
import { RiCloseCircleFill } from "react-icons/ri"
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti"
import * as Icons from "react-icons/ri"

const LayoutLog = () => {
    const mobile = Compact()
    const endpoint = process.env.NEXT_PUBLIC_EP

    // Variable fetch
    const [data, setData] = useState([])
    const [allData, setAllData] = useState([])

    // Variable search
    const [search, setSearch] = useState('')

    // Variable pagination
    const pageNumbers = [];
    const maxPageLinks = 5;
    const [currentPage, setCurrentPage] = useState(0);
    const [dataPerPage, setDataPerPage] = useState(10)
    const startIndex = currentPage * dataPerPage;
    const endIndex = startIndex + dataPerPage
    const pageData = allData.slice(startIndex, endIndex);
    const totalPages = Math.ceil(allData.length / dataPerPage);
    let startPage = currentPage - Math.floor(maxPageLinks / 2);

    // Variable sorting
    const [sortOrder, setSortOrder] = useState("asc");
    const [sortColumn, setSortColumn] = useState("name");


    const fetchAllData = useCallback(async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('regulationToken')}`,
            },
          };
          const response = await axios.post(endpoint + 'logs/get-all', {}, config);
          setData(response.data.data);
        } catch (error) {
          // Handle error here
        }
      }, [setData, endpoint]);

    useEffect(()=>{
    fetchAllData()
    },[fetchAllData])

    // Pagination
    const changePageRow = (curPage:any) => {
      setDataPerPage(curPage)
      setCurrentPage(0)
    }

    if (startPage < 1) {
        startPage = 1;
    }

    let endPage = startPage + maxPageLinks - 1;
    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = endPage - maxPageLinks + 1;
        if (startPage < 1) {
        startPage = 1;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    useEffect(() => {
      let sortedData = [...data];
      if (sortColumn && sortOrder) {
        sortedData = sortedData.sort(sortData(sortColumn, sortOrder));
      }
      setAllData(sortedData);
  }, [data, sortColumn, sortOrder])

    // Sorting
    function sortData(column: string, order: string) {
      return function(a: any, b: any) {
          const aValue = a[column];
          const bValue = b[column];

          if (aValue < bValue) {
          return order === "asc" ? -1 : 1;
          } else if (aValue > bValue) {
          return order === "asc" ? 1 : -1;
          } else {
          return 0;
          }
      };
    }

    function handleSort(column: string) {
        const newSortOrder = column === sortColumn ? (sortOrder === "asc" ? "desc" : "asc") : "asc";
        setSortOrder(newSortOrder);
        setSortColumn(column);
    }

    // Search
    useEffect(() => {
      const fetchData = async () => {
        const res = await data;
        if (search) {
          const searchKeywords = search.toLowerCase().split(' ');
          const filteredData = res.filter((item) => {
          //   return searchKeywords.every((keyword) => {
            return searchKeywords.some((keyword) => {
              const objectValues = Object.values(item).join(' ').toLowerCase();
              return objectValues.includes(keyword);
            });
          });
          setAllData(filteredData);
        } else {
          setAllData(res);
        }
        setCurrentPage(0);
      };
    
      fetchData();
    }, [data, search]);

    return(
        <div className="flex flex-col w-full h-full">
         
            <div className='flex flex-row justify-between mx-3 mt-3'>
                <TextSubtitle text={'logs'}/>
            </div>

            <div className={`flex ${mobile ? "flex-col gap-2 items-center mt-3" : "flex-row justify-between"} mx-3 mb-3`}>
                <div className='flex flex-row items-center gap-1'>
                    <h1 className='text-sm text-secondary'>Show</h1>
                    <select className="select select-primary select-sm w-16 text-secondary" defaultValue={dataPerPage} onChange={(e) => changePageRow(e.target.value)} >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                    <h1 className='text-sm text-secondary'>entries</h1>
                </div>
                <input type="text" placeholder="Search" onChange={(e) => setSearch(e.target.value)} className={`text-sm ${mobile ? "input-md text-secondary w-full max-w-full":"input-sm w-full max-w-sm"} input-primary input border border-1 border-primary`}/>
            </div>

         <div className="shadow overflow-hidden border-b border-gray-200 rounded-lg overflow-y-auto flex flex-1 mx-3">
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr className={`${!mobile && 'hidden'}`}>
                            <th onClick={() => handleSort('name')} scope="col" className={`cursor-pointer py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                                <div className="flex flex-row text-xs items-center justify-center">
                                    Log
                                    {sortColumn === "name" && sortOrder === "asc" ? <TiArrowSortedUp/> : <TiArrowSortedDown/>}
                                </div>
                            </th> 
                        </tr>
                        <tr className={`${mobile && 'hidden'}`}>
                            <th className={`w-[20px] cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                               # 
                            </th>
                            <th onClick={() => handleSort('name')} scope="col" className={`cursor-pointer py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                                <div className="flex flex-row text-xs items-center justify-center">
                                    Name
                                    {sortColumn === "name" && sortOrder === "asc" ? <TiArrowSortedUp/> : <TiArrowSortedDown/>}
                                </div>
                            </th> 
                            <th onClick={() => handleSort('path')} scope="col" className={`cursor-pointer py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                                <div className="flex flex-row text-xs items-center justify-center">
                                    Path
                                    {sortColumn === "path" && sortOrder === "asc" ? <TiArrowSortedUp/> : <TiArrowSortedDown/>}
                                </div>
                            </th> 
                            <th onClick={() => handleSort('log_time')} scope="col" className={`cursor-pointer py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                                <div className="flex flex-row text-xs items-center justify-center">
                                    Time
                                    {sortColumn === "log_time" && sortOrder === "asc" ? <TiArrowSortedUp/> : <TiArrowSortedDown/>}
                                </div>
                            </th> 
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {
                            pageData?.map((item: any, index: any) => (
                                <tr key={index} className={`${mobile && 'hidden'}`}>
                                    <td className={`${!mobile && 'hidden'} px-6 py-4 text-xs text-gray-500`}>
                                        {item?.name}
                                    </td>
                                    <td className={`${mobile && 'hidden'} px-6 py-4 text-xs text-gray-500 w-[20px]`}>
                                        {index+1+(dataPerPage*currentPage)}
                                    </td>
                                    <td className={`px-6 py-4 text-xs text-gray-500`}>
                                        {item?.name}
                                    </td>
                                    <td className={`px-6 py-4 text-xs text-gray-500`}>
                                        {item?.url}
                                    </td>
                                    <td className={`px-6 py-4 text-xs text-gray-500`}>
                                        {item?.log_time}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            <div className='flex flex-row justify-between mx-3 mt-3 items-center text-gray-500'>
                    <p className="text-sm text-secondary-focus">Showing data {((currentPage + 1) * dataPerPage) - dataPerPage + 1} - {(allData.length / ((currentPage + 1) * dataPerPage)) >= 1 ? ((currentPage + 1) * dataPerPage) : ((allData.length % dataPerPage) + (currentPage * dataPerPage))} of {allData.length}</p>
                
                    <div className="flex btn-group justify-end items-center gap-3">
                        <p className={`text-sm text-secondary-focus`}>Page :</p>
                        <input type="number" value={currentPage+1} min={1} max={Math.ceil(allData.length/dataPerPage)} onChange={(e)=>{parseInt(e.target.value) <= Math.ceil(allData.length/dataPerPage) && (e.target.value && setCurrentPage(parseInt(e.target.value)-1))}} className={`text-sm ${mobile ? "input-md":"input-sm"} w-16 input-primary input border border-1 border-primary h-8`}/>
                        <p className={`text-sm text-secondary-focus`}>of {Math.ceil(allData.length/dataPerPage)}</p>
                    </div>
            </div>

            <div className="flex m-3 w-full items-center justify-center gap-1">
                <FiChevronsLeft onClick={() => setCurrentPage(0)} className=" text-primary hover:text-secondary w-7 h-7 cursor-pointer"/>                    
                <FiChevronLeft onClick={() => (currentPage > 0) && setCurrentPage(currentPage - 1)} className=" text-primary hover:text-secondary w-7 h-7 cursor-pointer"/>
                {
                    pageNumbers.map(number => (
                        <button
                            key={number}
                            onClick={() => {setCurrentPage(number-1)}}
                            className={`${
                            number-1 === currentPage
                                ? 'bg-primary text-white'
                                : 'bg-white text-primary'
                            } btn btn-sm border rounded-md w-10 border-gray-200 hover:bg-primary-focus hover:text-white hover:border-primary-focus`}
                        >
                            {number}
                        </button>
                        ))
                }
                <FiChevronRight onClick={() => (currentPage < (Math.ceil(allData.length/dataPerPage)-1)) && setCurrentPage(currentPage + 1)} className=" text-primary hover:text-secondary w-7 h-7 cursor-pointer"/>
                <FiChevronsRight onClick={() => setCurrentPage(Math.ceil(allData.length/dataPerPage)-1)} className=" text-primary hover:text-secondary w-7 h-7 cursor-pointer"/> 
            </div>

        </div>
    )
}

export default LayoutLog