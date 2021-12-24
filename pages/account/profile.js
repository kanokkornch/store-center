import { useState, useEffect, useRef, Fragment } from 'react'
import { Tabs, Radio, Button } from 'antd'
import StoreIcon from '@material-ui/icons/Store'
import CreditCardIcon from '@material-ui/icons/CreditCard'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'
import { CardContent, Card } from '@material-ui/core'

import BankComponent from './components/bank'
import SellerComponent from './components/seller'
import BusinessComponent from './components/business'
import AddressComponent from './components/address'

import { getAllBanks } from '../../services/utills'


function ProfilePage() {
    const [active, setActive] = useState(1)
    const [banks, setBanks] = useState([])

    const menu = [
        { id: 1, name: 'ข้อมูลบัญชีผู้ใช้งาน', icon: <StoreIcon /> },
        { id: 2, name: 'ข้อมูลทางธุรกิจ', icon: <StoreIcon /> },
        { id: 3, name: 'บัญชีธนาคาร', icon: <CreditCardIcon /> },
        { id: 4, name: 'ที่อยู่คลังสินค้า', icon: <CreditCardIcon /> }
    ]
    useEffect(async () => {
        const banks = await getAllBanks()
        setBanks(banks)
    }, [])
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
                        {active === 1 && <SellerComponent />}
                        {active === 2 && <BusinessComponent />}
                        {active === 3 && <BankComponent banks={banks} />}
                        {active === 4 && <AddressComponent />}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ProfilePage
