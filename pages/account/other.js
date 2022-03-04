import { useState, useEffect, useRef, Fragment } from 'react'
import { Tabs, Radio, Button, Spin } from 'antd'
import { CardContent, Card } from '@material-ui/core'
import { getShopInfo } from '../../services/shop'

function Other() {
    const [shop, setShop] = useState(null)
    const fetchShopInfo = async () => {
        const shop = await getShopInfo()
        setShop(shop.data)
    }
    useEffect(() => {
        fetchShopInfo()
    }, [])
    if (!shop) {
        return <div className="antd-loading">
            <Spin tip='loading...'></Spin>
        </div>
    }
    return (
        <div>
            <div className="h4">การตั้งค่าบัญชี</div>
            <Card className='mt-3'>
                <CardContent>
                    <div className='other-info'>
                        <div className='text-sm-end'>อีเมลที่ใช้เข้าสู่ระบบ</div>
                        <div>{shop.email}</div>
                        <div className='text-sm-end'>เบอร์โทรศัพท์ที่ใช้เข้าสู่ระบบ</div>
                        <div>{shop.phone}</div>
                        <div className='text-sm-end'>รหัสผ่าน</div>
                        <div>รหัสผ่านต้องมีอย่างน้อย 8 อักษร และต้องมีทั้งตัวอักษร ตัวเลขและสัญลักษ์พิเศษ</div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Other
