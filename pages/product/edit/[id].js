import { useState, useEffect, useRef, Fragment } from 'react'
import { useRouter } from 'next/router'
import { getProductsById, uploadImage } from '../../../services/api'
import { geProductCategories, getUnits } from '../../../store/actions/productAction'
import { Card, CardContent, CardAction, Fade, Paper, Button } from '@material-ui/core'
import { useForm, Controller, useFieldArray } from "react-hook-form";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import AddIcon from '@material-ui/icons/Add'
import { useDispatch, useSelector } from 'react-redux'
import Select from "react-select"
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
function editProduct() {
    const router = useRouter()
    const { id } = router.query
    const [data, setData] = useState(null)

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

    const [galleries, setGalleries] = useState([])

    const [categoryID, setcategoryID] = useState(null)
    const [subCategoryId, setsubCategoryId] = useState(null)
    const { register, control, handleSubmit, formState: { errors }, setValue, getValues, reset } = useForm({
        defaultValues: {
            unit: {
                value: 1,
                label: "กล่อง"
            },
            qty: 1,
            cost_price: 0,
            sell_price: 0,
            discount_price: 0,
            options: []
        }
    })
    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
        {
            control,
            name: "options"
        }
    )
    const clearform = () => {
        reset()
        setImages([])
        setThumbnail(null)
    }

    useEffect(() => {
        if (id) {
            getProductsById(id).then(res => {
                if (res.success) {
                    if (res.data.product_galleries.length) {
                        const photos = res.data.product_galleries.map(pt => pt.url)
                        setImagesURL([...photos])
                        setGalleries([...photos])
                    }
                    setThumbnail(res.data.thumbnail)
                    setValue('name', res.data.name)
                    setValue('code', res.data.code)
                    setValue('sku', res.data.sku)
                    setValue('description', res.data.description)
                    setValue('description', res.data.description)
                    setValue('qty', res.data.qty)
                    setValue('cost_price', res.data.cost_price)
                    setValue('sell_price', res.data.sell_price)
                    setValue('discount_price', res.data.discount_price)
                    setValue('options', res.data.product_options)
                    setcategoryID(res.data.category_id)
                    setsubCategoryId(res.data.sub_category_id)
                    setData(res.data)
                }
            }).catch(err => {

            })
        }

        return () => {

        }
    }, [id])

    useEffect(() => {
        if (units.length > 0 && data) {
            const unit = units.find(u => u.name === data.unit)
            unit && setValue('unit', unit)
        }
    }, [units])

    const onSubmit = (data) => {
        const product_galleries = []
        if (imagesFile.length > 0) {
            imagesFile.map(img => {
                uploadImage({ type: 'cats', image_data: img }).then(res => {
                    if (res.success) {
                        product_galleries.push(res.data)
                    } else {
                        alert('UPLOAD ไม่สำเร็จ')
                    }
                }).catch(err => {
                    console.log(`UPLOAD IMAGE FAILED:`, err)
                    // alert('UPLOAD IMAGE FAILED: ', err)
                })
            })
        } else {
            if (galleries.length < 1) {
                alert('กรุณา Upload รูปของสินค้า อย่างน้อย 1 รูปภาพ')
                return
            }
            if (imagesFile.length < 1 && galleries.length < 1) {
                alert('กรุณา Upload รูปของสินค้า อย่างน้อย 1 รูปภาพ')
                return
            }
        }
        //เช็คว่า Upload เสร็จรึยัง
        if (thumbnailFile) {
            uploadImage({ type: 'cats', image_data: thumbnailFile }).then(res => {
                if (res.success) {
                    data.image_url = res.data.image_url
                    handleSaveProduct(data, product_galleries)
                } else {
                    alert('UPLOAD ไม่สำเร็จ')
                }
            }).catch(err => {
                console.log(`UPLOAD IMAGE FAILED:`, err)
            })
        } else {
            if (!thumbnail) {
                alert('กรุณา Upload Thumbnail 1 รูปภาพ')
                return
            } else {
                data.image_url = thumbnail
                handleSaveProduct(data, product_galleries)
            }

        }
    }
    const handleSaveProduct = (param, galleriesList = []) => {
        if (imagesFile.length < 1 && galleries.length > 0) {
            galleriesList = galleries
        }
        // const formData = {
        //     ...data,
        //     id: data.id,
        //     thumbnail: data.image_url,
        //     qty: parseFloat(data.qty),
        //     unit: data.unit.label,
        //     cost_price: parseFloat(data.cost_price),
        //     sell_price: parseFloat(data.sell_price),
        //     discount_price: parseFloat(data.discount_price || 0),
        //     category_id: categoryID,
        //     sub_category_id: subCategoryId,
        //     status: 1,
        //     product_galleries: galleriesList,
        //     product_options: data.options,
        // }
        const formData = param
        formData.id = id
        formData.thumbnail = param.image_url
        formData.qty = parseFloat(data.qty)
        formData.unit = param.unit.label
        formData.cost_price = parseFloat(data.cost_price)
        formData.sell_price = parseFloat(data.sell_price)
        formData.discount_price = parseFloat(data.discount_price || 0)
        formData.category_id = categoryID
        formData.sub_category_id = subCategoryId
        formData.status = 1
        formData.product_galleries = galleriesList
        formData.product_options = param.options


        console.log('FORM DATA--->', JSON.stringify(formData))
        saveProduct(formData).then(res => {
            if (res.success) {
                clearform()
                return MySwal.fire({
                    title: res.message,
                    text: 'บันทึกสินค้าสำเร็จ',
                    icon: 'success'
                })
            } else {
                return MySwal.fire({
                    title: 'ข้อความจากระบบ',
                    text: res.message,
                    icon: 'error'
                })
            }
        }).catch(err => {
            alert('บันทึกไม่สำเร็จ')
        })
    }

    useEffect(() => {
        dispatch(geProductCategories())
        dispatch(getUnits())
    }, [])
    useEffect(() => {
        console.log(`errors`, errors)
    }, [errors])
    useEffect(() => {
        let list = []
        if (images.length < 1) {
            setImagesURL([])
            setImagesFile([])
            return

        }
        images.forEach(image => {
            console.log(image)

            if (typeof (image) === 'string') {
                list.push(image)
            } else {
                list.push(URL.createObjectURL(image))
            }
        })
        setImagesURL(list)
        const forUploadList = []
        images.forEach(img => {
            if (typeof (img) === 'string') {
            } else {
                const reader = new FileReader()
                reader.onloadend = () => {
                    forUploadList.push(reader.result)
                }
                reader.readAsDataURL(img)
                setImagesFile(forUploadList)
            }

        })

    }, [images])
    const onImageChange = (e) => {
        if (e.target.files.length > 8) return alert('แนบรูปภาพได้สูงสุด 8 รูป')
        if (galleries.length > 0) {
            setImages([...galleries, ...e.target.files])
        } else {
            setImages([...e.target.files])
        }
    }
    const deleteImage = (idx, url) => {
        if (galleries.length > 0) {
            const find = galleries.findIndex(img => img === url)
            if (find !== -1) {
                galleries.splice(find, 1)
                setGalleries([...galleries])
            }
        }
        if (images.length) {
            images.splice(idx, 1)
            setImages([...images])
        } else {
            imagesURL.splice(idx, 1)
            setImagesURL([...imagesURL])
            data.product_galleries.splice(idx, 1)
            setData(data)
        }

    }

    const deleteOptions = (id) => {
        setProductOptions([...productOptions.filter(op => op.id !== id)])
    }

    const onThumbnailChange = (e) => {
        setThumbnail(e.target.files[0])
    }
    useEffect(() => {
        if (thumbnail) {
            if (typeof (thumbnail) === 'string') {
                setThumbnailURL(thumbnail)
            } else {
                setThumbnailURL(URL.createObjectURL(thumbnail))
                const reader = new FileReader()
                reader.onloadend = () => {
                    setThumbnailFile(reader.result)
                }
                reader.readAsDataURL(thumbnail)
            }
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
    const setDefaultCategory = () => {
        let name = ''
        let subName = ''
        if (data) {
            const find = categories.find(c => c.id === data.category_id)
            if (find) {
                name = find.name
                const subCat = find.sub_categories.find(sub => sub.id === data.sub_category_id)
                if (subCat) subName = subCat.name
            }
        }
        return `${name} > ${subName}`
    }


    return (
        <div>
            <div className="h3">เพิ่ม/แก้ไขสินค้า</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
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
                                                <DeleteIcon className='z-index-5' onClick={() => deleteImage(i, image)} />
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
                                        defaultValue={setDefaultCategory()}
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
                                        <span className='requird'>* </span>รายละเอียด
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
                                        {/* <Controller
                                            name={`product[${i}].name`}
                                            control={control}
                                            rules={{ required: true }}
                                            defaultValue=''
                                            render={(
                                                { onChange, onBlur, value, name, ref },
                                                { invalid, isTouched, isDirty }
                                            ) => (
                                                <Select
                                                    className={`react-select custom ${invalid ? 'required' : ''}`}
                                                    classNamePrefix='select'
                                                    name={name}
                                                    isLoading={!products || products.length < 1}
                                                    options={products.length ? products.map(it => {
                                                        it.value = it.id
                                                        it.label = `${it.product_sku} : ${it.product_name}`
                                                        it.price = it.product_price
                                                        return it
                                                    }) : []
                                                    }
                                                    innerRef={ref}
                                                    isClearable={false}
                                                    onChange={(data) => {
                                                        onChange(data)
                                                        const values = getValues()
                                                        setValue(`product[${i}].price`, data.price)
                                                        setValue(`product[${i}].total`, parseFloat(data.price || 0) * parseFloat(values.product[i].qty || 0))
                                                        if (errors.product && errors.product[i] && errors.product[i].price) {
                                                            clearErrors(`product[${i}].price`)
                                                        }
                                                        calTotal()
                                                    }}
                                                />
                                            )}

                                        /> */}
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
                                            defaultValue={data ? data.cost_price : 0}
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
                                            defaultValue={data ? data.sell_price : 0}
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
                                            defaultValue={data ? data.discount_price : 0}
                                            {...register('discount_price', { required: false, })}
                                            className={`form-control text-end`}
                                            id="discount_price"
                                            placeholder="" />
                                    </div>

                                </div>
                                <div className="mb-3">

                                </div>
                                {/* <div className="mb-3">
                                    <label htmlFor="product_name" className="form-label">
                                        URL วิดีโอ
                                    </label>
                                    <input
                                        type="text"
                                        {...register('video_url', { required: false })}
                                        className={`form-control ${errors.video_url ? 'is-invalid' : ''}`}
                                        id="video_url"
                                        placeholder="" />
                                </div> */}
                            </CardContent>
                        </Card>
                        <Card className='mb-3'>
                            <CardContent>
                                <div className="h5 mb-2">ตัวเลือกสินค้า</div>
                                <div className="mb-3">เพิ่มตัวเลือกของสินค้า ในกรณีที่สินค้ามีรูปแบบที่หลากหลาย เช่น สี และ ขนาด</div>
                                {productOptions.length > 0 ? productOptions.map((op, i) => (
                                    <div className="option-item" key={`option_${i + 1}`}>
                                        <div className='default-flex-between'>
                                            <span>ตัวเลือกที่ {i + 1}</span>
                                            <DeleteIcon className='delete-icon' onClick={() => deleteOptions(op.id)} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">
                                                <span className='requird'>* </span>
                                                Variant Name
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control`}
                                                id="name"
                                                defaultValue={op.name}
                                                // onChange={(e) => onChangeOption('name', i, e)}
                                                placeholder="" />
                                        </div>
                                    </div>
                                )) : null}
                                {fields.map((it, i) => (
                                    <div key={it.id} className="option-item">
                                        <div className='default-flex-between'>
                                            <span>ตัวเลือกที่ {i + 1}</span>
                                            <DeleteIcon className='delete-icon' onClick={() => remove(i)} />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">
                                                <span className='requird'>* </span>
                                                Variant Name
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control`}
                                                id={`options[${i}].name`}
                                                name={`options[${i}].name`}
                                                {...register(`options[${i}].name`, { required: true })}
                                                placeholder="เช่น สี/ไซต์/รุ่น" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Options
                                            </label>
                                            <NestedOption nestIndex={i} {...{ control, register }} />
                                        </div>
                                    </div>
                                ))}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => append({ name: '', option: [] })}
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
                                        <Button className='w-100' variant="contained" color="primary" type='submit'>
                                            บันทึก
                                        </Button>
                                    </div>
                                </div>

                            </CardContent>
                        </Card>
                    </div>
                    <div className="col-md-4">

                    </div>
                </div>
            </form>
        </div>
    )
}

export default editProduct
