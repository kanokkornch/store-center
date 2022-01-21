import { useEffect, useState, Fragment, useRef } from 'react'
import { Card, CardContent, CardAction } from '@material-ui/core'
import { StatisticCard } from '../components/ant'
import { Empty, Carousel, Progress } from 'antd'
import { LeftOutlined, RightOutlined } from "@ant-design/icons"
import { numberFormat } from '../services/utills'


function Dashbord() {
    useEffect(() => {
        document.title = 'Dashbord'
    }, [])
    const contentStyleArrow = {
        height: '120px',
        color: '#111',
        // lineHeight: '120px',
        // textAlign: 'center',
        // background: '#FAFAFA',
        background: 'transparent',
        marginBottom: '0px',
        // borderRadius: '10px'
    }
    const contentStyle = {
        height: '180px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
        marginBottom: '0px'
    }
    const chart = useRef(null)
    // useLayoutEffect(() => {
    //     let x = am4core.create("chartdiv", am4charts.XYChart);

    //     // ...

    //     chart.current = x;

    //     return () => {
    //         x.dispose();
    //     };
    // }, [])
    // useLayoutEffect(() => {
    //     chart.current.paddingRight = props.paddingRight;
    // }, [props.paddingRight])
    return (
        <div>
            <div className="row">
                <div className="col-md-8">
                    <Card>
                        <CardContent>
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="h5 mb-3">การวิเคราะห์ธุรกิจ</div>
                                    <StatisticCard
                                        title="ยอดขาย"
                                        value={0}
                                        tooltip='มูลค่าทั้งหมดที่ผู้ซื้อชำระจริงในช่วงเวลาที่เลือก โดยคำนวณส่วนลดของร้านค้า ค่าจัดส่ง และค่าธรรมเนียมเพิ่มเติมแล้ว'
                                    />
                                </div>
                                <div className="col-md-4">
                                    <div className="text-gray mb-3">เวลาอัพเดต 2022-02-20 11:59:05</div>
                                    <div className="d-flex mb-5">
                                        <div className="w-50">
                                            <StatisticCard
                                                title="ผู้เข้าชม"
                                                value={0}
                                                valueUnit=''
                                                type=''
                                                tooltip='จำนวนลูกค้าที่เข้าชมหน้าร้านในช่วงระยะเวลาที่เลือก โดยนับรวมทั้งหน้าร้านค้าและหน้าสินค้าทั้งหมด'
                                            />
                                        </div>
                                        <div className="w-50">
                                            <StatisticCard
                                                title="ผู้ซื้อ"
                                                value={0}
                                                valueUnit=''
                                                type=''
                                                tooltip='จำนวนผู้เข้าชมที่มีอย่างน้อย 1 คำสั่งซื้อในช่วงเวลาที่เลือก'
                                            />
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <div className="w-50">
                                            <StatisticCard
                                                title="ยอดเข้าชม"
                                                value={0}
                                                valueUnit=''
                                                type=''
                                                tooltip='จำนวนครั้งที่ลูกค้าเข้าชมหน้าร้านในช่วงระยะเวลาที่เลือก โดยนับรวมทั้งหน้าร้านค้าและหน้าสินค้าทั้งหมด'
                                            />
                                        </div>
                                        <div className="w-50">
                                            <StatisticCard
                                                title="คำสั่งซื้อ"
                                                value={0}
                                                valueUnit=''
                                                type=''
                                                tooltip='จำนวนคำสั่งซื้อในช่วงเวลาที่เลือก'
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-md-4 mt-4 mt-md-0">
                    <Card className='h-100'>
                        <CardContent>
                            <div className="h5">ลำดับสินค้าขายดี</div>
                            <div><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-md-4 mt-4">
                    <Card className='min-height-180'>
                        <CardContent>
                            <div className="h5">ประกาศ</div>
                            <div>โปรดทราบว่าข้อมูลของวันที่ 6 และ 11 พฤศจิกายน พ.ศ. 2564 อาจล่าช้าและพร้อมให้บริการไม่เกิน 12.00 น. ของวันที่ 7 และ 12 พ.ย. ตามลำดับ แดชบอร์ดประสิทธิภาพแบบเรียลไทม์และ Live Monitor จะไม่ได้รับผลกระทบ</div>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-md-4 mt-4">
                    <Card className='min-height-180'>
                        <CardContent>
                            <div className="h5">เคล็ดลับ</div>
                            <div></div>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-md-4 mt-4">
                    <Carousel className='dashbord' autoplay>
                        <div>
                            <h3 style={contentStyle}>1</h3>
                        </div>
                        <div>
                            <h3 style={contentStyle}>2</h3>
                        </div>
                    </Carousel>
                </div>
                <div className="col-12 mt-4">
                    <Card>
                        <CardContent className='text-center'>
                            วันนี้
                        </CardContent>
                    </Card>
                </div>
                <div className="col-12 mt-4">
                    <Card>
                        <CardContent>
                            <div className="h5 mb-4">ตัวชี้วัด</div>
                            <div>
                                <Carousel
                                    className='stat-cards'
                                    arrows={true}
                                    prevArrow={<LeftOutlined />}
                                    nextArrow={<RightOutlined />}
                                    afterChange={() => { }}>
                                    <div className='px-4'>
                                        <div className='d-flex col-gap-10' style={contentStyleArrow}>
                                            <StatisticCard
                                                title='ยอดขาย'
                                                value='500'
                                                classStyle='carousel-card'
                                            />
                                            <StatisticCard
                                                title='ผู้เข้าชม'
                                                type=''
                                                valueUnit=''
                                                classStyle='carousel-card'
                                            />
                                            <StatisticCard
                                                title='อัตราการซื้อ'
                                                valueUnit='percent'
                                                classStyle='carousel-card'
                                            />
                                            <StatisticCard
                                                title='ยอดขายต่อผู้ซื้อ'
                                                value='550'
                                                classStyle='carousel-card'
                                            />
                                        </div>
                                    </div>
                                    <div className='px-4'>
                                        <div className='d-flex col-gap-10' style={contentStyleArrow}>
                                            <StatisticCard
                                                title='ยอดเข้าชม'
                                                value='7'
                                                type=''
                                                valueUnit=''
                                                classStyle='carousel-card'
                                            />
                                            <StatisticCard
                                                title='ผู้ซื้อ'
                                                value='1'
                                                type=''
                                                valueUnit=''
                                                classStyle='carousel-card'
                                            />
                                            <StatisticCard
                                                title='คำสั่งซื้อ'
                                                value='1'
                                                type=''
                                                valueUnit=''
                                                classStyle='carousel-card'
                                            />
                                            <StatisticCard
                                                title='มูลค่าคำสั่งซื้อโดยเฉลี่ย'
                                                value='550'
                                                classStyle='carousel-card'
                                            />
                                        </div>
                                    </div>
                                    <div className='px-4'>
                                        <div className='d-flex col-gap-10' style={contentStyleArrow}>
                                            <StatisticCard
                                                title='จำนวนสินค้าที่ขายได้'
                                                value='1'
                                                type=''
                                                valueUnit=''
                                                classStyle='carousel-card'
                                            />
                                            <StatisticCard
                                                title='จำนวนชิ้นโดยเฉลี่ยต่อคำสั่งซื้อ'
                                                value='1'
                                                valueUnit=''
                                                classStyle='carousel-card'
                                            />
                                            <StatisticCard
                                                title='มูลค่าของผู้เข้าชม'
                                                value='137.50'
                                                classStyle='carousel-card'
                                            />
                                            <StatisticCard
                                                title='จำนวนผู้เข้าชมที่เพิ่มสินค้าลงตะกร้า'
                                                value='0'
                                                type=''
                                                valueUnit=''
                                                classStyle='carousel-card'
                                            />
                                        </div>
                                    </div>
                                    <div className='px-4'>
                                        <div className='d-flex col-gap-10' style={contentStyleArrow}>
                                            <StatisticCard
                                                title='จำนวนสินค้าในตะกร้า'
                                                value='0'
                                                type=''
                                                valueUnit=''
                                                classStyle='carousel-card'
                                            />
                                            <StatisticCard
                                                title='จำนวนผู้เข้าชมที่เพิ่มสินค้าในรายการที่ชอบ'
                                                value='0'
                                                type=''
                                                valueUnit=''
                                                classStyle='carousel-card'
                                            />
                                            <StatisticCard
                                                title='รายการสินค้าที่มีผู้ชื่นชอบ'
                                                value='0'
                                                type=''
                                                valueUnit=''
                                                classStyle='carousel-card'
                                            />
                                        </div>
                                    </div>
                                </Carousel>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-12 mt-4">
                    <Card>
                        <CardContent>
                            <div className="h5 mb-5">แดชบอร์ดสินค้า</div>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="row space-nowrap">
                                        <div className="col text-center">
                                            <Progress
                                                className='product-dashboard'
                                                type="dashboard"
                                                percent={38}
                                                format={(percent, successPercent) => (
                                                    <div className='text-format'>
                                                        <span className='desc'>% สินค้าที่มีสต๊อก</span>
                                                        <span className='value'>{percent.toFixed(2)}<span className='font-size-20'>%</span></span>
                                                    </div>
                                                )}
                                            />
                                        </div>
                                        <div className="col">
                                            <StatisticCard
                                                title="จำนวนสินค้าพร้อมขาย"
                                                value={8}
                                                valueUnit=''
                                                type='text'
                                                tooltip='จำนวนสินค้าที่เปิดการใช้งานอย่างน้อย 1 วันจากช่วงเวลาที่เลือกไว้ ผู้เข้าชมสามารถมองเห็นสินค้าได้'
                                            />
                                            <StatisticCard
                                                classStyle='mt-4'
                                                title="สินค้าที่สามารถซื้อได้"
                                                value={8}
                                                valueUnit=''
                                                type='text'
                                                tooltip='สินค้าที่เปิดการใช้งานและมีสต๊อกอย่างน้อย 1 วันจากช่วงเวลาที่เลือกไว้'
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="row space-nowrap">
                                        <div className="col text-center">
                                            <Progress
                                                className='product-dashboard'
                                                type="dashboard"
                                                percent={12.50}
                                                format={(percent, successPercent) => (
                                                    <div className='text-format'>
                                                        <span className='desc'>% สินค้าที่มีผู้เข้าชม</span>
                                                        <span className='value'>{percent.toFixed(2)}<span className='font-size-20'>%</span></span>
                                                    </div>
                                                )}
                                            />
                                        </div>
                                        <div className="col">
                                            <StatisticCard
                                                title="สินค้าที่มียอดเข้าชม"
                                                value={1}
                                                valueUnit=''
                                                type='text'
                                                tooltip='จำนวนสินค้าที่มียอดเข้าชมอย่างน้อย 1 ครั้งจากช่วงเวลาที่เลือกไว้'
                                            />
                                            <StatisticCard
                                                classStyle='mt-4'
                                                title="ผู้เข้าชมรายการสินค้า (SKU)"
                                                value={3}
                                                valueUnit=''
                                                type='text'
                                                tooltip='จำนวนผู้เข้าชมรายการสินค้า (SKU) (หากผู้เข้าชมรายการสินค้าหลายครั้งในช่วงเวลาเดียวกัน ระบบจะถือเป็น 1 ผู้เข้าชมเท่านั้น)'
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="row space-nowrap">
                                        <div className="col text-center">
                                            <Progress
                                                className='product-dashboard'
                                                type="dashboard"
                                                percent={0}
                                                format={(percent, successPercent) => (
                                                    <div className='text-format'>
                                                        <span className='desc'>% สินค้าที่ขายได้</span>
                                                        <span className='value'>{percent.toFixed(2)}<span className='font-size-20'>%</span></span>
                                                    </div>
                                                )}
                                            />
                                        </div>
                                        <div className="col">
                                            <StatisticCard
                                                title="สินค้าที่ขายได้"
                                                value={0}
                                                valueUnit=''
                                                type='text'
                                                tooltip='จำนวนสินค้าที่มีอย่างน้อย 1 คำสั่งซื้อจากช่วงเวลาที่เลือกไว้'
                                            />
                                            <StatisticCard
                                                classStyle='mt-4'
                                                title="จำนวนสินค้าที่ขายได้"
                                                value={0}
                                                valueUnit=''
                                                type='text'
                                                tooltip='จำนวนสินค้าทั้งหมดที่ขายได้ในช่วงเวลาที่เลือก เช่น ถ้ามีรายการสินค้า (SKU) ที่ขายได้ทั้งหมด 3 ชิ้น ระบบจะแสดงค่าเป็น 3 '
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Dashbord
