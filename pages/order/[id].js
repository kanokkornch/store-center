import { useState, useEffect, useRef, Fragment } from 'react'
import { useRouter } from 'next/router'
import { getOrderDetail } from '../../services/order'
import { numberFormat } from '../../services/utills'
import { message, Spin, Alert, Divider } from 'antd'
import dayjs from 'dayjs'
import {
    Card, CardContent, Table, TableBody,
    TableCell, TableHead, TableRow, Button
} from '@material-ui/core'
import Image from 'next/image'
import Link from 'next/link'

function OrderDetailPage() {
    const router = useRouter()
    const { id } = router.query
    const [order, setOrder] = useState(null)
    useEffect(() => {
        if (id) {
            getOrderDetail(id).then(res => {
                if (res.success) {
                    setOrder(res.data)
                } else {
                    message.error(res.message)
                }
            }).catch(err => {
                message.error('service ไม่พร้อมใช้งานขณะนี้')
                console.error(`getOrderDetail`, err)
            })
        }

    }, [id])

    if (!order) {
        return <div className='antd-loading'><Spin tip="Loading..." /></div>
    }

    return (
        <div>
            <div>
                <h4>Order Detail for Order No. {id}</h4>
                วันที่สั่งซื้อ {dayjs(order.created_at).format('DD MMM YYYY HH:mm')}
            </div>
            <div className="row">
                <div className="col-12 mt-3">
                    <Card>
                        <CardContent>
                            <div className="h5">รายละเอียดของลูกค้า</div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className='mb-3 text-decoration-underline'>ข้อมูลเบื้องต้นของลูกค้า</div>
                                    <div className="row">
                                        <div className="col-md-6 mb-0 mb-md-3">
                                            <label className="form-label">ชื่อผู้ซื้อ</label>
                                            <div>{order.name}</div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">รหัสลูกค้า</label>
                                            <div>SFM{order.user_id}</div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">จำนวนพัสดุที่จัดส่งสำเร็จ</label>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">อัตราพัสดุที่จัดส่งสำเร็จ</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 mt-4 mt-md-0">
                                    <div className='mb-3 text-decoration-underline'>ที่อยู่จัดส่ง</div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label className="form-label">ชื่อผู้รับ</label>
                                            <div>{order.name}</div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">รายละเอียดที่อยู่สำหรับจัดส่ง</label>
                                            <div>{`${order.address} ${order.district} ${order.amphure} ${order.province} ${order.zipcode}`}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-md-6 my-3">
                    <Card>
                        <CardContent>
                            <div className="h5">ข้อมูลการชำระเงินของฉัน</div>
                            <div> <Alert description="ข้อมูลธุรกรรมที่รอการอัปเดต โปรดรอสักครู่" type="info" showIcon /></div>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-md-6 my-3 mt-0 mt-md-3">
                    <Card>
                        <CardContent>
                            <div className="h5">ข้อมูลการชำระเงินของลูกค้า</div>
                            <div>
                                <div className="row">
                                    <div className="col-8 summary-content">
                                        <span>ผลรวม</span>
                                        <span>ค่าจัดส่ง</span>
                                        <span>ส่วนลด</span>
                                        <Divider />
                                        <span>Grand Total:</span>
                                    </div>
                                    <div className="col-4 summary-content">
                                        <span>{numberFormat(order.total_amount)}</span>
                                        <span>{numberFormat(order.shipping_fee)}</span>
                                        <span>{numberFormat(order.discount)}</span>
                                        <Divider />
                                        <span>{numberFormat(order.total_amount)}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-12">
                    <div className="h5">รายการสินค้า</div>
                    <div className='table-overflow'>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ minWidth: '260px' }}>รายการสินค้า</TableCell>
                                    <TableCell style={{ minWidth: '115px' }}>รหัสสินค้า</TableCell>
                                    <TableCell align="right" style={{ minWidth: '115px' }}>ยอดทั้งหมด</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {order.order_details.map((row) => (
                                    <TableRow key={row.name}>
                                        <TableCell component="th" scope="row">
                                            <div className='d-inline-flex'>
                                                <Image src={row.product_thumbnail} width={40} height={40} />
                                                <div className='d-flex flex-column ms-2'>
                                                    <span className='fw-500'>{row.product_name}</span>
                                                    {row.product_option_name && <span>{row.product_option_name} : {row.product_option_value}</span>}
                                                    <span>จำนวน: {row.product_qty}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{row.product_id}</TableCell>
                                        <TableCell align="right">{numberFormat(row.total_amount)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <div className="col-12 mt-3 text-end">
                    <Card>
                        <CardContent>
                            <Button variant="outlined">
                                <Link href="/order">
                                    <a style={{ color: 'currentColor' }}>กลับหน้ารายการ</a>
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default OrderDetailPage
