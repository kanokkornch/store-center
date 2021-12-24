import { useState, useEffect, useRef, Fragment } from 'react'
import { useForm, Controller, useFieldArray } from "react-hook-form"
import Select from "react-select"
import { Upload, message, Checkbox, Radio } from 'antd'
import { Button } from '@material-ui/core'
import { shopVerification } from '../../../services/verification'
import { uploadImage } from '../../../services/utills'

function ShopSettingPage() {
    const { register, control, handleSubmit, formState: { errors }, setValue, getValues, reset } = useForm({})
    const [fileList, setFileList] = useState([])
    const [bookFile, setbookFile] = useState(null)
    const [mode, setMode] = useState('show')
    const [isCompany, setisCompany] = useState(false)
    const [isMainBranch, setisMainBranch] = useState(1)
    const onSubmitForm = (data) => {
        console.log(`ข้อมูลทางธุรกิจ`, data)
        // data.type = 'SHOP_VERIFY'
        // if (!bookFile) {
        //     message.warning('กรุณาอัพโหลดภาพถ่ายบัตรประชาชน')
        //     return
        // }
        // const loading = message.loading('กำลังอัพเดตข้อมูล...')
        // uploadImage({ type: 'id_card_verify', image_data: bookFile }).then(res => {
        //     if (res.success) {
        //         data.attach_file = res.data.url
        //         shopVerification(data).then(res => {
        //             setTimeout(loading, 0)
        //             if (res.success) {
        //                 message.success('อัพเดตข้อมูลสำเร็จ')
        //             } else {
        //                 message.error(res.message)
        //             }
        //         }).catch(err => {
        //             setTimeout(loading, 0)
        //             message.error('service ไม่พร้อมใช้งานขณะนี้')
        //         })
        //     } else {
        //         message.error(res.message)
        //     }
        // }).catch(err => {
        //     setTimeout(loading, 0)
        //     message.error('service ไม่พร้อมใช้งานขณะนี้')
        // })
    }
    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        if (newFileList.length) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setbookFile(reader.result)
            }
            reader.readAsDataURL(newFileList[0].originFileObj)
        } else {
            setbookFile(null)
            // setLogoUrl(null)
        }
    }
    const onPreview = async file => {
        let src = file.url;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
    }
    const onIsCompanyChange = (e) => {
        setisCompany(e.target.checked)
    }

    const cancelEdit = () => {
        reset()
        setMode('show')
    }
    useEffect(() => {
        if (isMainBranch === 1) {
            setValue('company_branch', '00')
        } else {
            setValue('company_branch', '99')
        }
    }, [isMainBranch])

    return (
        <div>
            <div className="h4">ข้อมูลทางธุรกิจ</div>
            <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="my-3">
                            <label htmlFor="name" className="form-label fw-500">
                                {mode === 'edit' ? <span className='requird'>* </span> : null}
                                ชื่อเจ้าของ/ชื่อบริษัท
                            </label>
                            {mode === 'show' ? <p>XXXXXXXX</p> : <input
                                type="text"
                                {...register('invoice_name', { required: true, })}
                                className={`form-control ${errors.invoice_name ? 'is-invalid' : ''}`}
                                id="invoice_name"
                                placeholder="" />}
                        </div>
                        <div className="mb-3">
                            <Checkbox disabled={mode === 'show'} onChange={onIsCompanyChange}>เป็นนิติบุคคล(บริษัท/ห้างหุ้นส่วน)</Checkbox>
                            {isCompany && <div className='mt-2 d-flex align-middle'>
                                <div className="w-50-per">
                                    <Radio.Group onChange={e => setisMainBranch(e.target.value)} value={isMainBranch}>
                                        <Radio value={1}>สำนักงานใหญ่</Radio>
                                        <Radio value={2}>สาขา</Radio>
                                    </Radio.Group>
                                </div>
                                <div className="w-50-per">
                                    <input
                                        type="text"
                                        {...register('company_branch', { required: false, })}
                                        className={`form-control ${errors.company_branch ? 'is-invalid' : ''}`}
                                        id="company_branch"
                                        placeholder="" />
                                </div>
                            </div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label fw-500">
                                {mode === 'edit' ? <span className='requird'>* </span> : null}
                                ที่อยู่
                            </label>
                            {mode === 'show' ? <p>XXXXXXXX</p> : <input
                                type="text"
                                {...register('invoice_address', { required: true, })}
                                className={`form-control ${errors.invoice_address ? 'is-invalid' : ''}`}
                                id="invoice_address"
                                placeholder="" />}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label fw-500">
                                {mode === 'edit' ? <span className='requird'>* </span> : null}
                                ตำบล/แขวง
                            </label>
                            {mode === 'show' ? <p>XXXXXXXX</p> : <input
                                type="text"
                                {...register('invoice_district', { required: true, })}
                                className={`form-control ${errors.invoice_district ? 'is-invalid' : ''}`}
                                id="invoice_district"
                                placeholder="" />}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label fw-500">
                                {mode === 'edit' ? <span className='requird'>* </span> : null}
                                อำเภอ/เขต
                            </label>
                            {mode === 'show' ? <p>XXXXXXXX</p> : <input
                                type="text"
                                {...register('invoice_amphure', { required: true, })}
                                className={`form-control ${errors.invoice_amphure ? 'is-invalid' : ''}`}
                                id="invoice_amphure"
                                placeholder="" />}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label fw-500">
                                {mode === 'edit' ? <span className='requird'>* </span> : null}
                                จังหวัด
                            </label>
                            {mode === 'show' ? <p>XXXXXXXX</p> : <input
                                type="text"
                                {...register('invoice_province', { required: true, })}
                                className={`form-control ${errors.invoice_province ? 'is-invalid' : ''}`}
                                id="invoice_province"
                                placeholder="" />}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label fw-500">
                                {mode === 'edit' ? <span className='requird'>* </span> : null}
                                รหัสไปรษณีย์
                            </label>
                            {mode === 'show' ? <p>XXXXXXXX</p> : <input
                                type="number"
                                {...register('invoice_zipcode', { required: true, })}
                                className={`form-control ${errors.invoice_zipcode ? 'is-invalid' : ''}`}
                                id="invoice_zipcode"
                                placeholder="" />}

                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label fw-500">
                                {mode === 'edit' ? <span className='requird'>* </span> : null}
                                หมายเลขโทรศัพท์
                            </label>
                            {mode === 'show' ? <p>XXXXXXXX</p> : <input
                                type="text"
                                {...register('invoice_phone', { required: true, })}
                                className={`form-control ${errors.invoice_phone ? 'is-invalid' : ''}`}
                                id="invoice_phone"
                                placeholder="" />}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label fw-500">
                                {mode === 'edit' ? <span className='requird'>* </span> : null}
                                หมายเลขบัตรประจำตัวประชาชน
                            </label>
                            {mode === 'show' ? <p>XXXXXXXX</p> : <input
                                type="numberF"
                                {...register('id_card_no', { required: true, })}
                                className={`form-control ${errors.id_card_no ? 'is-invalid' : ''}`}
                                id="id_card_no"
                                placeholder="" />}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label fw-500">
                                {mode === 'edit' ? <span className='requird'>* </span> : null}
                                ภาพบัตรประชาชน
                            </label>
                            <div className="d-flex">
                                <Upload
                                    className=''
                                    listType="picture-card"
                                    fileList={fileList}
                                    onChange={onChange}
                                    onPreview={onPreview}
                                    accept='image/*'
                                >
                                    {fileList.length < 1 && '+ Upload'}
                                </Upload>
                            </div>
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
                            variant="contained"
                            onClick={cancelEdit}>
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
        </div>
    )
}

export default ShopSettingPage
