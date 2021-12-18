import { useState, useEffect, useRef, Fragment } from 'react'
import {
    Card, CardContent, CardAction, Fade, Paper, Button,
    AppBar, Tabs, Tab, Typography, Box, Badge,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TablePagination, TableRow, TableSortLabel, Checkbox,
    Snackbar
} from '@material-ui/core'
import { notification, message, Modal } from 'antd'
import { useForm, Controller, useFieldArray } from "react-hook-form";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add'
import { getProducts, deleteProduct, getProductsById } from '../services/product'
import { geProductCategories } from '../store/actions/productAction'
import { useDispatch, useSelector } from 'react-redux'
import Select from "react-select"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import CustomTable from '../components/bootstrap5/table'
import FilterListIcon from '@material-ui/icons/FilterList';
function product() {
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
    const [product, setProduct] = useState(null)
    const [filterParam, setFilterParam] = useState({
        category_id: '',
        offset: 0,
        limit: 100,
        status: '',
        type: 'name',
        keyword: ''
    })
    const searchInputModal = useRef("")
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
        fetchProducts()
        dispatch(geProductCategories())
        return () => { }
    }, [])

    const handleEditStock = (id) => {
        getProductsById(id).then(res => {
            if (res.success) {
                console.log(`getProductsById`, res.data)
                setProduct(res.data)
                setVisibleStock(!visibleStock)
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



    return (
        <div>
            <div className="h4">จัดการสินค้า</div>
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
                setVisibleStock={setVisibleStock}
                visibleStock={visibleStock}
                handleEditStock={handleEditStock}
            />
            {/* </CardContent>
            </Card> */}
            <Modal
                className='stock-modal'
                centered
                title="แก้ไขราคา"
                style={{ top: 20 }}
                visible={visibleStock}
                onOk={() => { console.log(`obsearchInputModalject`, searchInputModal.current.value) }}
                onCancel={() => setVisibleStock(!visibleStock)}
                okText='ยืนยัน'
                cancelText='ยกเลิก'
            >
                <div className="modal-serch col-gap-5 d-flex mb-3">
                    <div className="input-group">
                        <input
                            placeholder='ค้นหา...'
                            type="text"
                            // ref={searchInputModal}
                            className="form-control"
                            aria-label="Amount (to the nearest dollar)" />
                        <button type="button" className="btn btn-primary">
                            <SearchIcon />
                        </button>
                    </div>
                    <div className="input-group">
                        <span className="input-group-text" id="basic-addon1">฿</span>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="ราคาสินค้า"
                            aria-label="option-price"
                            aria-describedby="basic-addon1" />
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table table-bordered" style={{ minWidth: '500px' }}>
                        <thead class="table-light">
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
                                    product.product_options.map(pd => (
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
                                                    aria-describedby="basic-addon1" />
                                            </td>
                                            <td style={{ width: '20%' }}>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder=""
                                                    aria-label="option-price"
                                                    defaultValue={pd.cost_price}
                                                    aria-describedby="basic-addon1" />
                                            </td>
                                            <td style={{ width: '20%' }}>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder=""
                                                    aria-label="option-price"
                                                    defaultValue={pd.discount_price}
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
                                                aria-describedby="basic-addon1" />
                                        </td>
                                        <td style={{ width: '20%' }}>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder=""
                                                aria-label="option-price"
                                                defaultValue={product.cost_price}
                                                aria-describedby="basic-addon1" />
                                        </td>
                                        <td style={{ width: '20%' }}>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder=""
                                                aria-label="option-price"
                                                defaultValue={product.discount_price}
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
        </div>
    )
}

export default product
