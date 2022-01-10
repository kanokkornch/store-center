import { useState, useEffect, useRef, Fragment } from 'react'
import { Tabs, Radio, Button } from 'antd'
import StoreIcon from '@material-ui/icons/Store'
import CreditCardIcon from '@material-ui/icons/CreditCard'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'
import { CardContent, Card } from '@material-ui/core'

import IdCardComponent from './components/idcard'
import BankComponent from './components/bank'
import SellerComponent from './components/seller'
import BusinessComponent from './components/business'
import AddressComponent from './components/address'

import { getAllBanks } from '../../services/utills'
import { getShopInfo } from '../../services/shop'
import { shopVerificationInfo } from '../../services/verification'

import { Spin } from 'antd'


function ProfilePage() {
    const [active, setActive] = useState(0)
    const [banks, setBanks] = useState([])
    const [shop, setShop] = useState(null)
    const [verify, setVerify] = useState(null)

    const menu = [
        { id: 0, name: 'ยืนยันตัวตน', icon: <StoreIcon /> },
        { id: 1, name: 'ข้อมูลบัญชีผู้ใช้งาน', icon: <StoreIcon /> },
        { id: 2, name: 'ข้อมูลทางธุรกิจ', icon: <StoreIcon /> },
        { id: 3, name: 'บัญชีธนาคาร', icon: <CreditCardIcon /> },
        { id: 4, name: 'ที่อยู่คลังสินค้า', icon: <CreditCardIcon /> }
    ]
    const fetchShopInfo = async () => {
        const shop = await getShopInfo()
        setShop(shop.data)
    }
    const fetchShopVerifyInfo = async () => {
        const resVerify = await shopVerificationInfo()
        setVerify(resVerify.data)
    }

    useEffect(async () => {
        const banks = await getAllBanks()
        setBanks(banks)
        await fetchShopInfo()
        await fetchShopVerifyInfo()
    }, [])
    if (!shop && !verify) {
        return <div className="antd-loading">
            <Spin tip='loading...'></Spin>
        </div>
    }
    return (
        <div className="row">
            <div className="col-md-4 d-flex flex-column acc-setting">
                {menu.map(it => (
                    <Button
                        key={it.id}
                        className={it.id === active ? 'active' : ''}
                        onClick={() => setActive(it.id)}
                    >
                        {/* {it.icon} */}
                        <span className='ms-3'>{it.name}</span>
                    </Button>
                ))}
            </div>
            <div className="col-md-8 mt-md-0 mt-3">
                <Card>
                    <CardContent>
                        {active === 0 && <IdCardComponent
                            shop={shop}
                            fetchShopInfo={fetchShopInfo}
                            verify={verify}
                            fetchShopVerifyInfo={fetchShopVerifyInfo}
                        />}
                        {active === 1 && <SellerComponent shop={shop} />}
                        {active === 2 && <BusinessComponent shop={shop} fetchShopInfo={fetchShopInfo} />}
                        {active === 3 && <BankComponent
                            banks={banks}
                            verify={verify}
                            fetchShopVerifyInfo={fetchShopVerifyInfo}
                        />}
                        {active === 4 && <AddressComponent shop={shop} fetchShopInfo={fetchShopInfo} />}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ProfilePage
