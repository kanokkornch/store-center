import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import AssessmentIcon from '@material-ui/icons/Assessment'
import StorefrontIcon from '@material-ui/icons/Storefront';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn'
import AccountBoxIcon from '@material-ui/icons/AccountBox';
export const SidebarData = [
    {
        id: 0,
        title: 'Dashbord',
        prefix: '/dashbord',
        icon: <AssessmentIcon />,
    },
    {
        id: 1,
        title: 'สินค้า',
        prefix: '/product',
        icon: <ShoppingBasketIcon />,
        subNav: [
            {
                title: 'จัดการสินค้า',
                path: ''
            },
            {
                title: 'เพิ่มสินค้า',
                path: '/creation'
            },
            {
                title: 'โปรโมชั่น',
                path: '/promotion'
            },
        ]
    },
    {
        id: 2,
        title: 'คำสั่งซื้อ',
        prefix: '/order',
        icon: <LibraryBooksIcon />,
        subNav: [
            {
                title: 'คำสั่งซื้อ',
                path: ''
            },
            {
                title: 'การคืนสินค้า',
                path: '/reverse'
            },
            // {
            //     title: 'รีวิว',
            //     path: '/review'
            // },
        ]
    },
    {
        id: 3,
        title: 'จัดการร้านค้า',
        prefix: '/shop',
        icon: <StorefrontIcon />,
        subNav: [
            {
                title: 'ตกแต่งร้านค้า',
                path: '/pageManage'
            },
            {
                title: 'ตั้งค่าร้านค้า',
                path: '/infoSetting'
            },
        ]
    },
    {
        id: 4,
        title: 'การเงิน',
        prefix: '/finance',
        icon: <MonetizationOnIcon />,
        subNav: [
            {
                title: 'รายการเดินบัญชี',
                path: '/statement'
            }
        ]
    },
    {
        id: 5,
        title: 'บัญชีของฉัน',
        prefix: '/account',
        icon: <AccountBoxIcon />,
        subNav: [
            {
                title: 'ข้อมูลส่วนตัว',
                path: '/profile'
            },
            {
                title: 'ตั้งค่าบัญชี',
                path: '/setting'
            }
        ]
    },

]

