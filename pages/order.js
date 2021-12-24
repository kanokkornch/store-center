import { useState, useEffect, useRef, Fragment } from 'react'
import {
    Card, CardContent, CardAction, Fade, Paper, Button,
    AppBar, Tabs, Tab, Typography, Box, Badge,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TablePagination, TableRow, TableSortLabel, Checkbox,
    Snackbar
} from '@material-ui/core'
import { notification, message, Modal, Button as AntdButton } from 'antd'

function OrderPage() {
    const [tab, setTab] = useState(0)

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
                <Tab label="รอการชำระเงิน" {...a11yProps(1)} />
                <Tab label="สินค้าที่ต้องบรรจุ" {...a11yProps(2)} />
                <Tab label="ที่ต้องจัดส่ง" {...a11yProps(3)} />
                <Tab label="จัดส่งแล้ว" {...a11yProps(4)} />
                <Tab label="ส่งแล้ว" {...a11yProps(5)} />
                <Tab label="สินค้าถูกยกเลิก" {...a11yProps(6)} />
                <Tab label="สินค้าถูกคืน" {...a11yProps(7)} />
                <Tab label="จัดส่งไม่สำเร็จ" {...a11yProps(8)} />
                <Tab label={<Badge badgeContent={1} color="primary">
                    Messages
                </Badge>} {...a11yProps(8)} />
            </Tabs>
        </div>
    )
}

export default OrderPage
