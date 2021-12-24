import { useState, useEffect, useRef, Fragment } from 'react'
import { useForm, Controller, useFieldArray } from "react-hook-form"
import Select from "react-select"
import { message, Upload } from 'antd'
import { Button } from '@material-ui/core'
import { shopVerification } from '../../../services/verification'
import { uploadImage } from '../../../services/utills'

function BankVerifyPage(props) {
    const { banks } = props
    const { register, control, handleSubmit, formState: { errors }, setValue, getValues, reset } = useForm({})
    const [fileList, setFileList] = useState([])
    const [bookFile, setbookFile] = useState(null)
    const onSubmitForm = (data) => {
        data.type = 'BANK_VERIFY'
        data.bank_id = data.bank.id
        if (!bookFile) {
            message.warning('กรุณาอัพโหลดหน้าสมุดบัญชี')
            return
        }
        const loading = message.loading('กำลังอัพเดตข้อมูล...')
        uploadImage({ type: 'bank_verify', image_data: bookFile }).then(res => {
            if (res.success) {
                data.attach_file = res.data.url
                shopVerification(data).then(res => {
                    setTimeout(loading, 0)
                    if (res.success) {
                        message.success('อัพเดตข้อมูลสำเร็จ')
                    } else {
                        message.error(res.message)
                    }
                }).catch(err => {
                    setTimeout(loading, 0)
                    message.error('service ไม่พร้อมใช้งานขณะนี้')
                })
            } else {
                message.error(res.message)
            }
        }).catch(err => {
            setTimeout(loading, 0)
            message.error('service ไม่พร้อมใช้งานขณะนี้')
        })
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
            <div className="h4">ยืนยันบัญชีธนาคาร</div>
            <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="my-3">
                            <label htmlFor="name" className="form-label">
                                <span className='requird'>* </span>
                                ชื่อบัญชี
                            </label>
                            <input
                                type="text"
                                {...register('bank_account_name', { required: true, })}
                                className={`form-control ${errors.bank_account_name ? 'is-invalid' : ''}`}
                                id="bank_account_name"
                                placeholder="" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                                <span className='requird'>* </span>
                                เลขบัญชี
                            </label>
                            <input
                                type="number"
                                {...register('bank_account_number', { required: true, })}
                                className={`form-control ${errors.bank_account_number ? 'is-invalid' : ''}`}
                                id="bank_account_number"
                                placeholder="" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                                <span className='requird'>* </span>
                                ธนาคาร
                            </label>
                            <Controller
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
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                                <span className='requird'>* </span>
                                หน้าสมุดบัญชี
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
                    <Button
                        type='submit'
                        variant="contained"
                        color="primary">
                        บันทึก
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default BankVerifyPage
