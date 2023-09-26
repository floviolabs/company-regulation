import { BsJournalBookmarkFill } from 'react-icons/bs'
import { FaUsers } from 'react-icons/fa'
import { MdCategory } from 'react-icons/md'

const menu = [
    {
        "name":"menu",
        "icon":"",
        "link":"",
        "astitle":true,
        "assubmenu":false,
        "havesubmenu":false,
        "submenu":[],
        "role":"admin"
    },
    {
        "name":"company regulation",
        "icon":<BsJournalBookmarkFill/>,
        "link":"document",
        "astitle":false,
        "assubmenu":false,
        "havesubmenu":false,
        "submenu":[],
        "role":"admin"
    },
    {
        "name":"employee list",
        "icon":<FaUsers/>,
        "link":"employee",
        "astitle":false,
        "assubmenu":false,
        "havesubmenu":false,
        "submenu":[],
        "role":"admin"
    },
]

export default menu