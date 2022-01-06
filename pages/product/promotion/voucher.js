import { useState, useEffect, useRef, Fragment } from 'react'
import { Card, CardContent, Tabs, Tab, Button } from '@material-ui/core'
import { Divider } from 'antd'
import Link from 'next/link'
import AddIcon from '@material-ui/icons/Add'
import BeenhereIcon from '@material-ui/icons/Beenhere'

function Voucher() {
    return (
        <div>
            {/* <div className="h4">คูปอง</div> */}
            <Card className='mt-3'>
                <CardContent>
                    <div className="h4 text-center mb-3 fw-bold">คูปองส่วนลดร้านค้า</div>
                    <div className='text-center'>เพิ่มมูลค่าคำสั่งซื้อโดยการมอบคูปองส่วนลดให้กับลูกค้า</div>
                    <div className="row mt-5">
                        {/* default-flex-between */}
                        <div className="col-md-4 d-flex justify-content-center">
                            <BeenhereIcon className='large-icon me-2' />
                            <span className="h4">เพิ่มอัตราการซื้อ</span>
                            {/* <Divider className='h-100' type="vertical" /> */}
                        </div>
                        <div className="col-md-4 d-flex justify-content-center">
                            <BeenhereIcon className='large-icon me-2' />
                            <span className="h4">เพิ่มการซื้อในร้านค้า</span>
                            {/* <Divider className='h-100' type="vertical" /> */}
                        </div>
                        <div className="col-md-4 d-flex justify-content-center">
                            <BeenhereIcon className='large-icon me-2' />
                            <span className="h4">เพิ่มมูลค่าคำสั่งซื้อ</span>
                        </div>
                    </div>
                    <div className="text-center mt-5">
                        <Link href={`/product/promotion/voucher/create`}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                            >
                                สร้างตอนนี้
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Voucher
