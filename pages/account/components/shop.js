import { useState, useEffect, useRef, Fragment } from 'react'
import { useForm, Controller, useFieldArray } from "react-hook-form"
import Select from "react-select"
import { Upload, message } from 'antd'
import { Button } from '@material-ui/core'
import { shopVerification } from '../../../services/verification'
import { uploadImage } from '../../../services/utills'

function ShopSettingPage() {
    const { register, control, handleSubmit, formState: { errors }, setValue, getValues, reset } = useForm({})
    const [fileList, setFileList] = useState([])
    const [bookFile, setbookFile] = useState(null)
    const onSubmitForm = (data) => {
        data.type = 'SHOP_VERIFY'
        if (!bookFile) {
            message.warning('กรุณาอัพโหลดภาพถ่ายบัตรประชาชน')
            return
        }
        const loading = message.loading('กำลังอัพเดตข้อมูล...')
        uploadImage({ type: 'id_card_verify', image_data: bookFile }).then(res => {
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
            <div className="h4">ยืนยันตัวตน</div>
            <form onSubmit={handleSubmit(onSubmitForm)}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="my-3">
                            <label htmlFor="name" className="form-label">
                                <span className='requird'>* </span>
                                เลขประจำตัวประชาชน
                            </label>
                            <input
                                type="number"
                                {...register('id_card_no', { required: true, })}
                                className={`form-control ${errors.id_card_no ? 'is-invalid' : ''}`}
                                id="id_card_no"
                                placeholder="" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                                <span className='requird'>* </span>
                                ภาพถ่ายบัตรประชาชน
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
                        <div>
                            <Button
                                type='submit'
                                className='w-100'
                                variant="contained"
                                color="primary">
                                บันทึก
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ShopSettingPage
