import { useState, useEffect, useRef, Fragment } from 'react'
import { useRouter } from 'next/router'
import { Button } from '@material-ui/core'
import { getShopInfo } from '../../services/shop'
import { getSelectedOrders } from '../../services/order'
import { numberFormat } from '../../services/utills'
import { Spin, message } from 'antd'
import moment from 'moment'
import Link from 'next/link'

function Label() {
    const router = useRouter()
    const { id, type } = router.query
    const [shopInfo, setShopInfo] = useState(null)
    const [orders, setOrders] = useState(null)
    useEffect(() => {
        document.title = 'พิมพ์'
    })
    const fetchShopInfo = async () => {
        const shop = await getShopInfo()
        setShopInfo(shop.data)
    }
    useEffect(() => {
        if (id && type) {
            fetchShopInfo()
            getSelectedOrders(id.split(',')).then(res => {
                if (res.success) {
                    setOrders(res.data)
                } else {
                    message.error(res.message)
                }
            }).catch(err => {
                message.error('service ไม่พร้อมใช้งานขณะนี้')
                console.error(`getSelectedOrders`, err)
            })
        }
    }, [id, type])
    if (!shopInfo || !orders) {
        return <div className="antd-loading">
            <Spin spinning={true} tip='loading...'></Spin>
        </div>
    }
    return (
        <div>

            <div className='print-label'>
                <div className="header">
                    <div className="h3">Print Your Document</div>
                    <div className='d-flex col-gap-15'>
                        <Button variant="contained"
                            color="primary"
                            onClick={() => window.print()}
                        >
                            พิมพ์
                        </Button>
                        <Button variant="outlined">
                            <Link href="/order">
                                <a>สำเร็จ</a>
                            </Link>
                        </Button>

                    </div>
                </div>
                {orders.map(order => (<>
                    <div className="preview">
                        {type === 'invoice' ? <>
                            <div className='text-end'>
                                <div>{shopInfo.name}</div>
                                <div>{`${shopInfo.address} ${shopInfo.district} ${shopInfo.amphure}`}</div>
                                <div>{shopInfo.province} {shopInfo.zipcode}</div>
                            </div>
                            {order.invoice_required === 1 ? <div>
                                <div>{order.invoice_name}</div>
                                <div>{`${order.invoice_address} ${order.invoice_district} ${order.invoice_amphure}`}</div>
                                <div>{order.invoice_province} {order.invoice_zipcode}</div>
                            </div> : <div>
                                <div>{order.name}</div>
                                <div>{`${order.address} ${order.district} ${order.amphure}`}</div>
                                <div>{order.province} {order.zipcode}</div>
                            </div>}
                            <div className='mt-3'>Date: {moment(order.created_at).format('DD MMM YYYY')}</div>
                            <div>Invoice-No.: INV - SHOPCHILL{order.id}</div>
                            <div>Order no. : {order.id}</div>
                            <div className='mt-3 mb-2'>Your ordered items</div>
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Product name</th>
                                        <th scope="col">Option</th>
                                        <th scope="col" className='text-end'>Price</th>
                                        <th scope="col" className='text-end'>Paid Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.order_detail.map((item, idx) => <tr>
                                        <th scope="row">{idx + 1}</th>
                                        <td>{item.product_name}</td>
                                        <td>{<div className='d-flex justify-content-between'>
                                            <span>{!item.product_option_id ? item.product_name : `${item.product_option_name}: ${item.product_option_value}`}</span>
                                            <span>x {item.product_qty}</span>
                                        </div>}</td>
                                        <td className='text-end'>{numberFormat(item.product_sell_price)}</td>
                                        <td className='text-end'>{numberFormat(item.total_amount)}</td>
                                    </tr>)}

                                </tbody>
                            </table>
                            <div className="d-flex">
                                <div className="w-50" />
                                <div className="w-50 invoice-summary">
                                    <div>Sub total</div>
                                    <div>{numberFormat(order.sub_total_amount)}</div>
                                    <div>Voucher</div>
                                    <div>{numberFormat(order.discount)}</div>
                                    <div>Total</div>
                                    <div>{numberFormat(order.total_amount)}</div>
                                </div>
                            </div>
                        </>
                            : <div>
                                ใบปะหน้า
                            </div>}

                    </div>
                    <div style={{ pageBreakAfter: 'always' }}></div>
                </>))}
            </div>
        </div>

    )
}

export default Label
