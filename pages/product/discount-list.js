import { useState, useEffect, useRef, Fragment } from 'react'
import {
    Card, CardContent
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import LocalAtmRoundedIcon from '@material-ui/icons/LocalAtmRounded';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { useForm, Controller, useFieldArray } from "react-hook-form";
import Select from "react-select"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Link from 'next/link'

const useStyles = makeStyles({
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 440,
    },
  });
function discount() {
    const classes = useStyles();
    const [filterParam, setFilterParam] = useState({
        offset: 0,
        limit: 100,
        status: 'all',
        type: 'collection',
        keyword: ''
    })

    const { register, control, handleSubmit, formState: { errors }, setValue, getValues, reset, watch } = useForm({
        defaultValues: {
           
        }
    })
    const onSubmit = () => {

    }
    const onFilter = (type, value ='') => {
        if(type === 'status'){
            setFilterParam({
                offset: 0,
                limit: 100,
                status: value,
                type: filterParam.type,
                keyword: filterParam.keyword
            })
        }
        if(type === 'type'){
            setFilterParam({
                offset: 0,
                limit: 100,
                status: filterParam.status,
                type: value,
                keyword: filterParam.keyword
            })
        }
        if(type === 'search'){
            setFilterParam({
                offset: 0,
                limit: 100,
                status: filterParam.status,
                type: filterParam.type,
                keyword: value
            })
        }
    }
    useEffect(() => {
        console.log(`filterParam`, filterParam)
        // fetchProducts()
    }, [filterParam])
    return (
        <div>
            <div className="h4">คูปอง</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row flex-row">
                    <Card className='mb-3'>
                        <CardContent >
                            <div className='row'>
                                <div className='col-2'>
                                </div>
                                <div className='col-8'>
                                    <div style={{textAlign:'center'}}>
                                        <h3>คูปองส่วนลดร้านค้า</h3>
                                        <span>เพิ่มมูลค่าคำสั่งซื้อโดยการมอบคูปองส่วนลดให้กับลูกค้า</span>
                                    </div>
                                    <div className='row mt-5'>
                                        <div className='col-4 mobile-none'>
                                            <div className='border-end'>
                                                <p style={{fontSize:'64px',color:'#FF7441'}} className='d-flex align-items-center'><MonetizationOnIcon fontSize='inherit'/> <label style={{fontSize:'20px',color:'#5a5a5a'}}>เพิ่มอัตราการซื้อ</label></p>
                                            </div>
                                        </div>
                                        <div className='col-4 d-flex justify-content-center mobile-none'>
                                            <div className=''>
                                                <p style={{fontSize:'64px',color:'#FF7441'}} className='d-flex align-items-center'><LocalAtmRoundedIcon fontSize='inherit'/> <label style={{fontSize:'20px',color:'#5a5a5a'}}>เพิ่มการซื้อในร้านค้า</label></p>
                                            </div>
                                        </div>
                                        <div className='col-4 mobile-none' >
                                            <div className='border-start'>
                                                <p style={{fontSize:'64px',color:'#FF7441'}} className='d-flex align-items-center'><AssignmentOutlinedIcon fontSize='inherit'/> <label style={{fontSize:'20px',color:'#5a5a5a'}}>เพิ่มมูลค่าคำสั่งซื้อ</label></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{textAlign:'center'}}>
                                        <Link href='/product/create-discount'>
                                            <p className='btn btn-primary' ><AddOutlinedIcon /> สร้างตอนนี้</p>
                                        </Link>
                                        <p className='text-primary'>48% ของร้านค้าที่รับ</p>
                                    </div>

                                </div>
                                <div className='col-2'>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <h3>รายการคูปอง</h3>
                            <div className='row'>
                                <div className='col-12 col-xs-12 col-md-4'>
                                    <div className='row'>
                                        <div className='col-12 col-xs-12 col-md-4'>
                                            <Select
                                                className='react-select'
                                                classNamePrefix='select'
                                                defaultValue={{ value: 'all', label: 'สถานะทั้งหมด' }}
                                                isClearable={false}
                                                isSearchable
                                                name="catsFilter"
                                                options={[
                                                    {
                                                        value:'all',
                                                        label:'สถานะทั้งหมด'
                                                    },
                                                    {
                                                        value:1,
                                                        label:'ต่อเนื่อง'
                                                    },
                                                    {
                                                        value:2,
                                                        label:'ยังไม่เริ่ม'
                                                    },
                                                    {
                                                        value:3,
                                                        label:'ระงับการใช้งาน'
                                                    },
                                                    {
                                                        value:4,
                                                        label:'หมดอายุ'
                                                    },
                                                ]}
                                                onChange={(value) => {onFilter('status',value.value)}}
                                            />
                                        </div>
                                        <div className='col-12 col-xs-12 col-md-4'>
                                            <Select
                                                className='react-select'
                                                classNamePrefix='select'
                                                defaultValue={{ value: 'collection', label: 'คูปองสะสม' }}
                                                isClearable={false}
                                                isSearchable
                                                name="catsFilter"
                                                options={[
                                                    {
                                                        value:'collection',
                                                        label:'คูปองสะสม'
                                                    },
                                                    {
                                                        value:'discount',
                                                        label:'คูปองส่วนลด'
                                                    }
                                                ]}
                                                onChange={(value) => {onFilter('type',value.value)}}
                                            />
                                        </div>
                                        <div className='col-12 col-xs-12 col-md-4'>
                                        <input className="form-control"
                                            placeholder='คำค้นหา'
                                            type="search"
                                            // value={filterValue}
                                            onChange={e => onFilter('search',e.target.value)}
                                            id="example-search-input" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                                <TableContainer className={classes.container}>
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    ชื่อคูปอง
                                                </TableCell>
                                                <TableCell>
                                                    เวลาเริ่มเก็บ~เวลาใช้งาน
                                                </TableCell>
                                                <TableCell>
                                                    โปรโมชั่นนี้สามารถใช้ได้กับ*
                                                </TableCell>
                                                <TableCell>
                                                    คูปองที่ถูกเก็บไป
                                                </TableCell>
                                                <TableCell>
                                                    ประเภทคูปอง
                                                </TableCell>
                                                <TableCell>
                                                    รายละเอียดส่วนลด
                                                </TableCell>
                                                <TableCell>
                                                    สถานะ
                                                </TableCell>
                                                <TableCell>
                                                    Actions
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableCell >
                                            </TableCell>
                                            <TableCell >
                                            </TableCell>
                                            <TableCell >
                                            </TableCell>
                                            <TableCell >
                                            </TableCell>
                                            <TableCell >
                                            </TableCell>
                                            <TableCell >
                                            </TableCell>
                                            <TableCell >
                                            </TableCell>
                                            <TableCell >
                                            </TableCell>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 100]}
                                    // component="div"
                                    // count={rows.length}
                                    // rowsPerPage={rowsPerPage}
                                    // page={page}
                                    // onPageChange={handleChangePage}
                                    // onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    )
}

export default discount
