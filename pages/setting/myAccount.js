import { useState, useEffect, useRef, Fragment } from 'react'
import { Tabs, Radio, Button } from 'antd'
import StoreIcon from '@material-ui/icons/Store'
import CreditCardIcon from '@material-ui/icons/CreditCard'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'
import { CardContent, Card } from '@material-ui/core'

import ShopComponent from './components/shop'
import BankComponent from './components/bank'
import InvoiceComponent from './components/invoice'

import { getAllBanks } from '../../services/utills'


function MyAccountPage() {
    const [active, setActive] = useState(1)
    const [banks, setBanks] = useState([])

    const menu = [
        { id: 1, name: 'ยืนยันตัวตน', icon: <StoreIcon /> },
        { id: 2, name: 'ยืนยันบัญชีธนาคาร', icon: <CreditCardIcon /> },
        // { id: 3, name: 'ใบกำกับภาษี', icon: <InsertDriveFileIcon /> },
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
                        {it.icon}
                        <span className='ms-3'>{it.name}</span>
                    </Button>
                ))}
            </div>
            <div className="col-md-8 mt-md-0 mt-3">
                <Card>
                    <CardContent>
                        {active === 1 && <ShopComponent />}
                        {active === 2 && <BankComponent banks={banks}/>}
                        {active === 3 && <InvoiceComponent />}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default MyAccountPage
