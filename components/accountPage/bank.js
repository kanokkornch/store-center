import { useState, useEffect, useRef, Fragment } from 'react'
import { useForm, Controller, useFieldArray } from "react-hook-form"
import Select from "react-select"
import { message, Upload, Spin, Alert } from 'antd'
import { Button } from '@material-ui/core'
import { shopVerification } from '../../services/verification'
import { uploadImage } from '../../services/utills'
import Image from 'next/image'

function BankVerifyPage(props) {
    const { banks, verify, fetchShopVerifyInfo } = props
    const { register, control, handleSubmit, formState: { errors }, setValue, getValues, reset, watch } = useForm({
        defaultValues: {
            status: 0
        }
    })
    const [fileList, setFileList] = useState([])
    const [bookFile, setbookFile] = useState(null)
    const [mode, setMode] = useState('show')
    const [saving, setSaving] = useState(false)
    const [bankInfo, setBankInfo] = useState(null)
    useEffect(() => {
        if (verify && verify.length > 0) {
            const info = verify.find(it => it.type === 2)
            if (info) {
                const selectedBank = banks.find(b => b.id === info.bank_id)
                setBankInfo(info)
                setValue('id', info.id)
                setValue('bank_account_name', info.bank_account_name)
                setValue('bank_account_number', info.bank_account_number)
                setValue('bank', selectedBank)
                setValue('bankName', selectedBank.name)
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
        data.type = 'BANK_VERIFY'
        data.bank_id = data.bank.id
        data.bank_account_number = data.bank_account_number.toString()
        if (!bookFile && fileList.length < 1) {
            message.warning('กรุณาอัพโหลดหน้าสมุดบัญชี')
            return
        }
        setSaving(true)
        if (bookFile) {
            uploadImage({ type: 'bank_verify', image_data: bookFile }).then(res => {
                if (res.success) {
                    data.attach_file = res.data.url
                    shopVerification(data).then(res => {
                        setSaving(false)
                        if (res.success) {
                            message.success('อัพเดตข้อมูลสำเร็จ')
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
                    message.success('อัพเดตข้อมูลสำเร็จ')
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
    return (
        <div>
            <Spin spinning={saving} tip='กำลังบันทึก...'>
                <div className="h4">ยืนยันบัญชีธนาคาร</div>
                {bankInfo && bankInfo.status === 0 && <Alert
                    description="โปรดรอการตรวจสอบข้อมูลและการอนุมัติจากแอดมิน"
                    type="info" />
                }
                {bankInfo && bankInfo.status === 1 && <Alert
                    description="ยืนยันตัวตนสำเร็จ. หากต้องการแก้ไขข้อมูลกรุณาติดต่อแอดมินเพื่อแก้ไขอีกครั้ง"
                    type="success" />
                }
                <form onSubmit={handleSubmit(onSubmitForm)}>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="my-3">
                                <label htmlFor="name" className="form-label">
                                    {mode === 'edit' ? <span className='requird'>* </span> : null}
                                    ชื่อบัญชี
                                </label>
                                {mode === 'show' ? <p>{watch('bank_account_name') ? watch('bank_account_name') : '-'}</p> : <input
                                    type="text"
                                    {...register('bank_account_name', { required: true, })}
                                    className={`form-control ${errors.bank_account_name ? 'is-invalid' : ''}`}
                                    id="bank_account_name"
                                    placeholder="" />}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">
                                    {mode === 'edit' ? <span className='requird'>* </span> : null}
                                    เลขบัญชี
                                </label>
                                {mode === 'show' ? <p>{watch('bank_account_number') ? watch('bank_account_number') : '-'}</p> : <input
                                    type="number"
                                    {...register('bank_account_number', { required: true, })}
                                    className={`form-control ${errors.bank_account_number ? 'is-invalid' : ''}`}
                                    id="bank_account_number"
                                    placeholder="" />}

                            </div>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">
                                    {mode === 'edit' ? <span className='requird'>* </span> : null}
                                    ธนาคาร
                                </label>
                                {mode === 'show' ? <p>{watch('bankName') ? watch('bankName') : '-'}</p> : <Controller
                                    name="bank"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => <Select
                                        {...field}
                                        className='react-select'
                                        classNamePrefix='select'
                                        isSearchable={false}
                                        // defaultValue={banks[0]}
                                        options={banks.length ? banks.map(it => {
                                            it.value = it.id
                                            it.label = it.name
                                            return it
                                        }) : []
                                        }
                                    />}
                                />}

                            </div>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">
                                    {mode === 'edit' ? <span className='requird'>* </span> : null}
                                    หน้าสมุดบัญชี
                                </label>
                                <div className="d-flex">
                                    {mode === 'show' ? <Image
                                        objectFit='contain'
                                        src={watch('image') ? watch('image') : 'https://e7.pngegg.com/pngimages/709/358/png-clipart-price-toyservice-soil-business-no-till-farming-no-rectangle-pie.png'}
                                        alt="me"
                                        width="500"
                                        height="500" /> : <Upload
                                            className=''
                                            listType="picture-card"
                                            fileList={fileList}
                                            onChange={onChange}
                                            onPreview={onPreview}
                                            accept='image/*'
                                        >
                                        {fileList.length < 1 && '+ Upload'}
                                    </Upload>}

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

export default BankVerifyPage
