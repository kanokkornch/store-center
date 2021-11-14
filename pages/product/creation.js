import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardAction } from '@material-ui/core'
import { Input } from 'antd'
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import * as yup from "yup";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete'

function creation(props) {
    const fileInputRef = useRef(null)
    const [images, setImages] = useState([])
    const [imagesURL, setImagesURL] = useState([])
    const schema = yup.object().shape({
        product_name: yup.string()
            .required('First Name is required'),
        lastName: yup.string()
            .required('Last name is required')
    })
    // const { register, control, handleSubmit, formState: { errors } } = useForm({
    //     resolver: yupResolver(schema)
    // })
    const { register, control, handleSubmit, formState: { errors } } = useForm()
    const onSubmit = (data) => {
        console.log(data);
    }
    useEffect(() => {
        if (images.length < 1) {
            setImagesURL([])
            return
        }
        const list = []
        images.forEach(image => list.push(URL.createObjectURL(image)))
        setImagesURL(list)
    }, [images])
    const onImageChange = (e) => {
        if (e.target.files.length > 8) return alert('แนบรูปภาพได้สูงสุด 8 รูป')
        setImages([...e.target.files])
    }
    const deleteImage = (idx) => {
        images.splice(idx, 1)
        setImages([...images])
    }


    return (
        <div>
            <div className="h3">เพิ่มสินค้า</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-md-9">
                        <Card>
                            <CardContent>
                                <div className="h4">ข้อมูลทั่วไป</div>
                                <p className="fw-bold">รูปของสินค้า</p>
                                <p>นี่จะเป็นรูปหลักในหน้าสินค้าของคุณ. สามารถเลือกอัปโหลดรูปได้หลายรูปในครั้งเดียว. มากสุดได้ 8 รูป. ขนาดระหว่าง 330x330 ถึง 5000x5000 px. และห้ามใช้รูปลามกอนาจารโดยเด็ดขาด.</p>
                                <div className="drag-area"
                                >
                                    <input type="file"
                                        multiple
                                        accept='image/*'
                                        onChange={onImageChange}
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                    />
                                    {imagesURL.length > 0 ? <div className="preview-container p-2">
                                        {imagesURL.map((image, i) => (
                                            <div key={i} className="preview-item">
                                                <DeleteIcon onClick={() => deleteImage(i)} />
                                                <img
                                                    className="preview-img"
                                                    src={image} alt='' />
                                            </div>))}
                                    </div> : <>
                                        <div className="icon">
                                            <CloudUploadIcon style={{ fontSize: 50 }} />
                                        </div>
                                    </>
                                    }
                                    <span className="button mt-2" onClick={(e) => {
                                        fileInputRef.current.click()
                                    }}>คลิกเพื่อเลือกรูปภาพ</span>
                                    <span className="support">Supports: JPEG, JPG, PNG</span>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="product_name" className="form-label">
                                        <span className='requird'>* </span>
                                        ชื่อสินค้า
                                    </label>
                                    <input
                                        type="text"
                                        {...register('product_name', { required: true, })}
                                        className={`form-control ${errors.product_name ? 'is-invalid' : ''}`}
                                        id="product_name"
                                        placeholder="ชื่อสินค้า" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="product_name" className="form-label">
                                        <span className='requird'>* </span>
                                        หมวดหมู่สินค้า
                                    </label>
                                    <input
                                        type="text"
                                        {...register('category', { required: true, })}
                                        className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                                        id="category"
                                        placeholder="หมวดหมู่สินค้า" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="product_name" className="form-label">
                                        URL วิดีโอ
                                    </label>
                                    <input
                                        type="text"
                                        {...register('video_url', { required: false })}
                                        className={`form-control ${errors.video_url ? 'is-invalid' : ''}`}
                                        id="video_url"
                                        placeholder="" />
                                </div>
                                {/* <Controller
                                    render={({ field }) => <Input {...field} />}
                                    name="product_name"
                                    control={control}
                                    defaultValue=""
                                    className="materialUIInput"
                                />
                                <p>{errors.product_name?.message}</p> */}

                                {/* <input type="submit" /> */}
                            </CardContent>
                        </Card>
                    </div>
                    <div className="col-md-4"></div>
                </div>
            </form>
        </div>
    )
}

export default creation
