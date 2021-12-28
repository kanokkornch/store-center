import { useState, useEffect, useRef, Fragment } from 'react'

function PromotionPage() {
    useEffect(() => {
        document.title = 'โปรโมชั่น'
    }, [])
    return (
        <div>
            <div className="h4">เพิ่มโปรโมชั่น</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row flex-row">
                    <Card className='mb-3'>
                        <CardContent>
                            <div className="h5 mb-2">โปรโมชั่นทั้งหมด</div>
                            <div className='row'>
                                <div className='col-12 col-xs-12 col-md-6 mb-3'>
                                    <Link href="/product/discount-list">
                                        <div className='p-3' style={{backgroundColor:'#F5F8FD',borderRadius:'10px',height:'104px'}}>
                                            <div className='row d-flex align-items-center'>
                                                <div className='col-4 col-xs-4 col-md-1'>
                                                    <div style={{backgroundColor:'white', width:'64px', height:'64px', borderRadius:'10px'}} className=' d-flex align-items-center justify-content-center'>
                                                        <ConfirmationNumberIcon fontSize='large' style={{color:'#FF7441'}}/>
                                                    </div>
                                                </div>
                                                <div className='col-8 col-xs-8 col-md-11'>
                                                    <div style={{marginLeft:'10px'}}>
                                                        <h5 className="h5 mb-2">คูปองส่วนลดร้านค้า</h5>
                                                        <p className="mb-2 mobile-none">เพิ่มยอดเข้าชมและยอดขายง่ายๆ ด้วยคูปองส่วนลดร้านค้า ลูกค้าสามารถกดรับคูปองได้เองที่หน้าร้านค้าของคุณ</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className='col-12 col-xs-12 col-md-6 mb-3'>
                                    <div className='p-3' style={{backgroundColor:'#F5F8FD',borderRadius:'10px', height:'104px'}}>
                                        <div className='row d-flex align-items-center'>
                                            <div className='col-4 col-xs-4 col-md-1'>
                                                <div style={{backgroundColor:'white', width:'64px', height:'64px', borderRadius:'10px'}} className=' d-flex align-items-center justify-content-center'>
                                                    <LocalShippingIcon fontSize='large' style={{color:'#01BFA6'}}/>
                                                </div>
                                            </div>
                                            <div className='col-8 col-xs-8 col-md-11'>
                                                <div style={{marginLeft:'10px'}}>
                                                    <h5 className="h5 mb-2">ฟรีค่าจัดส่ง</h5>
                                                    <p className="mb-2 mobile-none">โดดเด่นเหนือคู่แข่งด้วยโปรโมชั่นฟรีค่าจัดส่ง สินค้าที่ร่วมโปรโมชั่นจะได้รับสัญลักษณ์รถบรรทุกสีเขียวเพื่อแสดงให้ลูกค้ารู้ว่ามีส่วนลดค่าจัดส่ง</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12 col-xs-12 col-md-6 mb-3'>
                                    <div className='p-3 ' style={{backgroundColor:'#F5F8FD',borderRadius:'10px', height:'104px'}}>
                                        <div className='row d-flex align-items-center'>
                                            <div className='col-4 col-xs-4 col-md-1'>
                                                <div style={{backgroundColor:'white', width:'64px', height:'64px', borderRadius:'10px'}} className=' d-flex align-items-center justify-content-center'>
                                                    <LocalActivityIcon fontSize='large' style={{color:'#FF7441'}}/>
                                                </div>
                                            </div>
                                            <div className='col-8 col-xs-8 col-md-11'>
                                                <div style={{marginLeft:'10px'}}>
                                                    <h5 className="h5 mb-2">Bundles</h5>
                                                    <p className="mb-2 mobile-none">ดึงดูดลูกค้าและเพิ่มยอดคำสั่งซื้อได้ด้วยการสร้าง Bundles โปรโมชั่นส่วนลดเมื่อซื้อครบตามจำนวนที่กำหนด เช่น โปรโมชั่น ซื้อ 1 แถม 1 และโปรโมชั่นส่วนลดเมื่อซื้อครบเซ็ท</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12 col-xs-12 col-md-6 mb-3'>
                                    <div className='p-3 ' style={{backgroundColor:'#F5F8FD',borderRadius:'10px', height:'104px'}}>
                                        <div className='row d-flex align-items-center'>
                                            <div className='col-4 col-xs-4 col-md-1'>
                                                <div style={{backgroundColor:'white', width:'64px', height:'64px', borderRadius:'10px'}} className=' d-flex align-items-center justify-content-center'>
                                                    <FiberNewIcon fontSize='large' style={{color:'#FF7441'}}/>
                                                </div>
                                            </div>
                                            <div className='col-8 col-xs-8 col-md-11'>
                                                <div style={{marginLeft:'10px'}}>
                                                    <h5 className="h5 mb-2">คูปองร้านค้าสำหรับลูกค้าใหม่</h5>
                                                    <p className="mb-2 mobile-none">กระตุ้นยอดขายด้วยคูปองร้านค้าสำหรับลูกค้าใหม่ ลูกค้าจะได้รับส่วนลดเมื่อซื้อสินค้าที่ร้านคุณครั้งแรก</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    )
}

export default PromotionPage
