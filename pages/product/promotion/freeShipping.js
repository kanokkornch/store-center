import { useState, useEffect, useRef, Fragment } from 'react'
import { Card, CardContent, Tabs, Tab, Button } from '@material-ui/core'
import { Spin } from 'antd'
import Link from 'next/link'
import AddIcon from '@material-ui/icons/Add'
import BeenhereIcon from '@material-ui/icons/Beenhere'
import { getAllVoucher } from '../../../services/promotion'
import Select from 'react-select'
import VoucherTable from '../../../components/VoucherTable'
import moment from 'moment'

function FreeShipping() {
    const [vouchers, setVouchers] = useState(null)
    const [statusFilter, setStatusFilter] = useState({ value: 'all', label: 'สถานะทั้งหมด' })
    const [keyword, setKeyword] = useState('')
    const [filter, setFilter] = useState({ keyword: '', status: '' })
    const [notFound, setNotFound] = useState(false)
    const fetchVouchers = async () => {
        const res = await getAllVoucher()
        const list = res.data.filter(v => v.type === 2)
        setVouchers(list)
        if (list && list.length < 1) {
            setNotFound(true)
        }
    }

    useEffect(() => {
        fetchVouchers()
    }, [])
    const voucherStatus = (start, end) => {
        const currentDateTime = moment().format('YYYY-MM-DD HH:mm::ss')
        let status = '-'
        if (currentDateTime < start) { status = 'ยังไม่เริ่ม' }
        if (currentDateTime > end) { status = 'หมดอายุการใช้งาน' }
        if (currentDateTime > start && currentDateTime < end) {
            status = 'ต่อเนื่อง'
        }
        return status
    }

    return (
        <div>
            <Card className='my-3'>
                <CardContent>
                    <div className="h4 text-center mb-3 fw-bold">ส่วนลดค่าจัดส่งร้านค้า</div>
                    <div className='text-center'>ส่วนลดค่าจัดส่ง คือ เครื่องมือที่ช่วยเพิ่มอัตราการซื้อต่อยอดเข้าชมที่ร้านค้า</div>
                    <div className="text-center mt-3">
                        <Link href={`/product/promotion/freeShipping/create`}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                            >
                                สร้างตอนนี้
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
            {/* <Card>
                <CardContent> */}
                    {/* <div className="row mb-3">
                        <div className="col-xl-6">
                            <div className="row">
                                <div className="col-sm-6">
                                    <Select
                                        className='react-select'
                                        classNamePrefix='select'
                                        defaultValue={{ value: 'all', label: 'สถานะทั้งหมด' }}
                                        isClearable={false}
                                        isSearchable={false}
                                        name="catsFilter"
                                        options={[
                                            { value: 'all', label: 'สถานะทั้งหมด' },
                                            { value: '1', label: 'ยังไม่เริ่ม' },
                                            { value: '2', label: 'ต่อเนื่อง' },
                                            { value: '3', label: 'ระงับการใช้งาน' },
                                            { value: '4', label: 'หมดอายุการใช้งาน' },
                                        ]}
                                        onChange={(value) => {
                                            if (value.value !== 'all') {
                                                setStatusFilter(value.value)
                                            } else {
                                                setStatusFilter('')
                                            }

                                        }}
                                    />
                                </div>
                                <div className="col-sm-6 mt-2 mt-sm-0">
                                    <input className="form-control"
                                        placeholder='ชื่อคูปอง'
                                        type="search"
                                        value={keyword}
                                        onChange={e => setKeyword(e.target.value)}
                                        id="example-search-input" />
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <VoucherTable
                        headCells={[
                            { id: 'name', numeric: false, disablePadding: false, label: 'ชื่อคูปอง' },
                            { id: 'dateTime', numeric: false, disablePadding: false, label: 'เวลาเริ่มเก็บ~เวลาใช้งาน' },
                            { id: 'count', numeric: false, disablePadding: false, label: 'คูปองที่ถูกเก็บไป' },
                            { id: 'detail', numeric: false, disablePadding: false, label: 'รายละเอียดส่วนลด' },
                            { id: 'status', numeric: false, disablePadding: false, label: 'สถานะ' },
                            { id: 'action', numeric: false, disablePadding: false, label: 'จัดการ' },
                        ]}
                        rows={vouchers ? vouchers : []}
                        notFound={notFound}
                        voucherStatus={voucherStatus}
                    />
                {/* </CardContent>
            </Card> */}
        </div>
    )
}

export default FreeShipping
