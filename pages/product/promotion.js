import { useState, useEffect, useRef, Fragment } from 'react'
import { Card, CardContent, Tabs, Tab } from '@material-ui/core'
import Link from 'next/link'

import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber'
import LocalShippingIcon from '@material-ui/icons/LocalShipping'
import LocalActivityIcon from '@material-ui/icons/LocalActivity'
import FiberNewIcon from '@material-ui/icons/FiberNew'

function PromotionPage() {
    useEffect(() => {
        document.title = 'โปรโมชั่น'
    })
    return (
        <div>
            <div className="h4">โปรโมชั่น</div>
            <Card className='mt-3'>
                <CardContent>
                    <div className='coupon-items'>
                        <Link href='/product/promotion/voucher'>
                            <div className="coupon-card">
                                <div className="icon">
                                    <ConfirmationNumberIcon style={{ color: '#FF7441' }} />
                                </div>
                                <div className="detail">
                                    <div className="title">คูปองส่วนลดร้านค้า</div>
                                    <div className="description">
                                        เพิ่มยอดเข้าชมและยอดขายง่ายๆ ด้วยคูปองส่วนลดร้านค้า ลูกค้าสามารถกดรับคูปองได้เองที่หน้าร้านค้าของคุณ
                                    </div>
                                </div>
                            </div>
                        </Link>
                        <Link href='/product/promotion/freeShipping'>
                            <div className="coupon-card">
                                <div className="icon">
                                    <LocalShippingIcon style={{ color: '#01BFA6' }} />
                                </div>
                                <div className="detail">
                                    <div className="title">ฟรีค่าจัดส่ง</div>
                                    <div className="description">
                                        โดดเด่นเหนือคู่แข่งด้วยโปรโมชั่นฟรีค่าจัดส่ง สินค้าที่ร่วมโปรโมชั่นจะได้รับสัญลักษณ์รถบรรทุกสีเขียวเพื่อแสดงให้ลูกค้ารู้ว่ามีส่วนลดค่าจัดส่ง
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                    {/* <div className="h5 mb-2">โปรโมชั่นทั้งหมด</div>
                        <div className='row'>
                            <div className='col-12 col-xs-12 col-md-6 mb-3'>
                                <div className='p-3 ' style={{ backgroundColor: '#F5F8FD', borderRadius: '10px', height: '104px' }}>
                                    <div className='row d-flex align-items-center'>
                                        <div className='col-4 col-xs-4 col-md-1'>
                                            <div style={{ backgroundColor: 'white', width: '64px', height: '64px', borderRadius: '10px' }} className=' d-flex align-items-center justify-content-center'>
                                                <LocalActivityIcon fontSize='large' style={{ color: '#FF7441' }} />
                                            </div>
                                        </div>
                                        <div className='col-8 col-xs-8 col-md-11'>
                                            <div style={{ marginLeft: '10px' }}>
                                                <h5 className="h5 mb-2">Bundles</h5>
                                                <p className="mb-2 mobile-none">ดึงดูดลูกค้าและเพิ่มยอดคำสั่งซื้อได้ด้วยการสร้าง Bundles โปรโมชั่นส่วนลดเมื่อซื้อครบตามจำนวนที่กำหนด เช่น โปรโมชั่น ซื้อ 1 แถม 1 และโปรโมชั่นส่วนลดเมื่อซื้อครบเซ็ท</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-12 col-xs-12 col-md-6 mb-3'>
                                <div className='p-3 ' style={{ backgroundColor: '#F5F8FD', borderRadius: '10px', height: '104px' }}>
                                    <div className='row d-flex align-items-center'>
                                        <div className='col-4 col-xs-4 col-md-1'>
                                            <div style={{ backgroundColor: 'white', width: '64px', height: '64px', borderRadius: '10px' }} className=' d-flex align-items-center justify-content-center'>
                                                <FiberNewIcon fontSize='large' style={{ color: '#FF7441' }} />
                                            </div>
                                        </div>
                                        <div className='col-8 col-xs-8 col-md-11'>
                                            <div style={{ marginLeft: '10px' }}>
                                                <h5 className="h5 mb-2">คูปองร้านค้าสำหรับลูกค้าใหม่</h5>
                                                <p className="mb-2 mobile-none">กระตุ้นยอดขายด้วยคูปองร้านค้าสำหรับลูกค้าใหม่ ลูกค้าจะได้รับส่วนลดเมื่อซื้อสินค้าที่ร้านคุณครั้งแรก</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}

                </CardContent>
            </Card>
        </div>
    )
}

export default PromotionPage
