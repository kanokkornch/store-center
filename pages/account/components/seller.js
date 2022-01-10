import { useState, useEffect, useRef, Fragment } from 'react'
import { useForm, Controller, useFieldArray } from "react-hook-form"
import Select from "react-select"
import { Upload, message } from 'antd'
import { Button } from '@material-ui/core'
import { shopVerification } from '../../../services/verification'
import { uploadImage } from '../../../services/utills'
import Link from 'next/link'

function AccountSellerPage(props) {
    const { shop } = props
    const [fileList, setFileList] = useState([])
    const [bookFile, setbookFile] = useState(null)
    return (
        <div>
            <div className="h4">Seller Account</div>
            <div className="row">
                <div className="col-md-6">
                    <div className="my-3">
                        <label htmlFor="name" className="form-label fw-500">
                            รหัสร้านค้า
                        </label>
                        <p>{`CS${shop.id}`}</p>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label fw-500">
                            ชื่อ - นามสกุล
                        </label>
                        <p>{shop.name}</p>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label fw-500">
                            อีเมล์ติดต่อ
                        </label>
                        <p>{shop.email}</p>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label fw-500">
                            หมายเลขโทรศัพท์
                        </label>
                        <p>{shop.phone}</p>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label fw-500">
                            ชื่อที่ปรากฏให้เห็น/ชื่อร้านค้า
                        </label>
                        <p>{shop.name}
                            <span className='me-3' />
                            <Link href="/shop/infoSetting">
                                <a>คลิกที่นี่เพื่อแก้ไขชื่อร้านค้า</a>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountSellerPage
