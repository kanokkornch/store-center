import { useState, useEffect, useRef, Fragment } from 'react'
import {
    Card, CardContent, CardAction, Fade, Paper, Button,
    AppBar, Tabs, Tab, Typography, Box, Badge,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TablePagination, TableRow, TableSortLabel, Checkbox,
    Snackbar
} from '@material-ui/core'
import { notification, message, Modal, Button as AntdButton } from 'antd'
import { useForm, Controller, useFieldArray } from "react-hook-form";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add'
import { getProducts, deleteProduct, getProductsById, updateProduct } from '../services/product'
import { geProductCategories } from '../store/actions/productAction'
import { useDispatch, useSelector } from 'react-redux'
import Select from "react-select"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import CustomTable from '../components/bootstrap5/table'
import FilterListIcon from '@material-ui/icons/FilterList'
import Link from 'next/link'
function ProductPage() {
    const dispatch = useDispatch()
    const store = useSelector(state => state.product)
    const { categories } = store
    const [value, setValue] = useState(0)
    const [products, setProducts] = useState([])
    const [listData, setListData] = useState({ counts: 0, limit: 10, offset: 0 })
    const [notFound, setNotFound] = useState(false)
    const [filterValue, setFilterValue] = useState('')
    const [filterTitle, setFilterTitle] = useState({ value: 'name', text: 'ชื่อสินค้า' })
    const [visibleStock, setVisibleStock] = useState(false)
    const [visiblePrice, setVisiblePrice] = useState(false)
    const [product, setProduct] = useState(null)
    const [filterParam, setFilterParam] = useState({
        category_id: '',
        offset: 0,
        limit: 100,
        status: '',
        type: 'name',
        keyword: ''
    })
    const [modalSearchKeyword, setModalSearchKeyword] = useState('')
    const [modalSearchPrice, setModalSearchPrice] = useState('')
    const [filterOptions, setFilterOptions] = useState([])
    const [updateOption, setUpdateOption] = useState(null)
    useEffect(() => {
      document.title = 'จัดการสินค้า'
    })
    
    const handleChangeTab = (e, newValue) => {
        setValue(newValue)
        e.preventDefault()
    }
    function a11yProps(index) {
        return {
            id: `scrollable-auto-tab-${index}`,
            'aria-controls': `scrollable-auto-tabpanel-${index}`,
        };
    }
    const openNotificationWithIcon = (type, desc) => {
        notification[type]({
            message: 'ข้อความจากระบบ',
            description: desc,
        })
    }

    const fetchProducts = () => {
        setNotFound(false)
        getProducts(filterParam).then(res => {
            if (res.success) {
                res.data.products.length < 1 && setNotFound(true)
                setProducts(res.data.products)
            } else {
                openNotificationWithIcon('error', res.message)
                setNotFound(true)
            }
        }).catch(err => {
            openNotificationWithIcon('error', 'SERVER ERROR')
            setNotFound(true)
        })
    }

    useEffect(() => {
        document.title = 'จัดการสินค้า'
        fetchProducts()
        dispatch(geProductCategories())
        return () => { }
    }, [])

    const handleEditModal = (type, id) => {
        getProductsById(id).then(res => {
            if (res.success) {
                console.log(`getProductsById`, res.data)
                setProduct(res.data)
                if (type === 'price') {
                    setVisiblePrice(!visiblePrice)
                } else {
                    setVisibleStock(!visibleStock)
                }

            } else {
                message.error(res.message)
            }
        }).catch(err => {
            message.error('service ไม่พร้อมใช้งานขณะนี้')
            console.error(err)
        })
    }

    const filterData = [
        { value: 'name', text: 'ชื่อสินค้า' },
        { value: 'code', text: 'รหัสสินค้า' },
        { value: 'sku', text: 'รหัส sku' },
        { value: 'sell_price', text: 'ราคา' },
        { value: 'qty', text: 'จำนวน stock' },
    ]

    const handleDeleteSelected = (list) => {
        console.log(`list`, list)
    }


    const handleDelete = (id) => {
        return MySwal.fire({
            text: "ยืนยันลบสินค้า?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'ใช่, ลบเลย',
            cancelButtonText: 'ยกเลิก',
        }).then((result) => {
            if (result.isConfirmed) {
                const loading = message.loading('กำลังลบสินค้า...', 0)
                deleteProduct(id).then(res => {
                    setTimeout(loading, 0)
                    if (res.success) {
                        fetchProducts()
                        message.success('ลบสินค้าสำเร็จ')
                    } else {
                        message.error('ลบสินค้าไม่สำเร็จ')
                    }
                }).catch(err => {
                    setTimeout(loading, 0)
                    message.error('SERVER ERROR')
                })
            }
        })
    }
    useEffect(() => {
        // console.log(`filterParam`, filterParam)
        fetchProducts()
    }, [filterParam])

    const onCategoryFilter = (param = '') => {
        setFilterParam({
            category_id: param,
            offset: 0,
            limit: 100,
            status: filterParam.status,
            type: filterParam.type,
            keyword: filterParam.keyword
        })
    }
    useEffect(() => {
        let status = ''
        if (value === 1) {
            status = 1
        } else if (value === 2) {
            status = 0
        } else {
            status = ''
        }
        setFilterParam({
            category_id: filterParam.category_id,
            offset: 0,
            limit: 100,
            status: status,
            type: filterParam.type,
            keyword: filterParam.keyword
        })
    }, [value])

    useEffect(() => {
        setFilterParam({
            category_id: filterParam.category_id,
            offset: 0,
            limit: 100,
            status: filterParam.status,
            type: filterParam.type,
            keyword: filterValue
        })
    }, [filterValue])
    useEffect(() => {
        setFilterParam({
            category_id: filterParam.category_id,
            offset: 0,
            limit: 100,
            status: filterParam.status,
            type: filterTitle.value,
            keyword: filterParam.keyword
        })
    }, [filterTitle])

    const resetFilter = () => {
        setValue(0)
        setFilterValue('')
        setFilterTitle({ value: 'name', text: 'ชื่อสินค้า' })
        setFilterParam({
            category_id: '',
            offset: 0,
            limit: 100,
            status: '',
            type: 'name',
            keyword: ''
        })
    }

    useEffect(() => {
        let filterData = []
        if (product && product.product_options.length > 0) {
            if (modalSearchKeyword.length) {
                filterData = product.product_options.filter(item => {
                    const includes =
                        item.name.toLowerCase().includes(modalSearchKeyword.toLowerCase()) ||
                        item.value.toLowerCase().includes(modalSearchKeyword.toLowerCase())
                    if (includes) {
                        return includes
                    } else return null
                })
            }
            if (modalSearchPrice.length) {

            }
            console.log(`filterData`, filterData)
            // setFilterOptions(filterData)
        }

    }, [modalSearchKeyword, modalSearchPrice, product])

    // const onFilterOption = () => {
    //     if (product && product.product_options.length > 0) {
    //         const clone = product
    //         if (modalSearchKeyword.length) {
    //             clone.product_options = filterOptions
    //             setProduct(clone)
    //         } else {
    //             setProduct(clone)
    //         }
    //         console.log(`clone`, clone)
    //     }

    // }

    const onChangeOption = (e, type, index) => {
        const clone = product
        e.preventDefault()
        if (index !== null) {
            clone.product_options[index][type] = parseFloat(e.target.value)
            clone.product_options.splice(index, 1, clone.product_options[index])

        } else {
            clone[type] = parseFloat(e.target.value)
        }
        // console.log(`onChangeOption`, clone)
        setUpdateOption(clone)
    }
    const onChangeStock = (e, index) => {
        const clone = product
        e.preventDefault()
        if (index !== null) {
            clone.product_options[index]['qty'] = parseFloat(e.target.value)
            clone.product_options.splice(index, 1, clone.product_options[index])

        } else {
            clone['qty'] = parseFloat(e.target.value)
        }
        // console.log(`onChangeStock`, clone)
        setUpdateOption(clone)
    }

    const onUpdateOption = () => {
        let data = null
        if (updateOption) {
            data = updateOption
        } else {
            message.warning('ไม่มีการเปลี่ยนแปลงข้อมูล')
            return
        }
        const loading = message.loading('กำลังอัพเดตข้อมูล...', 6000)
        console.log(`onUpdateOption`, JSON.stringify(data))
        updateProduct(data).then(res => {
            setTimeout(loading, 0)
            if (res.success) {
                message.success('อัพเดตสำเร็จ')
                fetchProducts()
            } else {
                message.error(`อัพเดตไม่สำเร็จ. ${res.message}`)
            }
        }).catch(err => {
            setTimeout(loading, 0)
            message.error(`service ไม่พร้อมใช้งานขณะนี้.`)
        })
    }

    return (
        <div>
            <div className='d-flex justify-content-between'>
                <span className="h4">จัดการสินค้า</span>
                <Link href={`/product/creation`}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                    >
                        สินค้าใหม่
                    </Button>
                </Link>

            </div>
            <Tabs
                value={value}
                onChange={handleChangeTab}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
            >
                <Tab label="ทั้งหมด" {...a11yProps(0)} />
                <Tab label="ใช้งานอยู่" {...a11yProps(1)} />
                <Tab label="ไม่ได้ใช้งาน" {...a11yProps(2)} />
                <Tab label="ลบออกแล้ว" {...a11yProps(3)} />
            </Tabs>
            <Card className='my-3'>
                <CardContent>
                    <div className='mb-3 default-flex-between'>
                        <span>
                            <FilterListIcon className='me-2' />
                            ตัวกรองสินค้า
                        </span>
                        <Button onClick={resetFilter} variant="outlined" size="small" color="primary">
                            รีเซ็ต
                        </Button>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-2 mb-md-0">
                            <div className="input-group">
                                <button className="btn btn-outline-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{filterTitle.text}</button>
                                <ul className="dropdown-menu">
                                    {filterData.map(data => (
                                        <li key={data.value} onClick={() => setFilterTitle(data)}>
                                            <a className="dropdown-item" href="#">{data.text}</a>
                                        </li>
                                    ))}
                                </ul>
                                <input className="form-control"
                                    placeholder='คำค้นหา'
                                    type="search"
                                    value={filterValue}
                                    onChange={e => setFilterValue(e.target.value)}
                                    id="example-search-input" />
                                {/* <button className="btn btn-outline-primary" type="button" id="button-addon2">
                                    <SearchIcon />
                                </button> */}
                            </div>
                        </div>

                        <div className="col-md-6 mb-2 mb-md-0">
                            <Select
                                className='react-select'
                                classNamePrefix='select'
                                defaultValue={{ value: 'all', label: 'หมวดหมู่ทั้งหมด' }}
                                isClearable={false}
                                isSearchable
                                name="catsFilter"
                                options={
                                    [{ value: 'all', label: 'หมวดหมู่ทั้งหมด' },
                                    ...categories.map(cat => ({ value: cat.id, label: cat.name }))
                                    ]
                                }
                                onChange={(value) => {
                                    if (value.value !== 'all') {
                                        onCategoryFilter(value.value)
                                    } else {
                                        onCategoryFilter('')
                                    }

                                }}
                            />
                        </div>
                        {/* <div className="col-md-4">
                            <Select
                                className='react-select'
                                classNamePrefix='select'
                                defaultValue={{ value: 1, label: 'ราคาถูกสุด -> ราคาแพงสุด' }}
                                isClearable={false}
                                isSearchable={false}
                                name="sortBy"
                                options={[
                                    { value: 1, label: 'ราคาถูกสุด -> ราคาแพงสุด' },
                                    { value: 2, label: 'ราคาแพงสุด -> ราคาถูกสุด' }
                                ]}
                                onChange={(value) => {
                                    console.log(`sortBy`, value)
                                }}
                            />
                        </div> */}
                    </div>
                </CardContent>
            </Card>
            {/* <Card>
                <CardContent> */}
            <CustomTable
                headCells={[
                    { id: 'name', numeric: false, disablePadding: true, label: 'ข้อมูลสินค้า' },
                    { id: 'sell_price', numeric: true, disablePadding: false, label: 'ราคา' },
                    { id: 'qty', numeric: true, disablePadding: false, label: 'จำนวน' },
                    { id: 'rating', numeric: false, disablePadding: false, label: 'คะแนนสินค้า' },
                    { id: 'manage', numeric: false, disablePadding: false, label: '' },
                ]}
                rows={products.length > 0 ? products.map(pd => {
                    pd.manage = ''
                    return pd
                }) : []}
                listData={listData}
                notFound={notFound}
                handleDelete={handleDelete}
                fetchProducts={fetchProducts}
                handleEditModal={handleEditModal}
                handleDeleteSelected={handleDeleteSelected}
            />
            {/* </CardContent>
            </Card> */}
            <Modal
                className='stock-modal'
                centered
                title="แก้ไขราคา"
                style={{ top: 20 }}
                visible={visiblePrice}
                onOk={onUpdateOption}
                onCancel={() => setVisiblePrice(!visiblePrice)}
                okText='ยืนยัน'
                cancelText='ยกเลิก'
            >
                {/* <div className="modal-serch col-gap-5 d-flex mb-3">
                    <div className="input-group">
                        <input
                            placeholder='ค้นหา...'
                            type="text"
                            onChange={e => setModalSearchKeyword(e.target.value)}
                            className="form-control"
                            aria-label="Amount (to the nearest dollar)" />
                        <button type="button" className="btn btn-primary" onClick={() => onFilterOption()}>
                            <SearchIcon />
                        </button>
                    </div>
                    <div className="input-group">
                            <span className="input-group-text" id="basic-addon1">฿</span>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="ราคาสินค้า"
                                onChange={e => setModalSearchPrice(e.target.value)}
                                aria-label="option-price"
                                aria-describedby="basic-addon1" />
                        </div>
                </div> */}
                <div className="table-responsive">
                    <table className="table table-bordered" style={{ minWidth: '500px' }}>
                        <thead className="table-light">
                            <tr>
                                <td>ข้อมูลสินค้า</td>
                                <td>ราคาขาย</td>
                                <td>ต้นทุน</td>
                                <td>ส่วนลด</td>
                            </tr>
                        </thead>
                        <tbody>
                            {product ? <>
                                {product.product_options.length > 0 ?
                                    product.product_options.map((pd, i) => (
                                        <tr key={pd.id}>
                                            <td>
                                                {`${pd.name} - ${pd.value}`}
                                            </td>
                                            <td style={{ width: '20%' }}>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder=""
                                                    aria-label="option-price"
                                                    defaultValue={pd.sell_price}
                                                    onChange={e => onChangeOption(e, 'sell_price', i)}
                                                    aria-describedby="basic-addon1" />
                                            </td>
                                            <td style={{ width: '20%' }}>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder=""
                                                    aria-label="option-price"
                                                    defaultValue={pd.cost_price}
                                                    onChange={e => onChangeOption(e, 'cost_price', i)}
                                                    aria-describedby="basic-addon1" />
                                            </td>
                                            <td style={{ width: '20%' }}>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder=""
                                                    aria-label="option-price"
                                                    defaultValue={pd.discount_price}
                                                    onChange={e => onChangeOption(e, 'discount_price', i)}
                                                    aria-describedby="basic-addon1" />
                                            </td>
                                        </tr>
                                    ))
                                    : <tr>
                                        <td>
                                            {product.name}
                                        </td>
                                        <td style={{ width: '20%' }}>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder=""
                                                aria-label="option-price"
                                                defaultValue={product.sell_price}
                                                onChange={e => onChangeOption(e, 'sell_price', null)}
                                                aria-describedby="basic-addon1" />
                                        </td>
                                        <td style={{ width: '20%' }}>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder=""
                                                aria-label="option-price"
                                                defaultValue={product.cost_price}
                                                onChange={e => onChangeOption(e, 'cost_price', null)}
                                                aria-describedby="basic-addon1" />
                                        </td>
                                        <td style={{ width: '20%' }}>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder=""
                                                aria-label="option-price"
                                                defaultValue={product.discount_price}
                                                onChange={e => onChangeOption(e, 'discount_price', null)}
                                                aria-describedby="basic-addon1" />
                                        </td>
                                    </tr>}
                            </> : null}


                        </tbody>
                    </table>
                </div>

                {/* {product ? <div>
                    {product.product_options.length > 0 ?
                        product.product_options.map(pd => (
                            <div key={pd.id}>
                                sku : {`${product.sku}${pd.id}`}
                            </div>
                        ))
                        : <>
                            {product.sku}
                        </>}
                </div> : null} */}

            </Modal>
            <Modal
                className='stock-modal'
                centered
                title="แก้ไขสต็อก"
                style={{ top: 20 }}
                visible={visibleStock}
                onOk={onUpdateOption}
                onCancel={() => setVisibleStock(!visibleStock)}
                okText='ยืนยัน'
                cancelText='ยกเลิก'
            >
                <div className="table-responsive">
                    <table className="table table-bordered" style={{ minWidth: '500px' }}>
                        <thead className="table-light">
                            <tr>
                                <td>ข้อมูลสินค้า</td>
                                <td>คลังสินค้า</td>
                                {/* <td>จำนวน</td> */}
                            </tr>
                        </thead>
                        <tbody>
                            {product ? <>
                                {product.product_options.length > 0 ?
                                    product.product_options.map((pd, i) => (
                                        <tr key={pd.id}>
                                            <td>
                                                {`${pd.name} - ${pd.value}`}
                                            </td>
                                            {/* <td style={{ width: '25%' }}>
                                                {pd.qty}
                                            </td> */}
                                            <td style={{ width: '25%' }}>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder=""
                                                    aria-label="option-price"
                                                    defaultValue={pd.qty}
                                                    onChange={e => onChangeStock(e, i)}
                                                    aria-describedby="basic-addon1" />
                                            </td>
                                        </tr>
                                    ))
                                    : <tr>
                                        <td>
                                            {product.name}
                                        </td>
                                        {/* <td style={{ width: '25%' }}>
                                            { product.qty }
                                            <input
                                                disabled
                                                type="number"
                                                className="form-control"
                                                placeholder=""
                                                aria-label="option-price"
                                                value={product.qty}
                                                aria-describedby="basic-addon1" />
                                        </td> */}
                                        <td style={{ width: '25%' }}>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder=""
                                                aria-label="option-price"
                                                defaultValue={product.qty}
                                                onChange={e => onChangeStock(e, null)}
                                                aria-describedby="basic-addon1" />
                                        </td>
                                    </tr>}
                            </> : null}


                        </tbody>
                    </table>
                </div>
            </Modal>
        </div>
    )
}

export default ProductPage
