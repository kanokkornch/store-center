import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import AssessmentIcon from '@material-ui/icons/Assessment'
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
        // path: appPrefix('product'),
        // path: '/product',
        icon: <ShoppingBasketIcon />,
        // iconClosed: <ExpandMoreIcon />,
        // iconOpened: <ExpandLessIcon />,
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
                title: 'เพิ่ม/แก้ไขสินค้า',
                path: '/edition'
            }
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
            {
                title: 'รีวิว',
                path: '/review'
            },
        ]
    },

]

