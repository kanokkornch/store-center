import { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import { Spin, message } from 'antd'
import { Button } from '@material-ui/core'
import { updateShopAddress } from '../../../services/shop'

function AddressSettingPage({ fetchShopInfo, shop }) {
    const { register, control, handleSubmit, formState: { errors }, setValue, getValues, reset } = useForm({})
    const [mode, setMode] = useState('show')
    const [saving, setSaving] = useState(false)
    useEffect(() => {
        if (shop) {
            setValue('id', shop.id)
            setValue('invoice_name', shop.invoice_name)
            setValue('address', shop.address)
            setValue('district', shop.district)
            setValue('amphure', shop.amphure)
            setValue('province', shop.province)
            setValue('zipcode', shop.zipcode)
            setValue('phone', shop.phone)
        }
    }, [shop])
    const onSubmitForm = (data) => {
        setSaving(true)
        updateShopAddress(data).then(res => {
            setSaving(false)
            if (res.success) {
                message.success('อัพเดตข้อมูลสำเร็จ')
                fetchShopInfo()
            } else {
                message.error(res.message)
            }
        }).catch(err => {
            setSaving(false)
            message.error('service ไม่พร้อมใช้งานขณะนี้')
        })
    }

    return (
        <div>
            <Spin spinning={saving} tip='กำลังบันทึก...'>
                <div className="h4">ที่อยู่คลังสินค้า</div>
                <label htmlFor="">สำหรับการนัดรับพัสดุและการส่งคืนพัสดุที่จัดส่งไม่สำเร็จ</label>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="my-3">
                                <label htmlFor="name" className="form-label fw-500">
                                    {/* {mode === 'edit' ? <span className='requird'>* </span> : null} */}
                                    ชื่อเจ้าของ/ชื่อบริษัท
                                </label>
                                <p>{shop.invoice_name ? shop.invoice_name : '-'}</p>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="address" className="form-label fw-500">
                                    {mode === 'edit' ? <span className='requird'>* </span> : null}
                                    ที่อยู่
                                </label>
                                {mode === 'show' ? <p>{shop.address ? shop.address : '-'}</p> : <input
                                    type="text"
                                    {...register('address', { required: true, })}
                                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                    id="address"
                                    placeholder="" />}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="district" className="form-label fw-500">
                                    {mode === 'edit' ? <span className='requird'>* </span> : null}
                                    ตำบล/แขวง
                                </label>
                                {mode === 'show' ? <p>{shop.district ? shop.district : '-'}</p> : <input
                                    type="text"
                                    {...register('district', { required: true, })}
                                    className={`form-control ${errors.district ? 'is-invalid' : ''}`}
                                    id="district"
                                    placeholder="" />}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="amphure" className="form-label fw-500">
                                    {mode === 'edit' ? <span className='requird'>* </span> : null}
                                    อำเภอ/เขต
                                </label>
                                {mode === 'show' ? <p>{shop.amphure ? shop.amphure : '-'}</p> : <input
                                    type="text"
                                    {...register('amphure', { required: true, })}
                                    className={`form-control ${errors.amphure ? 'is-invalid' : ''}`}
                                    id="amphure"
                                    placeholder="" />}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="province" className="form-label fw-500">
                                    {mode === 'edit' ? <span className='requird'>* </span> : null}
                                    จังหวัด
                                </label>
                                {mode === 'show' ? <p>{shop.province ? shop.province : '-'}</p> : <input
                                    type="text"
                                    {...register('province', { required: true, })}
                                    className={`form-control ${errors.province ? 'is-invalid' : ''}`}
                                    id="province"
                                    placeholder="" />}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="zipcode" className="form-label fw-500">
                                    {mode === 'edit' ? <span className='requird'>* </span> : null}
                                    รหัสไปรษณีย์
                                </label>
                                {mode === 'show' ? <p>{shop.zipcode ? shop.zipcode : '-'}</p> : <input
                                    type="number"
                                    {...register('zipcode', { required: true, })}
                                    className={`form-control ${errors.zipcode ? 'is-invalid' : ''}`}
                                    id="zipcode"
                                    placeholder="" />}

                            </div>
                            <div className="mb-3">
                                <label htmlFor="phone" className="form-label fw-500">
                                    หมายเลขโทรศัพท์
                                </label>
                                <p>{shop.phone ? shop.phone : '-'}</p>
                            </div>
                        </div>
                    </div>
                    <div className='text-end'>
                        {mode === 'show' ? <Button
                            type='button'
                            className=''
                            variant="contained"
                            onClick={() => setMode('edit')}
                            color="primary">
                            แก้ไข
                        </Button> : <div>
                            <Button
                                type='submit'
                                className=''
                                variant="outlined"
                                onClick={() => setMode('show')}>
                                ยกเลิก
                            </Button>
                            <Button
                                type='submit'
                                className='ms-3'
                                variant="contained"
                                color="primary">
                                บันทึก
                            </Button>
                        </div>}

                    </div>
                </form>
            </Spin>

        </div>
    )
}

export default AddressSettingPage
