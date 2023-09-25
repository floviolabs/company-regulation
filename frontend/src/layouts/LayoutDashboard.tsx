import Compact from "@/utils/compact"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import router from "next/router"
import Link from "next/link";
import * as Icons from "react-icons/ri"
const CryptoJS = require('crypto-js');

const LayoutDashboard = () => {
    const mobile = Compact()
    const [token, setToken] = useState<string | null>(null)
    const endpoint = process.env.NEXT_PUBLIC_EP
    
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('arnUser')!))
    const [menuCategory, setMenuCategory] = useState<any[]>([])

    const storedToken = localStorage.getItem('arnToken')

    type IconNames = keyof typeof Icons; 
    
    const fetchAllMenu = useCallback(async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('arnToken')}`,
            },
          };
          const response = await axios.post(endpoint + 'menus/get-all', {}, config);
          setMenuCategory(response.data.data);
        } catch (error) {
          // Handle error here
        }
      }, []);

    useEffect(() => {
        if (!storedToken) {
          router.push('/login')
        } else {
          setToken(storedToken)
          fetchAllMenu()
        }
      }, [router,fetchAllMenu])

      const groupedData = menuCategory.reduce((res, menu) => {
        const existingCategory = res.find((item:any) => item.category === menu.category);
        if (existingCategory) {
          existingCategory.menus.push(menu);
        } else {
          res.push({ category: menu.category, menus: [menu] });
        }
        return res;
      }, []);
      
    const [isLoading, setIsLoading] = useState(false);

    const DynamicIcon = ({ icon }: { icon: IconNames }) => {
      const IconComponent = Icons[icon];
    
      if (!IconComponent) {
        return <Icons.RiLoaderFill/>;
      }
    
      return <IconComponent/>;
    };

    const clickPath = useCallback(async (path:any) => {
      try {
         
          const config = {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem('arnToken')}`,
              },
          };

          const x = {
              in_name: userData[0].name,
              in_path: path
          };

          await axios.post(endpoint + 'logs/submit', x, config)
          .catch(error => {
              console.error(error);
          });
      } catch (error) {
        // Handle error here
      }
    }, []
  );

  type FavoriteItem = {
    menu: string;
    icon: string;
    url: string;
    sso?: string;
  };

  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [newFavorite, setNewFavorite] = useState<FavoriteItem>({
    menu: '',
    sso: '',
    icon: '',
    url: '',
  });

  useEffect(() => {
    // Ambil data favorit dari localStorage saat komponen dimuat
    const storedFavorites = JSON.parse(localStorage.getItem('arnFavorites')!);
    if (storedFavorites) {
      setFavorites(storedFavorites);
    }
  }, []);

  useEffect(() => {
    // Simpan data favorit ke localStorage hanya jika ada perubahan
    if (favorites.length > 0) {
      localStorage.setItem('arnFavorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  const handleAddFavorite = (menu: string, icon: string, url: string, sso?: string) => {
    if (menu && icon && url) {
      const newFavoriteItem: FavoriteItem = { menu, icon, url, sso };
      setFavorites([...favorites, newFavoriteItem]);
      setNewFavorite({ menu: '', icon: '', url: '', sso: '' });
    }
  };

  const handleRemoveFavorite = (index: number) => {
    if (favorites.length === 1) {
      localStorage.removeItem('arnFavorites')
    }
    if (index >= 0 && index < favorites.length) {
      const updatedFavorites = [...favorites];
      updatedFavorites.splice(index, 1);
      setFavorites(updatedFavorites);
    }
  };
  
  

  return (
      <div className="flex flex-col overflow-y-auto w-full h-screen">
        <ul className="menu menu-xs w-full">
            <details  tabIndex={0} className="collapse border border-base-300 bg-base-200" open={window.location.hash.includes('#') ? ((window.location.hash == '#favorite') ? true : false) : true}>
                <summary className="collapse-title text-xl font-bold text-secondary uppercase">
                  Favorite
                </summary>
                <div className="collapse-content flex flex-row flex-wrap mt-3"> 
                  {
                    favorites.map((item:any,index:number)=>(
                      <div key={index} className={`flex flex-col gap-1 ${mobile ? 'w-1/2 p-1':'w-1/5 p-1'}`}>
                        <Link onClick={()=> clickPath(item.url)} href={item.sso ? (item.url + 'sso?token=' + localStorage.getItem('_XPlow') + 'x5*y84fw3421ss35-f43t=' + item.sso) :  item.url} target={'_blank'}>
                          <div className={`${mobile && ' items-center'} flex flex-col w-full h-[150px] bg-primary cursor-pointer p-3 rounded-md shover:bg-primary-focus text-white`}>
                            {item.menu}
                            <div className="flex h-full justify-center items-center text-[80px] text-white">
                              <DynamicIcon icon={item.icon}/>
                            </div>
                          </div>
                        </Link>   
                        <div className="text-xs text-primary cursor-pointer" onClick={()=>handleRemoveFavorite(index)}>Remove from favorite</div> 
                      </div>        
                    ))
                    // category.menus.map((menu:any) => (
                    //   <Link key={menu.menu} onClick={()=>menu.isactive && clickPath(menu.url)} href={menu.isactive ? (menu.sso ? (menu.url + 'sso?token=' + localStorage.getItem('_XPlow') + 'x5*y84fw3421ss35-f43t=' + menu.sso) :  menu.url) : '#' } target={`${menu.isactive ? '_blank' : ''}`} className={`flex ${mobile ? 'w-1/2 p-1':'w-1/5 p-1'}`}>
                    //     <div className={`${mobile && ' items-center'} flex flex-col w-full h-[150px] ${ menu.isactive ? 'bg-primary cursor-pointer':'bg-gray-300 cursor-default'} p-3 rounded-md shover:bg-primary-focus text-white`}>
                    //       {menu.menu}
                    //       <div className="flex h-full justify-center items-center text-[80px] text-white">
                    //         <DynamicIcon icon={menu.icon}/>
                    //       </div>
                    //     </div>
                    //   </Link>
                    // ))
                  }
                </div>
            </details>
        </ul>
        {
            groupedData.map((category:any) => (
              <ul key={category.category} className="menu menu-xs w-full">
                <details  tabIndex={0} className="collapse border border-base-300 bg-base-200" open={window.location.hash.includes('#') ? ((window.location.hash == '#' + category.category.replace(' ', '%20')) ? true : false) : true}>
                  <summary className="collapse-title text-xl font-bold text-secondary uppercase">
                    {category.category}
                  </summary>
                  <div className="collapse-content flex flex-row flex-wrap mt-3"> 
                    {
                      category.menus.map((menu:any) => (
                        <div key={menu.menu} className={`flex ${mobile ? 'w-1/2 p-1':'w-1/5 p-1'} flex-col gap-1`}>
                          <Link onClick={()=>menu.isactive && clickPath(menu.url)} href={menu.isactive ? (menu.sso ? (menu.url + 'sso?token=' + localStorage.getItem('_XPlow') + 'x5*y84fw3421ss35-f43t=' + menu.sso) :  menu.url) : '#' } target={`${menu.isactive ? '_blank' : ''}`} >
                            <div className={`${mobile && ' items-center'} flex flex-col w-full h-[150px] ${ menu.isactive ? 'bg-primary cursor-pointer':'bg-gray-300 cursor-default'} p-3 rounded-md shover:bg-primary-focus text-white`}>
                              {menu.menu}
                              <div className="flex h-full justify-center items-center text-[80px] text-white">
                                <DynamicIcon icon={menu.icon}/>
                              </div>
                            </div>
                          </Link>
                          {menu.isactive ? <div className="text-xs text-primary cursor-pointer" onClick={()=>handleAddFavorite(menu.menu,menu.icon,menu.url,menu.sso)}>Add to favorite</div> : ''}
                        </div>
                      ))
                    }
                  </div>
              </details>

                    {/* <details id={category.category} className={'duration-1000'} open={window.location.hash.includes('#') ? ((window.location.hash == '#' + category.category.replace(' ', '%20')) ? true : false) : true}>
                          <summary className="flex flex-row text-lg uppercase font-bold justify-between text-primary py-2 ml-3">
                              <div>{category.category}</div>
                          </summary>
                      <div className={`flex mx-5 flex-row flex-wrap mt-3`}>
                      {
                          category.menus.map((menu:any) => (
                            <Link key={menu.menu} href={menu.isactive ? (menu.sso ? (menu.url + 'sso?token=' + localStorage.getItem('_XPlow') + 'x5*y84fw3421ss35-f43t=' + menu.sso) :  menu.url) : '#' } target={`${menu.isactive ? '_blank' : ''}`} className={`flex ${mobile ? 'w-1/2 p-1':'w-1/4 p-1'}`}>
                              <div className={`${mobile && ' items-center'} flex flex-col w-full h-[150px] ${ menu.isactive ? 'bg-primary cursor-pointer':'bg-gray-300 cursor-default'} p-3 rounded-md shover:bg-primary-focus text-white`}>
                                {menu.menu}
                                <div className="flex h-full justify-center items-center text-[80px] text-white">
                                  <DynamicIcon icon={menu.icon}/>
                                </div>
                              </div>
                            </Link>
                          ))
                      }
                      </div>
                  </details> */}


              </ul>
            ))
        }
      </div>
  );
};


export default LayoutDashboard