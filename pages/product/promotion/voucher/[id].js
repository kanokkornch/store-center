import { useState, useEffect, useRef, Fragment } from 'react'
import { Card, CardContent, Tabs, Tab, Button } from '@material-ui/core'
import { useForm } from "react-hook-form"
import { DatePicker, message, Spin } from 'antd'
import { numberFormat } from '../../../../services/utills'
import { editVoucher, getVoucherById } from '../../../../services/promotion'
import Link from 'next/link'
import { useRouter } from 'next/router'
import moment from 'moment'

const { RangePicker } = DatePicker

function EditVoucher() {
    const router = useRouter()
    const { id } = router.query
    const [dateTime, setdateTime] = useState([])
    const [defaultDateTime, setDefaultDateTime] = useState(null)
    const [type, setType] = useState('fixed')
    const [saving, setSaving] = useState(false)
    const { register, control, handleSubmit, formState: { errors }, setValue, getValues, reset, watch } = useForm({
        defaultValues: {
            type: 1,
            use_type: 1,
            value1: 45,
            value2: 10,
            min_spend: 450,
            count: 0,
            total_created: 100,
            usage_limited: 1
        }
    })
    useEffect(() => {
        document.title = "คูปองส่วนลดร้านค้า"
    })
    const dateFormat = 'YYYY-MM-DD HH:mm:ss'
    useEffect(() => {
        if (id) {
            getVoucherById(id).then(res => {
                if (res.success) {
                    setValue('name', res.data.name)
                    setValue('code', res.data.code)
                    setValue('min_spend', res.data.min_spend)
                    setValue('value', res.data.value)
                    setValue('total_created', res.data.total_created)
                    setValue('usage_limited', res.data.usage_limited)
                    if (res.data.value_type === 1) {
                        setType('percent')
                        setValue('value2', res.data.value)
                    } else {
                        setType('fixed')
                        setValue('value1', res.data.value)
                    }
                    setdateTime([moment(res.data.started_at).format(dateFormat), moment(res.data.expired_at).format(dateFormat)])
                    setDefaultDateTime([moment(res.data.expired_at, dateFormat), moment(res.data.started_at, dateFormat)])
                }
            })

        }
    }, [id])
    const onChange = (value, dateString) => {
        setdateTime(dateString)
        console.log('Formatted Selected Time: ', dateString)
    }
    const onOk = (value) => { }

    const onSaveCoupon = (data) => {
        if (dateTime.length < 2) {
            message.warning('กรุณาเลือก ระยะเวลาที่สามารถเก็บ/ใช้งานคูปอง')
            return
        }
        data.id = id
        data.value = type === 'fixed' ? data.value1 : data.value2
        data.value_type = type === 'fixed' ? 2 : 1
        data.started_at = dateTime[0]
        data.expired_at = dateTime[1]
        setSaving(true)
        editVoucher(data).then(res => {
            setSaving(false)
            if (res.success) {
                message.success('อัพเดตสำเร็จ')
            } else {
                message.warning(res.message)
            }
        }).catch(err => {
            setSaving(false)
            message.error('service ไม่พร้อมใช้งานขณะนี้')
        })
    }
    return (
        <div>
            <Spin spinning={saving} tip="กำลังบันทึก...">
                <div className="h4">คูปองส่วนลดร้านค้า</div>
                <form onSubmit={handleSubmit(onSaveCoupon)}>
                    <Card className='mt-3'>
                        <CardContent>
                            <div className="row">
                                <div className="col-lg-4 col-md-6 mb-3">
                                    <label htmlFor="name" className="form-label">
                                        <span className='requird'>* </span>
                                        ชื่อคูปอง
                                    </label>
                                    <input
                                        type="text"
                                        {...register('name', { required: true, })}
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        id="name"
                                        placeholder="" />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-lg-4 col-md-6 mb-3">
                                    <label htmlFor="code" className="form-label">
                                        <span className='requird'>* </span>
                                        Code คูปอง
                                    </label>
                                    <input
                                        disabled
                                        type="text"
                                        {...register('code', { required: true, })}
                                        className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                                        id="code"
                                        placeholder="" />
                                </div>
                            </div>
                            {
                                defaultDateTime && <div className="row mb-3">
                                    <div className="col-lg-4 col-md-6">
                                        <label htmlFor="name" className="form-label">
                                            <span className='requird'>* </span>
                                            ระยะเวลาที่สามารถเก็บ/ใช้งานคูปองได้
                                        </label><br />
                                        <RangePicker
                                            className='w-100'
                                            defaultValue={defaultDateTime.length > 0 ? defaultDateTime : []}
                                            showTime={{ format: 'HH:mm:ss' }}
                                            format={dateFormat}
                                            onChange={onChange}
                                            onOk={onOk}
                                        />
                                    </div>
                                </div>
                            }
                        </CardContent>
                    </Card>
                    <Card className='mt-3'>
                        <CardContent>
                            <div className="h5">ตั้งค่าส่วนลด</div>
                            <div className="row">
                                <div className="col-lg-4 col-md-6 mb-3 d-flex justify-content-between">
                                    <div
                                        className={`coupon-type ${type === 'fixed' ? 'selected' : ''}`}
                                        onClick={() => setType('fixed')}
                                    >
                                        <div className='title'>จำนวนเงิน</div>
                                        <div className='desc'>
                                            <div>
                                                <span className="main-value">
                                                    {watch('value1') ? numberFormat(watch('value1')) : numberFormat(0)}
                                                </span>
                                                THB</div>
                                            <div>
                                                Min. Spend {watch('min_spend') ? numberFormat(watch('min_spend')) : 0} THB
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={`coupon-type ${type === 'percent' ? 'selected' : ''}`}
                                        onClick={() => setType('percent')}
                                    >
                                        <div className='title'>เปอร์เซนต์</div>
                                        <div className='desc'>
                                            <div>
                                                <span className="main-value">
                                                    {watch('value2') ? numberFormat(watch('value2')) : numberFormat(0)}
                                                </span>
                                                %off
                                            </div>
                                            <div>
                                                <div>
                                                    Min. Spend {watch('min_spend') ? numberFormat(watch('min_spend')) : 0} THB
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <div className='col-lg-4 col-md-6'>
                                        <div className="row">
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="min_spend" className="form-label">
                                                    เมื่อสั่งซื้อขั้นต่ำ
                                                </label>
                                                <div className="input-group">
                                                    <span className="input-group-text" id="basic-addon2">THB</span>
                                                    <input
                                                        type="number"
                                                        defaultValue="450"
                                                        {...register('min_spend', { required: false, })}
                                                        className={`form-control ${errors.min_spend ? 'is-invalid' : ''}`}
                                                        id="min_spend"
                                                        placeholder=""
                                                        aria-describedby="basic-addon2"
                                                    />                                    </div>
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="value1" className="form-label">
                                                    ส่วนลดจะเป็น
                                                </label>
                                                <div className="input-group">
                                                    <span className="input-group-text" id="basic-addon2">
                                                        {type === 'fixed' ? 'THB' : '%'}
                                                    </span>
                                                    {type == 'fixed' ? <input
                                                        type="number"
                                                        defaultValue="45"
                                                        {...register('value1', { required: false, })}
                                                        className={`form-control ${errors.value1 ? 'is-invalid' : ''}`}
                                                        id="value1"
                                                        placeholder=""
                                                        aria-describedby="basic-addon2"
                                                    /> : <input
                                                        type="number"
                                                        defaultValue="10"
                                                        {...register('value2', { required: false, })}
                                                        className={`form-control ${errors.value2 ? 'is-invalid' : ''}`}
                                                        id="value2"
                                                        placeholder=""
                                                        aria-describedby="basic-addon2"
                                                    />}

                                                </div>
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="total_created" className="form-label">
                                                    จำนวนคูปองที่จะสร้างทั้งหมด
                                                </label>
                                                <input
                                                    type="number"
                                                    defaultValue="100"
                                                    {...register('total_created', { required: true, })}
                                                    className={`form-control ${errors.total_created ? 'is-invalid' : ''}`}
                                                    id="total_created"
                                                    placeholder="" />
                                            </div>
                                            <div className="col-xl-6 mb-3">
                                                <label htmlFor="usage_limited" className="form-label">
                                                    จำกัดการใช้คูปองต่อลูกค้าหนึ่งคน
                                                </label>
                                                <input
                                                    type="number"
                                                    defaultValue="1"
                                                    {...register('usage_limited', { required: true, })}
                                                    className={`form-control ${errors.usage_limited ? 'is-invalid' : ''}`}
                                                    id="usage_limited"
                                                    placeholder="" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className='mt-3'>
                        <CardContent>
                            <div className="d-flex col-gap-10 justify-content-end">
                                <Link href='/product/promotion/voucher'>
                                    <Button
                                        variant="outlined" type='button'>
                                        ยกเลิก
                                    </Button>
                                </Link>
                                <Button
                                    variant="contained" color="primary" type='submit'>
                                    บันทึก
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </Spin>
        </div >
    )
}

export default EditVoucher
