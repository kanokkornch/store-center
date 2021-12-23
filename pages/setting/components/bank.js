import { useState, useEffect, useRef, Fragment } from 'react'
import { useForm, Controller, useFieldArray } from "react-hook-form"
import Select from "react-select"
import { Upload } from 'antd'

function bank() {
    const { register, control, handleSubmit, formState: { errors }, setValue, getValues, reset } = useForm({})
    const [fileList, setFileList] = useState([])
    const [bookFile, setbookFile] = useState(null)
    const onSubmitForm = (data) => {
        console.log(`form`, data)
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
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                                <span className='requird'>* </span>
                                ชื่อบัญชี
                            </label>
                            <input
                                type="text"
                                {...register('bank_account_name', { required: true, })}
                                className={`form-control ${errors.bank_account_name ? 'is-invalid' : ''}`}
                                id="bank_account_name"
                                placeholder="ชื่อสินค้า" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                                <span className='requird'>* </span>
                                เลขบัญชี
                            </label>
                            <input
                                type="text"
                                {...register('bank_account_number', { required: true, })}
                                className={`form-control ${errors.bank_account_number ? 'is-invalid' : ''}`}
                                id="bank_account_number"
                                placeholder="ชื่อสินค้า" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                                <span className='requird'>* </span>
                                ธนาคาร
                            </label>
                            <Controller
                                name="bank_id"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => <Select
                                    {...field}
                                    className='react-select'
                                    classNamePrefix='select'
                                    isSearchable={false}
                                    options={[]}
                                // options={units.length ? units.map(it => {
                                //     it.value = it.id
                                //     it.label = it.name
                                //     return it
                                // }) : []
                                // }
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
                                    className='shop-setting-logo'
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
            </form>
        </div>
    )
}

export default bank
