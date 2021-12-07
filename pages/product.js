import { useState, useEffect, useRef, Fragment } from 'react'
import {
    Card, CardContent, CardAction, Fade, Paper, Button,
    AppBar, Tabs, Tab, Typography, Box, Badge,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TablePagination, TableRow, TableSortLabel, Checkbox
} from '@material-ui/core'
import { useForm, Controller, useFieldArray } from "react-hook-form";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add'
// import { uploadImage, saveProduct } from '../../services/api'
// import { geProductCategories, getUnits } from '../../store/actions/productAction'
import { useDispatch, useSelector } from 'react-redux'
import Select from "react-select"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import CustomTable from '../components/bootstrap5/table'
function product() {
    const [value, setValue] = useState(0)
    const [filterValue, setFilterValue] = useState('')
    const [filterTitle, setFilterTitle] = useState({ value: 1, text: 'ชื่อสินค้า' })
    const handleChangeTab = (e, newValue) => {
        setValue(newValue)
        e.preventDefault()
        console.log(`newValue`, newValue)
    }
    function a11yProps(index) {
        return {
            id: `scrollable-auto-tab-${index}`,
            'aria-controls': `scrollable-auto-tabpanel-${index}`,
        };
    }
    useEffect(() => {
        //filter
    }, [filterValue])
    const filterData = [
        { value: 1, text: 'ชื่อสินค้า' },
        { value: 2, text: 'รหัสสินค้า' },
        { value: 3, text: 'รหัส sku' },
        { value: 4, text: 'ราคา' },
        { value: 5, text: 'จำนวน stock' },
    ]
    return (
        <div>
            <div className="h3">จัดการสินค้า</div>
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
                        <span>ตัวกรองสินค้า</span>
                        <Button variant="outlined" size="small" color="primary">
                            รีเซ็ต
                        </Button>
                    </div>
                    <div className="row">
                        <div className="col-md-4 mb-2 mb-md-0">
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
                                    type="search"
                                    value={filterValue}
                                    onChange={e => setFilterValue(e.target.value)}
                                    id="example-search-input" />
                                <button className="btn btn-outline-primary" type="button" id="button-addon2">
                                    <SearchIcon />
                                </button>
                            </div>
                        </div>

                        <div className="col-md-4 mb-2 mb-md-0">
                            <Select
                                className='react-select'
                                classNamePrefix='select'
                                // defaultValue={ }
                                isClearable={false}
                                isSearchable
                                name="catsFilter"
                                options={[{ value: 'tv', label: 'ทีวี' }]}
                                onChange={(value) => {
                                    console.log(`catsFilter`, value)
                                }}
                            />
                        </div>
                        <div className="col-md-4">
                            <Select
                                className='react-select'
                                classNamePrefix='select'
                                defaultValue={{ value: 1, label: 'ราคาถูกสุด' }}
                                isClearable={false}
                                isSearchable={false}
                                name="sortBy"
                                options={[
                                    { value: 1, label: 'ราคาถูกสุด' },
                                    { value: 2, label: 'ราคาแพงสุด' }
                                ]}
                                onChange={(value) => {
                                    console.log(`sortBy`, value)
                                }}
                            />
                        </div>
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
                rows={[
                    { name: 'test1', sell_price: 200, qty: 150, manage: '' },
                    { name: 'test2', sell_price: 250, qty: 100, manage: '' },
                    { name: 'test3', sell_price: 250, qty: 100, manage: '' },
                    { name: 'test4', sell_price: 250, qty: 100, manage: '' },
                    { name: 'test5', sell_price: 250, qty: 100, manage: '' },
                    { name: 'test6', sell_price: 250, qty: 100, manage: '' },
                    { name: 'test7', sell_price: 250, qty: 100, manage: '' },
                    { name: 'test8', sell_price: 250, qty: 100, manage: '' },
                    { name: 'test9', sell_price: 250, qty: 100, manage: '' },
                    { name: 'test10', sell_price: 250, qty: 100, manage: '' },
                    { name: 'test11', sell_price: 250, qty: 100, manage: '' },
                    { name: 'test12', sell_price: 250, qty: 100, manage: '' },
                ]}
            />
            {/* </CardContent>
            </Card> */}
        </div>
    )
}

export default product
