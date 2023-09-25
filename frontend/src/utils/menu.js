import { BsChevronDown, BsClipboardDataFill, BsFileEarmarkArrowDownFill, BsFileEarmarkArrowUpFill, BsFillDatabaseFill, BsFillBoxFill } from 'react-icons/bs'
import { FaHome, FaSearch, FaList, FaUserCog } from 'react-icons/fa'
import { TbReportAnalytics, TbSubtask} from 'react-icons/tb'
import { HiDocumentChartBar, HiDocumentMagnifyingGlass, HiDocumentText } from 'react-icons/hi2'
import { RiCustomerService2Line } from 'react-icons/ri'
import { MdCategory,MdOutlineHistory } from 'react-icons/md'
import { CgMenuGridR } from 'react-icons/cg'

const menu = [
    {
        "name":"settings",
        "icon":"",
        "link":"",
        "astitle":true,
        "assubmenu":false,
        "havesubmenu":false,
        "submenu":[],
        "role":"admin"
    },
    {
        "name":"categories",
        "icon":<MdCategory/>,
        "link":"categories",
        "astitle":false,
        "assubmenu":false,
        "havesubmenu":false,
        "submenu":[],
        "role":"admin"
    },
    {
        "name":"menus",
        "icon":<CgMenuGridR/>,
        "link":"menus",
        "astitle":false,
        "assubmenu":false,
        "havesubmenu":false,
        "submenu":[],
        "role":"admin"
    },
    {
        "name":"logs",
        "icon":<MdOutlineHistory/>,
        "link":"logs",
        "astitle":false,
        "assubmenu":false,
        "havesubmenu":false,
        "submenu":[],
        "role":"admin"
    }
]

export default menu