import { useState, useEffect, useRef, Fragment } from 'react'
import {
    Card, CardContent, CardAction, Fade,
    Paper, Button, CircularProgress
} from '@material-ui/core'
import { useForm, Controller, useFieldArray } from "react-hook-form";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import AddIcon from '@material-ui/icons/Add'
import { getShopInfo, updateShopInfo } from '../../services/shop'
import { uploadImage } from '../../services/utills'
import { geProductCategories, getUnits } from '../../store/actions/productAction'
import { useDispatch, useSelector } from 'react-redux'
import Select from "react-select"
import { Alert, message, Upload, Button as AntButton, Divider } from 'antd'
import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.snow.css'
function InfoSettingPage() {
    const { register, control, handleSubmit, formState: { errors }, setValue, getValues, reset, watch } = useForm()

    const [fileList, setFileList] = useState([])
    const [fileListCover, setFileListCover] = useState([])
    const [logoFile, setlogoFile] = useState(null)
    const [coverFile, setcoverFile] = useState(null)
    const [logoUrl, setLogoUrl] = useState(null)
    const [coverUrl, setCoverUrl] = useState(null)
    const [shopInfo, setshopInfo] = useState(null)
    const [description, setdescription] = useState(null)

    const { quill, quillRef } = useQuill()

    useEffect(() => {
        getShopInfo().then(res => {
            if (res.success) {
                setshopInfo(res.data)
                setValue('id', res.data.id)
                setValue('name', res.data.name)
                setValue('email', res.data.email)
                setValue('phone', res.data.phone)
                setValue('username', res.data.username)
                setValue('facebook', res.data.facebook)
                setValue('twitter', res.data.twitter)
                setValue('instagram', res.data.instagram)
                setValue('line', res.data.line)
                setValue('website', res.data.website)
                if (res.data.logo) {
                    setLogoUrl(res.data.logo)
                    setFileList([{
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: res.data.logo,
                    }])
                }
                if (res.data.cover) {
                    setCoverUrl(res.data.cover)
                    setFileListCover([{
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: res.data.cover,
                    }])
                }

            } else {
                setshopInfo(null)
            }
        }).catch(err => message.error('service ไม่พร้อมใช้งานขณะนี้'))
    }, [])


    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        if (newFileList.length) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setlogoFile(reader.result)
            }
            reader.readAsDataURL(newFileList[0].originFileObj)
        } else {
            setlogoFile(null)
            setLogoUrl(null)
        }
    }
    const onChangeCover = ({ fileList: newFileList }) => {
        setFileListCover(newFileList)
        if (newFileList.length) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setcoverFile(reader.result)
            }
            reader.readAsDataURL(newFileList[0].originFileObj)
        } else {
            setcoverFile(null)
            setCoverUrl(null)
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

    const onUploadImage = async (type = 'logo') => {
        const loading = message.loading('กำลังบันทึกรูปภาพ...')
        uploadImage(
            {
                type: type === 'logo' ? 'shop_logos' : 'cover',
                image_data: type === 'logo' ? logoFile : coverFile
            }
        ).then(res => {
            setTimeout(loading, 0)
            if (res.success) {
                message.success('บันทึกรูปภาพสำเร็จ')
                if (type === 'logo') {
                    setLogoUrl(res.data.url)
                } else {
                    setCoverUrl(res.data.url)
                }
            } else {
                setTimeout(loading, 0)
                message.warning('บันทึกรูปภาพไม่สำเร็จ')
                return
            }
        })
    }


    const onSaveSetting = (data) => {
        if (!logoUrl || !coverUrl) {
            message.warning('กรุณา upload รูปโลโก้หรือหน้าปก')
            return
        }
        data.logo = logoUrl
        data.cover = coverUrl
        data.description = description
        const loading = message.loading('กำลังอัพเดตข้อมูล...')
        updateShopInfo(data).then(res => {
            setTimeout(loading, 0)
            if (res.success) {
                message.success('อัพเดตสำเร็จ')
            } else {
                message.warning('อัพเดตไม่สำเร็จ')
            }
        }).catch(err => {
            setTimeout(loading, 0)
            message.error('service ไม่พร้อมใช้งานขณะนี้')
        })

        // if (imagesFile.length < 1) {
        //     message.warning('กรุณา Upload รูปของสินค้า อย่างน้อย 1 รูปภาพ')
        //     return
        // }
        // if (!thumbnailFile) {
        //     message.warning('กรุณา Upload Thumbnail 1 รูปภาพ')
        //     return
        // }
        // if (data.product_options.length > 0) {
        //     const checkNullImage = data.product_options.find(img => img.thumbnail === null)
        //     if (checkNullImage) {
        //         message.warning('กรุณาเพิ่มรูปภาพในตัวเลือกสินค้า')
        //         return
        //     }
        // }
        // handleSaveProduct(data)
    }

    const clearform = () => {
        reset()
    }
    const selectLocalImage = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = () => {
            const file = input.files[0]
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = () => {
                uploadImage({ type: 'quilljs', image_data: reader.result }).then(res => {
                    if (res.success) {
                        const range = quill.getSelection()
                        quill.insertEmbed(range.index, 'image', res.data.url)
                    } else {
                        message.warning('บันทึกรูปภาพไม่สำเร็จ')
                        return
                    }
                })
            }
        }
    }


    useEffect(() => {
        if (quill) {
            quill.getModule('toolbar').addHandler('image', selectLocalImage)
            quill.on('text-change', (delta, oldDelta, source) => {
                setdescription(quill.root.innerHTML)
            });
            if (shopInfo && shopInfo.description) {
                quill.clipboard.dangerouslyPasteHTML(shopInfo.description)
            }
        }
    }, [quill, shopInfo])
    return (
        <div>
            <div className="h4">ตั้งค่าร้านค้า</div>
            <form onSubmit={handleSubmit(onSaveSetting)}>
                <Card className='mb-3'>
                    <CardContent>
                        <div className="row">
                            <div className="col-12">
                                <label htmlFor="name" className="form-label">
                                    <span className='requird'>* </span>
                                    โลโก้ร้านค้า
                                </label>
                                <p>รูปแบบไฟล์ JPEG, ขนาดสูงสุด 1 MB โลโก้จะปรากฏบนหน้าโฮมเพจร้านค้า ฟีต แชท ค้นหาด้วยการ Search และหน้าอื่น ๆ</p>
                                <div className="d-flex">
                                    <Upload
                                        className='shop-setting-logo'
                                        listType="picture-card"
                                        fileList={fileList}
                                        onChange={onChange}
                                        onPreview={onPreview}
                                    >
                                        {fileList.length < 1 && '+ Upload'}
                                    </Upload>
                                    <div className='logo-upload-btn-con'>
                                        <Button
                                            disabled={logoFile === null}
                                            // startIcon={saving ? <CircularProgress /> : null}
                                            onClick={() => onUploadImage('logo')}
                                            className='' variant="contained" color="primary" type='button'>
                                            บันทึก
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <label htmlFor="name" className="form-label">
                                    <span className='requird'>* </span>
                                    หน้าปกร้านค้า
                                </label>
                                <div className="d-flex">
                                    <Upload
                                        className='shop-setting-logo'
                                        listType="picture-card"
                                        fileList={fileListCover}
                                        onChange={onChangeCover}
                                        onPreview={onPreview}
                                    >
                                        {fileListCover.length < 1 && '+ Upload'}
                                    </Upload>
                                    <div className='logo-upload-btn-con'>
                                        <Button
                                            disabled={coverFile === null}
                                            // startIcon={saving ? <CircularProgress /> : null}
                                            onClick={() => onUploadImage('cover')}
                                            className='' variant="contained" color="primary" type='button'>
                                            บันทึก
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-9">
                                <div className="row">
                                    <div className="col-lg-6 my-3">
                                        <label htmlFor="name" className="form-label">
                                            <span className='requird'>* </span>
                                            ชื่อร้านค้า
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue={shopInfo && shopInfo.name}
                                            {...register('name', { required: true, })}
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            id="name"
                                            placeholder="ชื่อร้านค้า" />
                                    </div>
                                    <div className="col-lg-6 my-3">
                                        <label htmlFor="name" className="form-label">
                                            <span className='requird'>* </span>
                                            email
                                        </label>
                                        <input
                                            type="text"
                                            {...register('email', { required: true, })}
                                            defaultValue={shopInfo && shopInfo.email}
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            id="email"
                                            placeholder="email" />
                                    </div>
                                    <div className="col-lg-6 mb-3">
                                        <label htmlFor="name" className="form-label">
                                            <span className='requird'>* </span>
                                            เบอร์โทรศัพท์
                                        </label>
                                        <input
                                            type="text"
                                            {...register('phone', { required: true, })}
                                            defaultValue={shopInfo && shopInfo.phone}
                                            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                            id="phone"
                                            placeholder="phone" />
                                    </div>
                                    <div className="col-lg-6 mb-3">
                                        <label htmlFor="name" className="form-label">
                                            <span className='requird'>* </span>
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            disabled
                                            {...register('username', { required: true, })}
                                            defaultValue={shopInfo && shopInfo.username}
                                            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                            id="username"
                                            placeholder="Username" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <label htmlFor="name" className="form-label">
                            {/* <span className='requird'>* </span> */}
                            รายละเอียดร้านค้า
                        </label>
                        <div style={{ width: '100%', height: 'fit-content' }}>
                            <div ref={quillRef} />
                        </div>
                    </CardContent>
                </Card>
                <Card className='mb-3'>
                    <CardContent>
                        <div className="row">
                            <div className="col-lg-9">
                                <div className="row">
                                    <div className="col-lg-6 mb-3">
                                        <label htmlFor="facebook" className="form-label">
                                            <span className='requird'>* </span>
                                            facebook
                                        </label>
                                        <input
                                            type="text"
                                            {...register('facebook', { required: true, })}
                                            id="facebook"
                                            defaultValue={shopInfo && shopInfo.facebook}
                                            className={`form-control ${errors.facebook ? 'is-invalid' : ''}`}
                                            placeholder="Facebook" />
                                    </div>
                                    <div className="col-lg-6 mb-3">
                                        <label htmlFor="twitter" className="form-label">
                                            <span className='requird'>* </span>
                                            twitter
                                        </label>
                                        <input
                                            type="text"
                                            {...register('twitter', { required: true, })}
                                            id="twitter"
                                            className={`form-control ${errors.twitter ? 'is-invalid' : ''}`}
                                            defaultValue={shopInfo && shopInfo.twitter}
                                            placeholder="twitter" />
                                    </div>
                                    <div className="col-lg-6 mb-3">
                                        <label htmlFor="twitter" className="form-label">
                                            <span className='requird'>* </span>
                                            instagram
                                        </label>
                                        <input
                                            type="text"
                                            {...register('instagram', { required: true, })}
                                            id="instagram"
                                            className={`form-control ${errors.instagram ? 'is-invalid' : ''}`}
                                            defaultValue={shopInfo && shopInfo.instagram}
                                            placeholder="instagram" />
                                    </div>
                                    <div className="col-lg-6 mb-3">
                                        <label htmlFor="twitter" className="form-label">
                                            <span className='requird'>* </span>
                                            line
                                        </label>
                                        <input
                                            type="text"
                                            {...register('line', { required: true, })}
                                            id="line"
                                            className={`form-control ${errors.line ? 'is-invalid' : ''}`}
                                            defaultValue={shopInfo && shopInfo.line}
                                            placeholder="line" />
                                    </div>
                                    <div className="col-lg-6 mb-3">
                                        <label htmlFor="twitter" className="form-label">
                                            website
                                        </label>
                                        <input
                                            type="text"
                                            {...register('website', { required: false, })}
                                            id="website"
                                            className={`form-control`}
                                            defaultValue={shopInfo && shopInfo.website}
                                            placeholder="website" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <div className="row">
                            <div className="col-md-6"></div>
                            <div className="col-md-6">
                                <Button
                                    // disabled={saving}
                                    // startIcon={saving ? <CircularProgress /> : null}
                                    className='w-100' variant="contained" color="primary" type='submit'>
                                    บันทึก
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}

export default InfoSettingPage
