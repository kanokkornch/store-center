import { useState, useEffect, useRef, Fragment } from 'react'
import { useForm, Controller, useFieldArray } from "react-hook-form";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { useDispatch, useSelector } from 'react-redux'
import InfoIcon from '@material-ui/icons/Info'
import DeleteIcon from '@material-ui/icons/Delete'
import { uploadImage } from '../../services/api'
import { verifyUser } from '../../services/shop_api'

function verification (){
    const [image, setImage]  = useState('')
    const [imagesURL, setImageURL]  = useState('')
    const fileInputRef = useRef(null)
    const { register , control, handleSubmit , formState: { errors } ,reset} = useForm()
    
    useEffect(()=>{
        if(image != ''){
            setImageURL(URL.createObjectURL(image))
            const reader = new FileReader()
            reader.onloadend = () => {
                setImageURL(reader.result)
            }
            reader.readAsDataURL(image)
        }
    },[image])

    const onImageChange = (e) => {
        setImage(e.target.files[0])
        console.log(e.target.files[0]);
    }

    const deleteImage = (e) => {
        setImage('')
        setImageURL('')
    }

    const clearform = () => {
        reset()
        setImage('')
        setImageURL('')
    }

    let validateVerification = (formData) => {
        if(imagesURL != ''){
            uploadImage({ type: 'shop_verification', image_data: imagesURL }).then(res => {
                if (res.success) {
                    formData.attach_file = res.data.image_url
                    formData.type = "SHOP_VERIFY";
                    if(formData.attach_file !== ''){
                        verifyUser(formData).then(res => {
                            if(res.success){
                                alert('ส่งคำขอยืนยันตัวตนแล้ว แอดมินจะรีบตรวจสอบข้อมูลให้เร็วที่สุดค่ะ');
                                clearform()
                            }
                        })
                    }
                } else {
                    alert('UPLOAD ไม่สำเร็จ')
                }
            }).catch(err => {
                console.log(`UPLOAD IMAGE FAILED:`, err)
                // alert('UPLOAD IMAGE FAILED: ', err)
            })
        }

        
    }


    return (
        <div>
            <form onSubmit={handleSubmit(validateVerification)} >
                <div className='card'>
                    <div className='card-header'>
                        <h5>ระบบยืนยันตัวตนด้วยบัตรประชาชน</h5>
                    </div>
                    <div className='card-body'>
                        <div className="form-group">
                            <div className="drag-area">
                                <input type="file"
                                    accept='image/*'
                                    onChange={onImageChange}
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                />
                                {imagesURL != '' ? <div className="preview-container flex-wrap p-2">
                                    <div className="preview-item">
                                        <DeleteIcon className='z-index-5' onClick={() => deleteImage()} />
                                        <img
                                            className="preview-img"
                                            src={imagesURL} alt='' />
                                    </div>
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

                        </div>
                        <div className="form-group">
                            <label htmlFor="id_card_no">เลขประจำตัวประชาชน</label>
                            <input id="id_card_no" 
                                type="number" 
                                className={`form-control ${errors.id_card_no ? 'is-invalid':''}`} 
                                placeholder="เลขประจำตัวประชาชน"
                                {...register('id_card_no',{ maxLength:13,  required:true})} 
                            />
                        </div>
                        <div className="form-group mt-3">
                            <button type="submit" className="btn btn-primary">
                                <InfoIcon/> ยืนยันตัวตน
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default verification