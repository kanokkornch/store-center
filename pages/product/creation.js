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
import { saveProduct } from '../../services/product'
import { uploadImage } from '../../services/utills'
import { geProductCategories, getUnits } from '../../store/actions/productAction'
import { useDispatch, useSelector } from 'react-redux'
import Select from "react-select"
import { Alert, message, Upload, Button as AntButton } from 'antd'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

function NestedOption({ nestIndex, control, register }) {
    const { fields, remove, append } = useFieldArray({
        control,
        name: `options[${nestIndex}].option`
    })
    return (
        <div>
            {fields.map((it, i) => (
                <div key={it.id} className='default-flex-between mb-2 col-gap-5'>
                    <input
                        type="text"
                        className={`form-control`}
                        id={`options[${nestIndex}].option[${i}].value`}
                        name={`options[${nestIndex}].option[${i}].value`}
                        {...register(`options[${nestIndex}].option[${i}].value`, { required: true })}
                        placeholder="" />
                    <input
                        type="number"
                        className={`form-control`}
                        id={`options[${nestIndex}].option[${i}].qty`}
                        name={`options[${nestIndex}].option[${i}].qty`}
                        {...register(`options[${nestIndex}].option[${i}].qty`, { required: true })}
                        placeholder="จำนวน" />
                    <input
                        type="number"
                        className={`form-control`}
                        id={`options[${nestIndex}].option[${i}].cost_price`}
                        name={`options[${nestIndex}].option[${i}].cost_price`}
                        {...register(`options[${nestIndex}].option[${i}].cost_price`, { required: false })}
                        placeholder="ต้นทุน" />
                    <input
                        type="number"
                        className={`form-control`}
                        id={`options[${nestIndex}].option[${i}].sell_price`}
                        name={`options[${nestIndex}].option[${i}].sell_price`}
                        {...register(`options[${nestIndex}].option[${i}].sell_price`, { required: false })}
                        placeholder="ราคาขาย" />
                    <input
                        type="number"
                        className={`form-control`}
                        id={`options[${nestIndex}].option[${i}].discount_price`}
                        name={`options[${nestIndex}].option[${i}].discount_price`}
                        {...register(`options[${nestIndex}].option[${i}].discount_price`, { required: false })}
                        placeholder="ส่วนลด" />
                    <DeleteIcon size="small" className='delete-icon' onClick={() => remove(i)} />
                </div>
            ))}
            <div>
                <Button size="small" variant="outlined" color="primary" onClick={() => append({ value: '', type: 1, qty: 1 })}>
                    เพิ่ม Option
                </Button>
            </div>
        </div>
    )
}

