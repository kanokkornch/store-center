import { useState, useEffect, useRef, Fragment } from 'react'
import { useRouter } from 'next/router'
import { getProductsById, updateProduct } from '../../../services/product'
import { uploadImage } from '../../../services/utills'
import { geProductCategories, getUnits } from '../../../store/actions/productAction'
import { Card, CardContent, CardAction, Fade, Paper, Button, CircularProgress } from '@material-ui/core'
import { useForm, Controller, useFieldArray } from "react-hook-form";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import AddIcon from '@material-ui/icons/Add'
import { useDispatch, useSelector } from 'react-redux'
import { message } from 'antd'
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
                        placeholder="???????????????" />
                    <input
                        type="number"
                        className={`form-control`}
                        id={`options[${nestIndex}].option[${i}].cost_price`}
                        name={`options[${nestIndex}].option[${i}].cost_price`}
                        {...register(`options[${nestIndex}].option[${i}].cost_price`, { required: false })}
                        placeholder="??????????????????" />
                    <input
                        type="number"
                        className={`form-control`}
                        id={`options[${nestIndex}].option[${i}].sell_price`}
                        name={`options[${nestIndex}].option[${i}].sell_price`}
                        {...register(`options[${nestIndex}].option[${i}].sell_price`, { required: false })}
                        placeholder="?????????????????????" />
                    <input
                        type="number"
                        className={`form-control`}
                        id={`options[${nestIndex}].option[${i}].discount_price`}
                        name={`options[${nestIndex}].option[${i}].discount_price`}
                        {...register(`options[${nestIndex}].option[${i}].discount_price`, { required: false })}
                        placeholder="??????????????????" />
                    <DeleteIcon size="small" className='delete-icon' onClick={() => remove(i)} />
                </div>
            ))}
            <div>
                <Button size="small" variant="outlined" color="primary" onClick={() => append({ value: '', type: 1, qty: 1 })}>
                    ??????????????? Option
                </Button>
            </div>
        </div>
    )
}
function EditProductPage() {
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
    const [saving, setSaving] = useState(false)
    const { register, control, handleSubmit, formState: { errors }, setValue, getValues, reset } = useForm({
        defaultValues: {
            unit: {
                value: 1,
                label: "???????????????"
            },
            qty: 1,
            status: 1,
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
                    setValue('id', id)
                    setValue('name', res.data.name)
                    setValue('code', res.data.code)
                    setValue('sku', res.data.sku)
                    setValue('thumbnail', res.data.thumbnail)
                    setValue('description', res.data.description)
                    setValue('qty', res.data.qty)
                    setValue('cost_price', res.data.cost_price)
                    setValue('sell_price', res.data.sell_price)
                    setValue('discount_price', res.data.discount_price)
                    setValue('product_options', res.data.product_options)
                    setcategoryID(res.data.category_id)
                    setsubCategoryId(res.data.sub_category_id)
                    setData(res.data)
                    if (res.data.product_options.length > 0) {
                        res.data.product_options.map((op, i) => {
                            if (op.thumbnail) {
                                document.getElementById(`option-preview-${i}`).src = op.thumbnail
                            }
                        })
                    }
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
    }, [units, data])

    const handleSaveProduct = async (data) => {
        setSaving(true)
        const loading = message.loading('???????????????????????????????????????????????????...')
        let gals = []
        if (galleries.length > 0) {
            gals = galleries.map(img => ({ url: img }))
        }
        let product_galleries = []
        if (imagesFile.length > 0) {
            product_galleries = await uploadProductImage()
            product_galleries = [...gals, ...product_galleries]
        } else {
            product_galleries = gals
        }
        let thumbnailUpload = null
        if (thumbnailFile) {
            thumbnailUpload = await uploadImage({ type: 'cats', image_data: thumbnailFile }).then(res => {
                if (res.success) {
                    return res.data
                } else {
                    setSaving(false)
                    setTimeout(loading, 0)
                    message.warning('UPLOAD thumbnail ???????????????????????????')
                    return
                }
            }).catch(err => {
                setSaving(false)
                setTimeout(loading, 0)
                message.warning('UPLOAD thumbnail IMAGE FAILED')
                return
            })
        } else {
            thumbnailUpload = data.thumbnail
        }

        let product_options = []
        if (data.product_options.length > 0) {
            product_options = await uploadProductOptionImage(data.product_options)
        }
        data.thumbnail = thumbnailUpload && thumbnailUpload.url ? thumbnailUpload.url : thumbnailUpload
        data.unit = data.unit.label
        data.category_id = categoryID
        data.sub_category_id = subCategoryId
        data.status = 1
        data.product_galleries = product_galleries
        data.product_options = product_options
        console.log(`UPDATE DATA---`, JSON.stringify(data))
        await updateProduct(data).then(res => {
            setSaving(false)
            setTimeout(loading, 0)
            if (res.success) {
                message.success('????????????????????????????????????')
            } else {
                message.error(`?????????????????????????????????????????????. ${res.message}`)
            }
        }).catch(err => {
            setSaving(false)
            setTimeout(loading, 0)
            message.error(`service ????????????????????????????????????????????????????????????.`)
        })
    }

    const uploadProductImage = async () => {
        const list = []
        await Promise.all(imagesFile.map(async (img) => {
            await uploadImage({ type: 'cats', image_data: img }).then(res => {
                if (res.success) {
                    list.push(res.data)
                } else {
                    message.warning('UPLOAD ???????????????????????????')
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
            if (!img.thumbnail.includes('http')) {
                await uploadImage({ type: 'cats', image_data: img.thumbnail }).then(res => {
                    if (res.success) {
                        img.thumbnail = res.data.url
                        list.push(img)
                    } else {
                        message.warning('UPLOAD ???????????????????????????')
                        return
                    }
                }).catch(err => {
                    message.warning('UPLOAD IMAGE FAILED')
                    return
                })
            } else {
                list.push(img)
            }

        }))
        return await list
    }

    const onSubmit = (data) => {
        if (imagesFile.length < 1 && galleries.length < 1) {
            message.warning('??????????????? Upload ???????????????????????????????????? ??????????????????????????? 1 ??????????????????')
            return
        }
        if (!thumbnailFile && !thumbnail) {
            message.warning('??????????????? Upload Thumbnail 1 ??????????????????')
            return
        }
        if (data.product_options.length > 0) {
            const checkNullImage = data.product_options.find(img => img.thumbnail === null)
            if (checkNullImage) {
                message.warning('????????????????????????????????????????????????????????????????????????????????????????????????')
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
        if (e.target.files.length > 8) return alert('?????????????????????????????????????????????????????? 8 ?????????')
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
    useEffect(() => {
        let name = ''
        let subName = ''
        if (categories.length > 0 && data) {
            const find = categories.find(c => c.id === data.category_id)
            if (find) {
                name = find.name
                const subCat = find.sub_categories.find(sub => sub.id === data.sub_category_id)
                if (subCat) subName = subCat.name
            }
        }
        setValue('category', `${name} > ${subName}`)
    }, [categories, data])


    return (
        <div>
            <div className="h4">???????????????/?????????????????????????????????</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-md-9">
                        <Card className='mb-3'>
                            <CardContent>
                                <div className="h5 mb-2">????????????????????????????????????</div>
                                <label className="form-label fw-bold">
                                    <span className='requird'>* </span>
                                    ????????????????????????????????????
                                </label>
                                <p>??????????????????????????????????????????????????????????????????????????????????????????????????????. ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????. ??????????????????????????? 8 ?????????. ????????????????????????????????? 330x330 ????????? 5000x5000 px. ???????????????????????????????????????????????????????????????????????????????????????????????????.</p>
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
                                    }}>????????????????????????????????????????????????????????????</span>
                                    <span className="support">Supports: JPEG, JPG, PNG</span>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">
                                        <span className='requird'>* </span>
                                        ??????????????????????????????
                                    </label>
                                    <input
                                        type="text"
                                        {...register('name', { required: true, })}
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        id="name"
                                        placeholder="??????????????????????????????" />
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
                                        placeholder="??????????????????????????????" />
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
                                        placeholder="???????????? SKU" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="product_name" className="form-label">
                                        <span className='requird'>* </span>
                                        ??????????????????????????????????????????
                                    </label>
                                    <input
                                        type="text"
                                        // defaultValue={setDefaultCategory()}
                                        {...register('category', { required: true, })}
                                        className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                                        id="category"
                                        onFocus={() => setCategoryFocus(!categoryFocus)}
                                        placeholder="??????????????????????????????????????????" />
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
                                        URL ??????????????????
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
                                    <p>??????????????????????????????????????? ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????. ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????, ?????????????????????????????????????????????, ????????????????????????????????????????????????????????????????????????????????????????????? ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</p>
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
                                        }}>????????????????????????????????????????????????????????????</span>
                                        <span className="support">Supports: JPEG, JPG, PNG</span>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">
                                        <span className='requird'>* </span>??????????????????????????????
                                    </label>
                                    <textarea
                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                        id="description"
                                        {...register('description', { required: true, })}
                                        placeholder="??????????????????????????????"
                                        rows="3">
                                    </textarea>
                                </div>
                                <div className="mb-3 row">
                                    <div className="col-6">
                                        <label htmlFor="qty" className="form-label">
                                            <span className='requird'>* </span>
                                            ?????????????????????????????????
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
                                            ?????????????????????????????????
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
                                            ??????????????????
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
                                            ?????????????????????
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
                                            ??????????????????
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
                            </CardContent>
                        </Card>
                        <Card className='mb-3'>
                            <CardContent>
                                <div className="h5 mb-2">??????????????????????????????????????????</div>
                                <div className="mb-3">?????????????????????????????????????????????????????????????????? ?????????????????????????????????????????????????????????????????????????????????????????????????????? ???????????? ?????? ????????? ????????????</div>
                                {productOptions.length > 0 ? productOptions.map((op, i) => (
                                    <div className="option-item" key={`option_${i + 1}`}>
                                        <div className='default-flex-between'>
                                            <span>????????????????????????????????? {i + 1}</span>
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
                                        <div className='default-flex-between mb-2'>
                                            <span>????????????????????????????????? {i + 1}</span>
                                            <DeleteIcon className='delete-icon' onClick={() => remove(i)} />
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="name" className="form-label">
                                                <span className='requird'>* </span>
                                                ????????????
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control`}
                                                id={`product_options[${i}].name`}
                                                name={`product_options[${i}].name`}
                                                {...register(`product_options[${i}].name`, { required: true })}
                                                placeholder="???????????? ?????? ???????????? ????????????" />
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="name" className="form-label">
                                                <span className='requird'>* </span>
                                                ????????????????????????
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control`}
                                                id={`product_options[${i}].value`}
                                                name={`product_options[${i}].value`}
                                                {...register(`product_options[${i}].value`, { required: true })}
                                                placeholder="???????????? ????????? ?????? S M L" />
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-2">
                                                <label htmlFor="qty" className="form-label">
                                                    <span className='requird'>* </span>
                                                    ?????????????????????????????????
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
                                                    ??????????????????
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
                                                    ?????????????????????
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
                                                    ??????????????????
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
                                                    if (document.getElementById(`option-preview-old-${i}`)) document.getElementById(`option-preview-old-${i}`).style.display = 'none'
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
                                            {getValues().product_options[i].thumbnail && getValues().product_options[i].thumbnail.includes('http') && console.log(`object`, getValues().product_options[i].thumbnail)}
                                        </div>
                                    </div>
                                ))}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => append({ type: 'option', name: '', cost_price: 0, sell_price: 0, qty: 0, discount_price: 0, thumbnail: null })}
                                    startIcon={<AddIcon />}
                                >
                                    ?????????????????????????????????????????????????????????
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
                                            ??????????????????
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

export default EditProductPage
