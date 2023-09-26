import TextSubtitle from "@/components/Text/TextSubtitle"
import Compact from "@/utils/compact"
import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { BsCheckCircleFill, BsExclamationCircleFill, BsFillPencilFill, BsTrashFill } from "react-icons/bs"
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from "react-icons/fi"
import { RiCloseCircleFill } from "react-icons/ri"
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti"
import * as Icons from "react-icons/ri"

const LayoutMenu = () => {
    const mobile = Compact()
    const endpoint = process.env.NEXT_PUBLIC_EP

    // Variable input
    const [id, setId] = useState(null)
    const [category, setCategory] = useState('')
    const [categoryName, setCategoryName] = useState('')
    const [menu, setMenu] = useState('')
    const [icon, setIcon] = useState('')
    const [image, setImage] = useState('')
    const [url, setUrl] = useState('')
    const [sso, setSso] = useState('')
    const [isActive, setIsActive] = useState(true)

    const [opsCategory, setOpsCategory] = useState([])

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
        setCategoryName('')
        setMenu('')
        setUrl('')
        setSso('')
        setImage('')
        setIcon('')
        setIsActive(true)
    }

    const editShow = (i:any) => {
        initialState()
        setId(allData[i]['id'])
        setCategory(allData[i]['category_id'])
        setCategoryName(allData[i]['category_id'])
        setMenu(allData[i]['menu'])
        setIcon(allData[i]['icon'])
        setUrl(allData[i]['url'])
        setImage(allData[i]['image'])
        setSso(allData[i]['sso'])
        setIsActive(allData[i]['isactive'])
    }

    const fetchAllData = useCallback(async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('regulationToken')}`,
            },
          };
          const response = await axios.post(endpoint + 'menus/get-all', {}, config);
          setData(response.data.data);

          const responseCategory = await axios.post(endpoint + 'categories/get-all', {}, config);
          setOpsCategory(responseCategory.data.data);
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
           
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('regulationToken')}`,
                },
            };

            const x = {
                in_mmen_id: id,
                in_mmen_mcat_id: category,
                in_mmen_name: menu,
                in_mmen_link: url,
                in_mmen_sso_key: sso,
                in_mmen_icon: icon,
                in_mmen_image: image,
                in_mmen_isactive:isActive
            };
            console.log(x)
            await axios.post(endpoint + 'menus/submit', x, config)
            .then(response => {
                setStatNotif(true)
                setMsgNotif(response.data.message)
                handleNotification()
                console.log(response)
            })
            .catch(error => {
                console.error(error);
            });
        } catch (error) {
          // Handle error here
        }

        fetchAllData()
      }, [
        endpoint,
        id,
        category,
        menu,
        url,
        sso,
        icon,
        image,
        isActive
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
            in_mmen_id:id
        }
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('regulationToken')}`,
            },
        };
        axios.post(`${endpoint}menus/delete`,x, config)
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

    const handleCategory = (event:any) => {
        setCategory(event.target.value)
    }

    type IconNames = keyof typeof Icons; 

    const DynamicIcon = ({ icon }: { icon: IconNames }) => {
        const IconComponent = Icons[icon];
      
        if (!IconComponent) {
          return <Icons.RiLoaderFill/>;
        }
      
        return <IconComponent/>;
    };

    const handleSearch = (inputText:any) =>{
        setSearch(inputText)
    }

    return(
        <div className="flex flex-col w-full h-full">
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
                <TextSubtitle text={'list of menu'}/>
                <label htmlFor="modal-add" onClick={()=>initialState()} className={`rounded-md bg-white border-primary border-1 border px-3.5 py-2.5 mb-3 text-sm text-primary shadow-sm hover:bg-secondary-focus hover:border-secondary-focus hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-focus cursor-pointer`}>Add Menu</label>
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
                            <th onClick={() => handleSort('menu')} scope="col" className={`cursor-pointer py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                                <div className="flex flex-row text-xs items-center justify-center">
                                    Menu
                                    {sortColumn === "menu" && sortOrder === "asc" ? <TiArrowSortedUp/> : <TiArrowSortedDown/>}
                                </div>
                            </th> 
                        </tr>

                        <tr className={`${mobile && 'hidden'}`}>
                            <th className={`w-[20px] cursor-pointer px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                               # 
                            </th>
                            <th onClick={() => handleSort('menu')} scope="col" className={`w-full cursor-pointer py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                                <div className="flex flex-row text-xs items-center justify-center">
                                    Menu
                                    {sortColumn === "menu" && sortOrder === "asc" ? <TiArrowSortedUp/> : <TiArrowSortedDown/>}
                                </div>
                            </th> 
                            <th onClick={() => handleSort('category')} scope="col" className={`cursor-pointer py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                                <div className="flex flex-row text-xs items-center justify-center">
                                    Category
                                    {sortColumn === "category" && sortOrder === "asc" ? <TiArrowSortedUp/> : <TiArrowSortedDown/>}
                                </div>
                            </th> 
                            <th onClick={() => handleSort('isactive')} scope="col" className={`cursor-pointer py-3 text-xs font-medium text-gray-500 uppercase tracking-wider`}>
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
                                            <div className="flex flex-row w-full justify-between max-w-[250px] whitespace-nowrap overflow-hidden overflow-ellipsis">
                                              <div>{item?.menu}</div>
                                              <div className=" text-[10px] text-gray-300">{item?.category}</div>
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
                                    <td className={`${mobile && 'hidden'} items-center flex flex-row justify-between px-6 py-4 text-xs text-gray-500`}>
                                        <div className="flex flex-row gap-3 items-center ">
                                            <div>
                                                <div className=" text-xl text-primary"><DynamicIcon icon={item.icon}/></div>
                                            </div>
                                            <div className="flex flex-col">
                                                {item?.menu}
                                                <div className=" text-[10px] text-gray-400">{item?.url}</div>
                                            </div>
                                        </div>
                                        <div className={`${!item?.sso && 'hidden'} cursor-pointer py-1 px-2 bg-primary text-white flex rounded-2xl text-[10px]`}>SSO available</div>
                                    </td>
                                    <td className={`${mobile && 'hidden'} px-6 py-4 text-xs text-gray-500`}>
                                        {item?.category}
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
                        <h1 className="text-sm font-bold text-secondary-focus">{id ? 'UPDATE MENU' : 'CREATE NEW MENU'}</h1>
                        <div className="flex flex-row items-center gap-2">
                            <label htmlFor="modal-add" onClick={()=>{initialState}} className="text-primary cursor-pointer"><RiCloseCircleFill className="w-7 h-7"/></label>
                        </div>
                    </div>

                    <select value={category} className="input input-sm input-bordered w-full mb-3 text-xs text-secondary" onChange={handleCategory} id='category' name="category">
                        <option value={''}>Select category</option>
                        {opsCategory.map((option:any, index:any) => (
                            <option key={index} value={option.id}>
                                {option.category}
                            </option>
                    ))}
                    </select>

                    <div className="flex flex-row gap-2 items-center">
                        <div className="flex w-full">
                            <div className="flex flex-col w-full">
                                <label className="block text-secondary-focus text-xs text mb-1" htmlFor={'menu'}>Menu</label>
                                <input type="text" value={menu} name="menu" id="menu" placeholder="Menu" className="input input-sm input-bordered w-full mb-3 text-xs" onChange={(id) => setMenu(id.target.value)} />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2">
                            <input type="checkbox" id="is_active" name="is_active" checked={isActive} onChange={handleIsActive} className="flex toggle toggle-primary toggle-sm"/>
                            <label className={`flex ${ isActive ? 'text-primary-focus':'text-secondary-focus'}  text-xs text`}>Active</label>
                        </div>
                    </div>

                    <div className="flex">
                        <div className="flex flex-col w-full">
                            <label className="block text-secondary-focus text-xs text mb-1" htmlFor={'icon'}>URL</label>
                            <input type="text" value={url} name="url" id="url" placeholder="URL" className="input input-sm input-bordered w-full mb-3 text-xs" onChange={(id) => setUrl(id.target.value)} />
                        </div>
                    </div>

                    <div className="flex">
                        <div className="flex flex-col w-full">
                            <label className="block text-secondary-focus text-xs text mb-1" htmlFor={'icon'}>SSO Key</label>
                            <input type="text" value={sso} name="sso" id="sso" placeholder="sso" className="input input-sm input-bordered w-full mb-3 text-xs" onChange={(id) => setSso(id.target.value)} />
                        </div>
                    </div>

                    <div className="flex flex-row gap-2 items-center">
                        <div className="flex flex-col w-full">
                            <label className="block text-secondary-focus text-xs text mb-1" htmlFor={'icon'}>Image</label>
                            <input type="text" value={image} name="image" id="image" placeholder="Image" className="input input-sm input-bordered w-full mb-3 text-xs" onChange={(id) => setImage(id.target.value)} />
                        </div>
                        <div className="flex flex-col w-full">
                            <label className="block text-secondary-focus text-xs text mb-1" htmlFor={'icon'}>Icon</label>
                            <input type="text" value={icon} name="icon" id="icon" placeholder="Icon" className="input input-sm input-bordered w-full mb-3 text-xs" onChange={(id) => setIcon(id.target.value)} />
                        </div>
                    </div>

                    <iframe className="mb-3"
                        title="React Icons"
                        width="100%"
                        height="200"
                        src="https://react-icons.github.io/react-icons/icons?name=ri"
                    />
                    
                    <label htmlFor="modal-add" onClick={handleSubmitData} className="btn btn-md w-full text-white bg-primary border-transparent hover:bg-primary-focus hover:border-transparent">Submit</label>
                </div>
            </div>

            <input type="checkbox" id="modal-delete" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box relative">
                    <label htmlFor="modal-delete" className="absolute right-3 top-3 text-primary cursor-pointer"><RiCloseCircleFill className="w-7 h-7"/></label>
                    <h1 className="text-sm text-secondary-focus">Are you sure to delete this menu?</h1>
                    <input type="text" value={id!} name="id" id="id" className="input input-bordered w-full" hidden />
                    <p className="text-center text-sm font-bold w-full my-3">{menu} - {category}</p>
                    <div className='flex justify-center items-center gap-2'>
                        <label htmlFor="modal-delete" className="btn w-1/2 bg-primary border-transparent hover:bg-secondary-focus hover:text-white hover:border-secondary-focus text-white" onClick={()=>handleDeleteData(id)}>Delete</label>
                        <label htmlFor="modal-delete" className="btn w-1/2 bg-white border-primary text-primary hover:bg-secondary-focus hover:text-white hover:border-secondary-focus">Cancel</label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LayoutMenu