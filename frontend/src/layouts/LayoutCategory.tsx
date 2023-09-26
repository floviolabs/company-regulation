import TextSubtitle from "@/components/Text/TextSubtitle"
import Compact from "@/utils/compact"
import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { BsCheckCircleFill, BsExclamationCircleFill, BsFillPencilFill, BsTrashFill } from "react-icons/bs"
import { RiCloseCircleFill } from "react-icons/ri"
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti"
import { FiChevronLeft, FiChevronsLeft, FiChevronRight, FiChevronsRight } from "react-icons/fi"

const LayoutCategory = () => {
    const mobile = Compact()
    const endpoint = process.env.NEXT_PUBLIC_EP

    // Variable input
    const [id, setId] = useState(null)
    const [category, setCategory] = useState('')
    const [priority, setPriority] = useState('')
    const [isActive, setIsActive] = useState(true)

    // Variable fetch
    const [data, setData] = useState([])
    const [allData, setAllData] = useState([])

    // Variable search
    const [search, setSearch] = useState('')

    // Variable pagination
    const pageNumbers = [];
    const maxPageLinks = 5;
    const [currentPage, setCurrentPage] = useState(0);
    const [dataPerPage, setDataPerPage] = useState(5)
    const startIndex = currentPage * dataPerPage;
    const endIndex = startIndex + dataPerPage
    const pageData = allData.slice(startIndex, endIndex);
    const totalPages = Math.ceil(allData.length / dataPerPage);
    let startPage = currentPage - Math.floor(maxPageLinks / 2);

    // Variable sorting
    const [sortOrder, setSortOrder] = useState("asc");
    const [sortColumn, setSortColumn] = useState("name");

    // Variable notification
    const [showNotification, setShowNotification] = useState(false)
    const [statNotif, setStatNotif] = useState(true)
    const [msgNotif, setMsgNotif] = useState('')

    const initialState = () => {
        setId(null)
        setCategory('')
        setPriority('')
        setIsActive(true)
    }

    const editShow = (i:any) => {
        initialState()
        setId(allData[i]['id'])
        setCategory(allData[i]['category'])
        setPriority(allData[i]['priority'])
        setIsActive(allData[i]['isactive'])
    }

    const fetchAllData = useCallback(async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('regulationToken')}`,
            },
          };
          const response = await axios.post(endpoint + 'categories/get-all', {}, config);
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

    const handleIsActive = (event:any) => {
        setIsActive(!isActive)
    }

    const handleNotification = () => {
        setShowNotification(true)
        setTimeout(() => {
          setShowNotification(false)
        }, 3000)
    }

    const handleSubmitData = useCallback(async () => {
        try {
            if(category){
                const config = {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('regulationToken')}`,
                    },
                };

                const x = {
                    in_mcat_id:id,
                    in_mcat_name:category,
                    in_mcat_isactive:isActive,
                    in_priority:priority
                };

                // console.log(x)
                
                await axios.post(endpoint + 'categories/submit', x, config)
                .then(response => {
                    setStatNotif(true)
                    setMsgNotif(response.data.message)
                    handleNotification()
                    console.log(response)
                })
                .catch(error => {
                    console.error(error);
                });
            }
            else{
                setStatNotif(false)
                setMsgNotif('Data did not complete')
                handleNotification()
            }

        } catch (error) {
          // Handle error here
        }

        fetchAllData()
      }, [
        endpoint,
        id,
        category,
        isActive,
        priority
      ]
    );

    function tokenCheck(){
        // localStorage.removeItem('token');
        // localStorage.removeItem('userData');
        // localStorage.removeItem('userRole');
        // localStorage.removeItem('ally-supports-cache');
        // router.push('/login');
    }

    function handleDeleteData(id:any) {
        const x = {
            in_mcat_id:id
        }
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('regulationToken')}`,
            },
        };
        axios.post(`${endpoint}categories/delete`,x, config)
            .then(response => {
                setStatNotif(response.data.status)
                setMsgNotif(response.data.message)
                if(response.data.message == "unrecognize")
                {
                    tokenCheck()
                }else{
                    handleNotification()
                }
                fetchAllData()
            })
            .catch(error => {
        })
        initialState()
    }


    return(
        <div className="flex flex-col overflow-y-auto w-full h-full">
         {showNotification &&
                <div className={`alert ${statNotif ? ' alert-success' : 'alert-error'} flex flex-row shadow-md radius-xs absolute w-fit font-poppins top-5 right-5`}>
                    {statNotif ?
                        <div className=" flex flex-row items-center gap-2">
                        <span className='text-white'><BsCheckCircleFill/></span>
                        <span className={`${mobile && 'text-xs'} text-white`}>{msgNotif}</span>
                        {/* <PulseLoader size={10} color="#ffffff" speedMultiplier={0.4}/> */}
                    </div>:
                            <div className=" flex flex-row items-center gap-2">
                            <span className='text-white'><BsExclamationCircleFill/></span>
                            <span className={`${mobile && 'text-xs'} text-white`}>{msgNotif}</span>
                        </div>
                    }
                </div>
            }
            <div className='flex flex-row justify-between mx-3 mt-3'>
                <TextSubtitle text={'list of category'}/>
                <label htmlFor="modal-add" onClick={()=>initialState()} className={`rounded-md bg-white border-primary border-1 border px-3.5 py-2.5 mb-3 text-sm text-primary shadow-sm hover:bg-secondary-focus hover:border-secondary-focus hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-focus cursor-pointer`}>Add Category</label>
            </div>

            <div className={`flex ${mobile ? "flex-col gap-2 items-center mt-3" : "flex-row justify-between"} mx-3 mb-3`}>
                <div className='flex flex-row items-center gap-1'>
                    <h1 className='text-sm text-secondary'>Show</h1>
                    <select className="select select-primary text-secondary select-sm w-16" defaultValue={dataPerPage} onChange={(e) => changePageRow(e.target.value)} >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                    <h1 className='text-sm text-secondary'>entries</h1>
                </div>
                <input type="text" value={search} placeholder="Search" onChange={(e) => setSearch(e.target.value)} className={`text-sm ${mobile ? "input-md w-full max-w-full":"input-sm w-full max-w-sm"} input-primary input border border-1 border-primary text-secondary`}/>
            </div>

            <div className="shadow overflow-hidden border-b border-gray-200 rounded-lg overflow-y-auto flex flex-1 mx-3">
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr className={`${!mobile && 'hidden'}`}>
                            <th onClick={() => handleSort('category')} scope="col" className={`cursor-pointer py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                                <div className="flex flex-row text-xs items-center justify-center">
                                    Category
                                    {sortColumn === "category" && sortOrder === "asc" ? <TiArrowSortedUp/> : <TiArrowSortedDown/>}
                                </div>
                            </th> 
                        </tr>

                        <tr className={`${mobile && 'hidden'}`}>
                            <th className={`w-[20px] cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                               # 
                            </th>
                            <th onClick={() => handleSort('category')} scope="col" className={`w-full cursor-pointer py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                                <div className="flex flex-row text-xs items-center justify-center">
                                    Category
                                    {sortColumn === "category" && sortOrder === "asc" ? <TiArrowSortedUp/> : <TiArrowSortedDown/>}
                                </div>
                            </th> 
                            <th onClick={() => handleSort('priority')} scope="col" className={` w-[100px] cursor-pointer py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                                <div className="flex flex-row text-xs items-center justify-center">
                                    Sort
                                    {sortColumn === "priority" && sortOrder === "asc" ? <TiArrowSortedUp/> : <TiArrowSortedDown/>}
                                </div>
                            </th> 
                            <th onClick={() => handleSort('isactive')} scope="col" className={` w-[100px] cursor-pointer py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                                <div className="flex flex-row text-xs items-center justify-center">
                                    Status
                                    {sortColumn === "isactive" && sortOrder === "asc" ? <TiArrowSortedUp/> : <TiArrowSortedDown/>}
                                </div>
                            </th> 
                            <th>
                                <div className="flex text-xs font-medium text-gray-500 uppercase mr-5 w-[100px]">
                                  Action
                                </div>
                            </th> 
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {
                            pageData?.map((item: any, index: any) => (
                                <tr key={index}>
                                    <td className={`${!mobile && 'hidden'} flex px-6 py-4 text-xs text-gray-500 `}>
                                        <div className="flex flex-row gap-3 items-center w-full justify-between">
                                            <div className="max-w-[250px] whitespace-nowrap overflow-hidden overflow-ellipsis">
                                              {item?.category}
                                            </div>
                                            <div className="flex flex-row gap-1">
                                                <label htmlFor="modal-edit" onClick={()=>{editShow(index+(dataPerPage*currentPage))}} className="flex w-8 h-8 bg-primary rounded border border-1 border-primary cursor-pointer justify-center items-center text-white">
                                                    <BsFillPencilFill/>
                                                </label>
                                                <label htmlFor="modal-delete" onClick={()=>{editShow(index+(dataPerPage*currentPage))}} className="flex w-8 h-8 bg-white rounded border border-1 border-primary cursor-pointer justify-center items-center text-primary">
                                                    <BsTrashFill/>
                                                </label>
                                            </div>
                                        </div>
                                    </td>
                                
                                    <td className={`${mobile && 'hidden'} px-6 py-4 text-xs text-gray-500 w-[20px]`}>
                                        {index+1+(dataPerPage*currentPage)}
                                    </td>
                                    <td className={`${mobile && 'hidden'} px-6 py-4 text-xs text-gray-500`}>
                                        {item?.category}
                                    </td>
                                    <td className={`${mobile && 'hidden'} px-6 py-4 text-xs text-gray-500`}>
                                        {item?.priority}
                                    </td>
                                    <td className={`${mobile && 'hidden'} px-6 py-4 text-xs text-gray-500 w-[100px]`}>
                                        {item?.isactive ? 'Active' : 'Inactive'}
                                    </td>
                                    <td>
                                        <div className={`${mobile && 'hidden'} flex flex-row gap-1 mr-5 w-[75px]`}>
                                            
                                            <label htmlFor="modal-add" onClick={() => editShow(index+(dataPerPage*currentPage))} className={`flex w-8 h-8 bg-primary rounded border border-1 border-primary cursor-pointer justify-center items-center text-white`}>
                                                <BsFillPencilFill/>
                                            </label>
                                            <label htmlFor="modal-delete" onClick={() => editShow(index+(dataPerPage*currentPage))} className={`flex w-8 h-8 bg-white rounded border border-1 border-primary cursor-pointer justify-center items-center text-primary`}>
                                                <BsTrashFill/>
                                            </label>
                                        </div>
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

            <input type="checkbox" id="modal-add" className="modal-toggle"/>
            <div className="modal">
                <div className="relative modal-box">
                    <div className="flex flex-row justify-between items-center mb-3">
                        <h1 className="text-sm font-bold text-secondary-focus">{id ? 'UPDATE CATEGORY' : 'CREATE NEW CATEGORY'}</h1>
                        <div className="flex flex-row items-center gap-2">
                            <label htmlFor="modal-add" onClick={()=>{initialState}} className="text-primary cursor-pointer"><RiCloseCircleFill className="w-7 h-7"/></label>
                        </div>
                    </div>
                    <div className="flex flex-row gap-2">
                        <div className="flex flex-col w-4/5">
                            <label className="block text-secondary-focus text-xs text mb-1" htmlFor={'category'}>Category</label>
                            <input type="text" min={0} value={category} name="category" id="category" placeholder="Category" className="input input-sm input-bordered w-full mb-3 text-xs text-primary" onChange={(e) => setCategory(e.target.value)} />
                        </div>
                        <div className="flex flex-col w-1/5">
                            <label className="block text-secondary-focus text-xs text mb-1" htmlFor={'priority'}>Sort</label>
                            <input type="number" min={0} value={priority} name="priority" id="priority" placeholder="Sort" className="input input-sm input-bordered w-full mb-3 text-xs text-primary" onChange={(e) => setPriority(e.target.value)} />
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <input type="checkbox" id="is_active" name="is_active" checked={isActive} onChange={handleIsActive} className="flex toggle toggle-primary toggle-sm"/>
                            <label className={`flex ${ isActive ? 'text-primary-focus':'text-secondary-focus'}  text-xs text`}>Active</label>
                        </div>
                    </div>
                    <label htmlFor="modal-add" onClick={handleSubmitData} className="btn btn-md w-full text-white bg-primary border-transparent hover:bg-primary-focus hover:border-transparent">Submit</label>
                </div>
            </div>

            <input type="checkbox" id="modal-delete" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box relative">
                    <label htmlFor="modal-delete" className="absolute right-3 top-3 text-primary cursor-pointer"><RiCloseCircleFill className="w-7 h-7"/></label>
                    <h1 className="text-sm text-secondary-focus">Are you sure to delete this category?</h1>
                    <input type="text" value={id!} name="id" id="id" className="input input-bordered w-full" hidden />
                    <p className="text-center text-secondary text-sm font-bold w-full my-3">{category}</p>
                    <div className='flex justify-center items-center gap-2'>
                        <label htmlFor="modal-delete" className="btn w-1/2 bg-primary border-transparent hover:bg-secondary-focus hover:text-white hover:border-secondary-focus text-white" onClick={()=>handleDeleteData(id)}>Delete</label>
                        <label htmlFor="modal-delete" className="btn w-1/2 bg-white border-primary text-primary hover:bg-secondary-focus hover:text-white hover:border-secondary-focus">Cancel</label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LayoutCategory