import { useState, useEffect, useRef, Fragment } from 'react'
import { useForm, Controller, useFieldArray } from "react-hook-form"
import Select from "react-select"
import { Upload, message, Checkbox, Radio, Spin, Alert } from 'antd'
import { Button } from '@material-ui/core'
import { shopVerification } from '../../../services/verification'
import { uploadImage } from '../../../services/utills'
import Image from 'next/image'

function IdCardVerificationPage({ shop, fetchShopInfo, verify, fetchShopVerifyInfo }) {
    const { register, control, handleSubmit, formState: { errors }, setValue, getValues, reset, watch } = useForm({
        defaultValues: {
            status: 0
        }
    })
    const [fileList, setFileList] = useState([])
    const [bookFile, setbookFile] = useState(null)
    const [mode, setMode] = useState('show')
    const [saving, setSaving] = useState(false)
    const [cardInfo, setCardInfo] = useState(null)
    useEffect(() => {
        if (verify && verify.length > 0) {
            const info = verify.find(it => it.type === 1)
            if (info) {
                setCardInfo(info)
                setValue('id', info.id)
                setValue('id_card_no', info.id_card_no)
                setValue('image', info.attach_file)
                setValue('status', info.status)
                setFileList([{
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: info.attach_file,
                }])
            }
        }
    }, [verify])
    const onSubmitForm = (data) => {
        data.id = shop.id
        data.type = 'SHOP_VERIFY'
        if (!bookFile && fileList.length < 1) {
            message.warning('กรุณาอัพโหลดภาพถ่ายบัตรประชาชน')
            return
        }
        setSaving(true)
        if (bookFile) {
            uploadImage({ type: 'id_card_verify', image_data: bookFile }).then(res => {
                if (res.success) {
                    data.attach_file = res.data.url
                    shopVerification(data).then(res => {
                        setSaving(false)
                        if (res.success) {
                            message.success('บันทึกข้อมูลสำเร็จ')
                            fetchShopVerifyInfo()
                        } else {
                            message.error(res.message)
                        }
                    }).catch(err => {
                        setSaving(false)
                        message.error('service ไม่พร้อมใช้งานขณะนี้')
                    })
                } else {
                    message.error(res.message)
                }
            }).catch(err => {
                setSaving(false)
                message.error('service ไม่พร้อมใช้งานขณะนี้')
            })
        } else {
            data.attach_file = watch('image')
            shopVerification(data).then(res => {
                setSaving(false)
                if (res.success) {
                    message.success('บันทึกข้อมูลสำเร็จ')
                    fetchShopVerifyInfo()
                } else {
                    message.error(res.message)
                }
            }).catch(err => {
                setSaving(false)
                message.error('service ไม่พร้อมใช้งานขณะนี้')
            })
        }

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
        let src = file.url
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader()
                reader.readAsDataURL(file.originFileObj)
                reader.onload = () => resolve(reader.result)
            })
        }
        const image = new Image()
        image.src = src
        const imgWindow = window.open(src)
        imgWindow.document.write(image.outerHTML)
    }

    const cancelEdit = () => {
        setMode('show')
    }

    return (
        <div>
            <Spin spinning={saving} tip='กำลังบันทึก...'>
                <div className="h4">ยืนยันตัวตน</div>
                {cardInfo && cardInfo.status === 0 && <Alert
                    description="โปรดรอการตรวจสอบข้อมูลและการอนุมัติจากแอดมิน"
                    type="info" />
                }
                {cardInfo && cardInfo.status === 1 && <Alert
                    description="ยืนยันตัวตนสำเร็จ. หากต้องการแก้ไขข้อมูลกรุณาติดต่อแอดมินเพื่อแก้ไขอีกครั้ง"
                    type="success" />
                }
                <form onSubmit={handleSubmit(onSubmitForm)}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="my-3">
                                <label htmlFor="name" className="form-label fw-500">
                                    {mode === 'edit' ? <span className='requird'>* </span> : null}
                                    หมายเลขบัตรประจำตัวประชาชน
                                </label>
                                {mode === 'show' ? <p>{watch('id_card_no') ? watch('id_card_no') : '-'}</p> : <input
                                    type="number"
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
                                    {mode === 'show' ? <Image
                                        objectFit='contain'
                                        src={watch('image') ? watch('image') : 'https://e7.pngegg.com/pngimages/709/358/png-clipart-price-toyservice-soil-business-no-till-farming-no-rectangle-pie.png'}
                                        alt="me"
                                        width="500"
                                        height="500" /> :
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
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='text-end'>
                        {mode === 'show' && watch('status') === 0 && <Button
                            type='button'
                            className=''
                            variant="contained"
                            onClick={() => setMode('edit')}
                            color="primary">
                            แก้ไข
                        </Button>}
                        {mode !== 'show' && <div>
                            <Button
                                type='submit'
                                className=''
                                variant="outlined"
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
            </Spin>

        </div>
    )
}

export default IdCardVerificationPage