function creation(props) {
    const dispatch = useDispatch()
    const store = useSelector(state => state.product)
    const { categories, units } = store
    const fileInputRef = useRef(null)
    const thumbnailInputRef = useRef(null)
    const [images, setImages] = useState([])
    const [imagesURL, setImagesURL] = useState([])
    const [imagesFile, setImagesFile] = useState([])
    const [productOptions, setProductOptions] = useState([])
    const [categoryFocus, setCategoryFocus] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(1)
    const [thumbnail, setThumbnail] = useState(null)
    const [thumbnailURL, setThumbnailURL] = useState(null)
    const [thumbnailFile, setThumbnailFile] = useState(null)

    const [categoryID, setcategoryID] = useState(null)
    const [subCategoryId, setsubCategoryId] = useState(null)
    const [saving, setSaving] = useState(false)
    const { register, control, handleSubmit, formState: { errors }, setValue, getValues, reset, watch } = useForm({
        defaultValues: {
            unit: {
                value: 1,
                label: "กล่อง"
            },
            qty: 1,
            cost_price: 0,
            sell_price: 0,
            discount_price: 0,
            product_options: []
        }
    })
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
        {
            control,
            name: "product_options"
        }
    )
    const clearform = () => {
        reset()
        setImages([])
        setThumbnail(null)
    }

    const handleSaveProduct = async (data) => {
        const loading = message.loading('กำลังบันทึกข้อมูล...')
        setSaving(true)
        const product_galleries = await uploadProductImage()
        const thumbnailUpload = await uploadImage({ type: 'cats', image_data: thumbnailFile }).then(res => {
            if (res.success) {
                return res.data
            } else {
                setSaving(false)
                setTimeout(loading, 0)
                message.warning('UPLOAD thumbnail ไม่สำเร็จ')
                return
            }
        }).catch(err => {
            setSaving(false)
            setTimeout(loading, 0)
            message.warning('UPLOAD thumbnail IMAGE FAILED')
            return
        })
        let product_options = []
        if (data.product_options.length > 0) {
            product_options = await uploadProductOptionImage(data.product_options)
        }
        data.thumbnail = thumbnailUpload.image_url
        data.unit = data.unit.label
        data.category_id = categoryID
        data.sub_category_id = subCategoryId
        data.status = 1
        data.product_galleries = product_galleries
        data.product_options = product_options
        console.log(`SAVE DATA---`, JSON.stringify(data))
        await saveProduct(data).then(res => {
            setSaving(false)
            setTimeout(loading, 0)
            if (res.success) {
                clearform()
                message.success('บันทึกสำเร็จ')
            } else {
                message.error(`บันทึกไม่สำเร็จ. ${res.message}`)
            }
        }).catch(err => {
            setSaving(false)
            setTimeout(loading, 0)
            message.error(`บันทึกไม่สำเร็จ. ${res.message}`)
        })
    }
    const uploadProductImage = async () => {
        const list = []
        await Promise.all(imagesFile.map(async (img) => {
            await uploadImage({ type: 'cats', image_data: img }).then(res => {
                if (res.success) {
                    list.push(res.data)
                } else {
                    message.warning('UPLOAD ไม่สำเร็จ')
                    return
                }
            }).catch(err => {
                message.warning('UPLOAD IMAGE FAILED')
                return
            })
        }))
        return await list
    }
    const uploadProductOptionImage = async (data) => {
        const list = []
        await Promise.all(data.map(async (img) => {
            await uploadImage({ type: 'cats', image_data: img.thumbnail }).then(res => {
                if (res.success) {
                    img.thumbnail = res.data.image_url
                    list.push(img)
                } else {
                    message.warning('UPLOAD ไม่สำเร็จ')
                    return
                }
            }).catch(err => {
                message.warning('UPLOAD IMAGE FAILED')
                return
            })
        }))
        return await list
    }


    const onSubmit = (data) => {
        if (imagesFile.length < 1) {
            message.warning('กรุณา Upload รูปของสินค้า อย่างน้อย 1 รูปภาพ')
            return
        }
        if (!thumbnailFile) {
            message.warning('กรุณา Upload Thumbnail 1 รูปภาพ')
            return
        }
        if (data.product_options.length > 0) {
            const checkNullImage = data.product_options.find(img => img.thumbnail === null)
            if (checkNullImage) {
                message.warning('กรุณาเพิ่มรูปภาพในตัวเลือกสินค้า')
                return
            }
        }
        handleSaveProduct(data)
    }
    useEffect(() => {
        dispatch(geProductCategories())
        dispatch(getUnits())
    }, [])
    useEffect(() => {
        console.log(`errors`, errors)
    }, [errors])
    useEffect(() => {
        if (images.length < 1) {
            setImagesURL([])
            setImagesFile([])
            return
        }
        const list = []
        images.forEach(image => list.push(URL.createObjectURL(image)))
        setImagesURL(list)
        const forUploadList = []
        images.forEach(img => {
            const reader = new FileReader()
            reader.onloadend = () => {
                forUploadList.push(reader.result)
            }
            reader.readAsDataURL(img)
            setImagesFile(forUploadList)
        })

        // setImagesFile()
    }, [images])
    const onImageChange = (e) => {
        if (e.target.files.length > 8) return alert('แนบรูปภาพได้สูงสุด 8 รูป')
        setImages([...e.target.files])
    }
    const deleteImage = (idx) => {
        images.splice(idx, 1)
        setImages([...images])
    }

    const onThumbnailChange = (e) => {
        setThumbnail(e.target.files[0])
    }
    useEffect(() => {
        if (thumbnail) {
            setThumbnailURL(URL.createObjectURL(thumbnail))
            const reader = new FileReader()
            reader.onloadend = () => {
                setThumbnailFile(reader.result)
            }
            reader.readAsDataURL(thumbnail)
        } else {
            setThumbnailURL(null)
            setThumbnailFile(null)
        }
    }, [thumbnail])

    const handleSelectCategory = (sub_id) => {
        const category = categories.find(c => c.id === selectedCategory)
        if (category) {
            const subCategory = category.sub_categories.find(s => s.id === sub_id)
            if (subCategory) {
                setcategoryID(category.id)
                setsubCategoryId(subCategory.id)
                setValue('category', `${category.name} > ${subCategory.name}`)
            }
        }
        setCategoryFocus(!categoryFocus)
    }

    const onChangeOption = (field, idx, e) => {
        productOptions[idx][field] = e.target.value
        setProductOptions([...productOptions])
    }
    useEffect(() => {
        // console.log(`options`, getValues().options)
    }, [getValues().options])

    const handleAddOption = (idx) => {
        setValue(`options[${idx}].option`, [...getValues().options[idx].option, {
            value: '',
            qty: 0,
            thumbnail: null,
            cost_price: 0,
            sell_price: 0,
            discount_price: 0,
        }])
    }

    const onOptionImageChange = (data, i) => {
        if (data.file && data.file.status && data.file.status === 'done') {
            // insert(i, data.file)
            setValue(`options[${i}].thumbnail`, data.file)
        }
    }
    const onDeleteOptionImageChange = (data, i) => {
        // console.log(`object`, object)
        // insert(i, null)
        setValue(`options[${i}].thumbnail`, null)
    }

    const displayCategories = () => (
        <Fragment>
            <div className="d-flex flex-column w-40-per">
                {categories.map(c => (
                    <div
                        key={c.id}
                        onMouseEnter={() => setSelectedCategory(c.id)}
                        className='category-item default-flex-between px-1'>
                        <span>{c.name}</span>
                        <ChevronRightIcon />
                    </div>
                ))}
            </div>
            <div className="w-60-per sub-category-div">
                {categories.find(c => c.id === selectedCategory) ?
                    categories.find(c => c.id === selectedCategory).sub_categories.map(sc => (
                        <div
                            key={`subcat_${sc.id}`}
                            onClick={() => handleSelectCategory(sc.id)}
                            className='category-item px-1'>
                            <span>{sc.name}</span>
                        </div>
                    )) : null}
            </div>
        </Fragment>
    )

    return (
        <div>
            <div className="h4">เพิ่มสินค้า</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row flex-row">
                    <div className="col-md-9">
                        <Card className='mb-3'>
                            <CardContent>
                                <div className="h5 mb-2">ข้อมูลทั่วไป</div>
                                <label className="form-label fw-bold">
                                    <span className='requird'>* </span>
                                    รูปของสินค้า
                                </label>
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
                                    {imagesURL.length > 0 ? <div className="preview-container flex-wrap p-2">
                                        {imagesURL.map((image, i) => (
                                            <div key={i} className="preview-item">
                                                <DeleteIcon className='z-index-5' onClick={() => deleteImage(i)} />
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
                                    <label htmlFor="name" className="form-label">
                                        <span className='requird'>* </span>
                                        ชื่อสินค้า
                                    </label>
                                    <input
                                        type="text"
                                        {...register('name', { required: true, })}
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        id="name"
                                        placeholder="ชื่อสินค้า" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="code" className="form-label">
                                        <span className='requird'>* </span>
                                        Code
                                    </label>
                                    <input
                                        type="text"
                                        {...register('code', { required: true, })}
                                        className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                                        id="code"
                                        placeholder="รหัสสินค้า" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="sku" className="form-label">
                                        <span className='requird'>* </span>
                                        SKU
                                    </label>
                                    <input
                                        type="text"
                                        {...register('sku', { required: true, })}
                                        className={`form-control ${errors.sku ? 'is-invalid' : ''}`}
                                        id="sku"
                                        placeholder="รหัส SKU" />
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
                                        onFocus={() => setCategoryFocus(!categoryFocus)}
                                        placeholder="หมวดหมู่สินค้า" />
                                </div>
                                {categoryFocus ? <div className='d-flex'>
                                    <Fade in={true}>
                                        <div className='d-flex category-wrapper'>
                                            {displayCategories()}
                                        </div>
                                    </Fade>
                                </div> : null}
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
                                <div className="mb-3">
                                    <label className="form-label fw-bold">
                                        <span className='requird'>* </span>
                                        Thumbnail
                                    </label>
                                    <p>ภาพแสดงสินค้า เลือกภาพที่แสดงถึงสินค้าของคุณได้ดีที่สุด. โดยภาพนี้จะถูกแสดงในหน้าผลลัพธ์การค้นหา, หน้าแนะนำสินค้า, ช่องทางโปรโมชั่นและช่องทางอื่นๆ สินค้าที่มีภาพแสดงที่ดีจะได้รับการเผยแพร่มากยิ่งขึ้น</p>
                                    <div className="drag-area"
                                    >
                                        <input type="file"
                                            accept='image/*'
                                            onChange={onThumbnailChange}
                                            ref={thumbnailInputRef}
                                            style={{ display: 'none' }}
                                        />
                                        {thumbnailURL ? <div className="preview-container flex-wrap p-2">
                                            <div className="preview-item">
                                                <DeleteIcon className='z-index-5' onClick={() => setThumbnail(null)} />
                                                <img
                                                    className="preview-img"
                                                    src={thumbnailURL} alt='' />
                                            </div>
                                        </div> : <>
                                            <div className="icon">
                                                <CloudUploadIcon style={{ fontSize: 50 }} />
                                            </div>
                                        </>
                                        }
                                        <span className="button mt-2" onClick={(e) => {
                                            thumbnailInputRef.current.click()
                                        }}>คลิกเพื่อเลือกรูปภาพ</span>
                                        <span className="support">Supports: JPEG, JPG, PNG</span>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">
                                        <span className='requird'>* </span>
                                        รายละเอียด
                                    </label>
                                    <textarea
                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                        id="description"
                                        {...register('description', { required: true, })}
                                        placeholder="รายละเอียด"
                                        rows="3">
                                    </textarea>
                                </div>
                                <div className="mb-3 row">
                                    <div className="col-6">
                                        <label htmlFor="qty" className="form-label">
                                            <span className='requird'>* </span>
                                            จำนวนสินค้า
                                        </label>
                                        <input
                                            type="number"
                                            {...register('qty', { required: true, })}
                                            className={`form-control text-end ${errors.qty ? 'is-invalid' : ''}`}
                                            id="qty"
                                            placeholder="" />
                                    </div>
                                    <div className="col-6">
                                        <label htmlFor="unit" className="form-label">
                                            <span className='requird'>* </span>
                                            หน่วยสินค้า
                                        </label>
                                        <Controller
                                            name="unit"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => <Select
                                                {...field}
                                                className='react-select'
                                                classNamePrefix='select'
                                                options={units.length ? units.map(it => {
                                                    it.value = it.id
                                                    it.label = it.name
                                                    return it
                                                }) : []
                                                }
                                            />}
                                        />
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <div className="col-6">
                                        <label htmlFor="cost_price" className="form-label">
                                            <span className='requird'>* </span>
                                            ต้นทุน
                                        </label>
                                        <input
                                            type="number"
                                            {...register('cost_price', { required: true, })}
                                            className={`form-control text-end ${errors.cost_price ? 'is-invalid' : ''}`}
                                            id="cost_price"
                                            placeholder="" />
                                    </div>
                                    <div className="col-6">
                                        <label htmlFor="sell_price" className="form-label">
                                            <span className='requird'>* </span>
                                            ราคาขาย
                                        </label>
                                        <input
                                            type="number"
                                            {...register('sell_price', { required: true, })}
                                            className={`form-control text-end ${errors.sell_price ? 'is-invalid' : ''}`}
                                            id="sell_price"
                                            placeholder="" />
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <div className="col-6">
                                        <label htmlFor="discount_price" className="form-label">
                                            ส่วนลด
                                        </label>
                                        <input
                                            type="number"
                                            {...register('discount_price', { required: false, })}
                                            className={`form-control text-end`}
                                            id="discount_price"
                                            placeholder="" />
                                    </div>

                                </div>
                                <div className="mb-3">

                                </div>
                            </CardContent>
                        </Card>
                        <Card className='mb-3'>
                            <CardContent>
                                <div className="h5 mb-2">ตัวเลือกสินค้า</div>
                                <div className="mb-3">เพิ่มตัวเลือกของสินค้า ในกรณีที่สินค้ามีรูปแบบที่หลากหลาย เช่น สี และ ขนาด</div>
                                {fields.map((it, i) => (
                                    <div key={it.id} className="option-item">
                                        <div className='default-flex-between mb-2'>
                                            <span>ตัวเลือกที่ {i + 1}</span>
                                            <DeleteIcon className='delete-icon' onClick={() => remove(i)} />
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="name" className="form-label">
                                                <span className='requird'>* </span>
                                                ชื่อ
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control`}
                                                id={`product_options[${i}].name`}
                                                name={`product_options[${i}].name`}
                                                {...register(`product_options[${i}].name`, { required: true })}
                                                placeholder="เช่น สี ไซต์ รุ่น" />
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="name" className="form-label">
                                                <span className='requird'>* </span>
                                                ตัวเลือก
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control`}
                                                id={`product_options[${i}].value`}
                                                name={`product_options[${i}].value`}
                                                {...register(`product_options[${i}].value`, { required: true })}
                                                placeholder="เช่น แดง ดำ S M L" />
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-2">
                                                <label htmlFor="qty" className="form-label">
                                                    <span className='requird'>* </span>
                                                    จำนวนสินค้า
                                                </label>
                                                <input
                                                    type="number"
                                                    id={`product_options[${i}].qty`}
                                                    name={`product_options[${i}].qty`}
                                                    {...register(`product_options[${i}].qty`, { required: true, })}
                                                    className={`form-control text-end`}
                                                    placeholder="" />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="qty" className="form-label">
                                                    <span className='requird'>* </span>
                                                    ต้นทุน
                                                </label>
                                                <input
                                                    type="number"
                                                    id={`product_options[${i}].cost_price`}
                                                    name={`product_options[${i}].cost_price`}
                                                    {...register(`product_options[${i}].cost_price`, { required: true, })}
                                                    className={`form-control text-end`}
                                                    placeholder="" />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="qty" className="form-label">
                                                    <span className='requird'>* </span>
                                                    ราคาขาย
                                                </label>
                                                <input
                                                    type="number"
                                                    id={`product_options[${i}].sell_price`}
                                                    name={`product_options[${i}].sell_price`}
                                                    {...register(`product_options[${i}].sell_price`, { required: true, })}
                                                    className={`form-control text-end`}
                                                    placeholder="" />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="qty" className="form-label">
                                                    <span className='requird'>* </span>
                                                    ส่วนลด
                                                </label>
                                                <input
                                                    type="number"
                                                    id={`product_options[${i}].discount_price`}
                                                    name={`product_options[${i}].discount_price`}
                                                    {...register(`product_options[${i}].discount_price`, { required: true, })}
                                                    className={`form-control text-end`}
                                                    placeholder="" />
                                            </div>
                                        </div>
                                        <div className="mt-2"></div>
                                        <div className="upload-btn-wrapper d-flex align-items-center flex-wrap">
                                            <button className="btn me-2">Upload a file</button>
                                            <input
                                                type="file"
                                                accept=".png, .jpg, .jpeg"
                                                className='upload-button'
                                                id={`product_options[${i}].image`}
                                                name={`product_options[${i}].image`}
                                                onInput={e => {
                                                    e.preventDefault()
                                                    document.getElementById(`option-preview-${i}`).src = URL.createObjectURL(e.target.files[0])
                                                    const reader = new FileReader()
                                                    reader.onloadend = () => {
                                                        setValue(`product_options[${i}].thumbnail`, reader.result)
                                                    }
                                                    reader.readAsDataURL(e.target.files[0])
                                                }}
                                                {...register(`product_options[${i}].image`, { required: false, })}
                                            />
                                            <img id={`option-preview-${i}`} style={{ maxHeight: '25px' }} src='' alt='' />
                                        </div>
                                    </div>
                                ))}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type='button'
                                    onClick={() => append({ type: 'option', name: '', cost_price: 0, sell_price: 0, qty: 0, discount_price: 0, thumbnail: null })}
                                    startIcon={<AddIcon />}
                                >
                                    เพิ่มตัวเลือกสินค้า
                                </Button>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent>
                                <div className="row">
                                    <div className="col-md-6"></div>
                                    <div className="col-md-6">
                                        <Button
                                            disabled={saving}
                                            startIcon={saving ? <CircularProgress /> : null}
                                            className='w-100' variant="contained" color="primary" type='submit'>
                                            บันทึก
                                        </Button>
                                    </div>
                                </div>

                            </CardContent>
                        </Card>
                    </div>
                    <div className="col-md-3 d-none d-md-block">
                        <Alert
                            message="Tips"
                            description="กรุณาใส่ URL วีดีโอ"
                            type="info"
                            showIcon
                        />
                    </div>
                </div>
            </form>
        </div>
    )
}

export async function getStaticProps(context) {
    return {
        props: {}, // will be passed to the page component as props
    }
}
export default creation

