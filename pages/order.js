import { useState, useEffect, useRef, Fragment } from 'react'
import {
    Card, CardContent, CardAction, Fade, Paper, Button,
    AppBar, Tabs, Tab, Typography, Box, Badge,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TablePagination, TableRow, TableSortLabel, Checkbox,
    Snackbar
} from '@material-ui/core'
import {
    notification, message, Modal,
    Button as AntdButton, DatePicker,
    Menu, Dropdown
} from 'antd'
import FilterListIcon from '@material-ui/icons/FilterList'
import OrderTable from '../components/OrderTable'
import { getOrders } from '../services/order'
import { DownOutlined, UserOutlined } from '@ant-design/icons'

const { RangePicker } = DatePicker

function OrderPage() {
    const [tab, setTab] = useState(0)
    const [orders, setOrders] = useState([])
    const [notFound, setNotFound] = useState(false)
    useEffect(() => {
        document.title = "Order"
    })
    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = () => {
        getOrders().then(res => {
            if (res.success) {
                setOrders(res.data)
                res.data.length > 0 ? setNotFound(false) : setNotFound(true)
            } else {
                message.error(res.message)
            }
        }).catch(err => {
            message.error('service ไม่พร้อมใช้งานขณะนี้')
            console.error(`fetchOrders`, err)
        })
    }


    function a11yProps(index) {
        return {
            id: `scrollable-auto-tab-${index}`,
            'aria-controls': `scrollable-auto-tabpanel-${index}`,
        };
    }
    const handleChangeTab = (e, newValue) => {
        setTab(newValue)
        e.preventDefault()
    }
    const resetFilter = () => {
        // setValue(0)
        // setFilterValue('')
        // setFilterTitle({ value: 'name', text: 'ชื่อสินค้า' })
        // setFilterParam({
        //     category_id: '',
        //     offset: 0,
        //     limit: 100,
        //     status: '',
        //     type: 'name',
        //     keyword: ''
        // })
    }
    const onFilter = (input, value) => {
        console.log(`input : ${input} | value: ${value}`)
    }

    const menu = (
        <Menu onClick={(e) => {
            if (e.key === '1') {

            }
            if (e.key === '2') {

            }
        }}>
            <Menu.Item key="1" >
                พิมพ์ใบกำกับสินค้า
            </Menu.Item>
            <Menu.Item key="2" >
                พิมพ์ฉลากสำหรับจัดส่ง
            </Menu.Item>
        </Menu>
    )
    return (
        <div>
            <div className="h4">Order</div>
            <Tabs
                value={tab}
                onChange={handleChangeTab}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
            >
                <Tab label="ทั้งหมด" {...a11yProps(0)} />
                <Tab label="คำสั่งซื้อใหม่" {...a11yProps(1)} />
                <Tab label="อยู่ระหว่างดำเนินการ" {...a11yProps(2)} />
                <Tab label="ยืนยันรายการสั่งซื้อ" {...a11yProps(3)} />
                <Tab label="ยกเลิกรายการสั่งซื้อ" {...a11yProps(4)} />
                <Tab label="ส่งกลับ" {...a11yProps(5)} />
                <Tab label="จัดส่งแล้ว" {...a11yProps(6)} />
                <Tab label="รายการเสร็จสมบูรณ์" {...a11yProps(7)} />
                {/* <Tab label={<Badge badgeContent={1} color="primary">
                    Messages
                </Badge>} {...a11yProps(8)} /> */}
            </Tabs>
            <Card className='my-3'>
                <CardContent>
                    <div className='mb-3 default-flex-between'>
                        <span>
                            <FilterListIcon className='me-2' />
                            ตัวกรองสินค้า
                        </span>
                        <Button onClick={resetFilter} variant="outlined" size="small" color="primary">
                            รีเซ็ต
                        </Button>
                    </div>
                    <div className='order-filter-container row'>
                        <div className="col-sm-3">
                            <RangePicker
                                onChange={(dates, dateStrings) => {
                                    // console.log('From: ', dates[0], ', to: ', dates[1])
                                    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1])
                                }}
                                className='w-100' />
                        </div>
                        <div className="col-sm-3 col-md-2 my-1 my-sm-0">
                            <input className="form-control"
                                placeholder='หมายเลขการสั่งซื้อ'
                                type="search"
                                onChange={e => onFilter('order_id', e.target.value)}
                                id="example-search-input" />
                        </div>
                        <div className="col-sm-3 col-md-2 mb-1 mb-sm-0">
                            <input className="form-control"
                                placeholder='หมายเลขติดตามพัสดุ'
                                type="search"
                                onChange={e => onFilter('tracking_no', e.target.value)}
                                id="example-search-input" />
                        </div>
                        <div className="col-sm-3 col-md-2">
                            <input className="form-control"
                                placeholder='ชื่อผู้ซื้อ'
                                type="search"
                                onChange={e => onFilter('name', e.target.value)}
                                id="example-search-input" />
                        </div>
                        <div className="col-sm-3 col-md-2 mt-1 mt-md-0">
                            <input className="form-control"
                                placeholder='จำนวนเงิน'
                                type="number"
                                onChange={e => onFilter('total_amount', e.target.value)}
                                id="example-search-input" />
                        </div>
                    </div>
                </CardContent>
            </Card>
            <OrderTable
                headCells={[
                    { id: 'id', numeric: false, disablePadding: true, label: 'หมายเลขการสั่งซื้อ' },
                    { id: 'name', numeric: false, disablePadding: false, label: 'ชื่อผู้ซื้อ' },
                    { id: 'total_amount', numeric: true, disablePadding: false, label: 'รวม' },
                    { id: 'created_at', numeric: false, disablePadding: false, label: 'วันที่สั่งซื้อ' },
                ]}
                rows={orders}
                notFound={notFound}
                tab={tab}
            />
        </div>
    )
}

export default OrderPage
