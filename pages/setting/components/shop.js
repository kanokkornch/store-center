import { useState, useEffect, useRef, Fragment } from 'react'
import { Tabs, Radio, Button } from 'antd'
import StoreIcon from '@material-ui/icons/Store'
import CreditCardIcon from '@material-ui/icons/CreditCard'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'
import { CardContent, Card } from '@material-ui/core'

import { useForm, Controller, useFieldArray } from "react-hook-form"

function ShopSettingPage() {
    const { register, control, handleSubmit, formState: { errors }, setValue, getValues, reset } = useForm({})
    const onSubmitForm = (data) => {
        console.log(`form`, data)
    }
    return (
        <div>
            <div className="h4">ยืนยันตัวตน</div>
            <form onSubmit={handleSubmit(onSubmitForm)}>
                {/* <div className="row">
                    <div className="col-md-6">
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
                    </div>
                </div> */}
            </form>
        </div>
    )
}

export default ShopSettingPage
