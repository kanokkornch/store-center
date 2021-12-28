import { useState, useEffect, useRef, Fragment } from 'react'
import {
    Avatar,
    Card, CardContent
} from '@material-ui/core'
import { DatePicker, Radio, Upload, Button as AntButton } from 'antd'
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import LocalAtmRoundedIcon from '@material-ui/icons/LocalAtmRounded';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link'

const { RangePicker } = DatePicker;

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    large: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
  }));
function createDiscount() {
    const [value, setValueRadio] = useState('all')
    const [discountBath, setDiscountBath] = useState(0)
    const [activeButton, setActiveButton] = useState(1)
    const classes = useStyles();
    const { register, control, handleSubmit, formState: { errors }, setValue, getValues, reset, watch } = useForm({
        defaultValues: {
           
        }
    })
    const onSubmit = () => {

    }

    return (
        <div>
            <div className="h4">คูปองส่วนลดร้านค้า</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row flex-row">
                    <div className='row'>
                        <div className='col-9'>
                            <Card className='mb-3'>
                                <CardContent >
                                    <div className='mb-3' style={{width:'31%'}}>
                                        <p>ชื่อโปรโมชั่น</p>
                                        <input
                                            type="text"
                                            {...register('name', { required: true, })}
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            id="name"
                                            placeholder="คูปองส่วนลดร้านค้า" />
                                    </div>
                                    <div className='mb-3'>
                                        <p>ระยะเวลาที่สามารถเก็บ/ใช้งานคูปองได้</p>
                                        <Controller
                                            name="current"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => 
                                                <RangePicker showTime />
                                            }
                                        />
                                    </div>
                                    <div className='mb-3'>
                                        <p>ระยะเวลาเริ่มเก็บ</p>
                                        <Controller
                                            name="start"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => 
                                                <DatePicker showTime  />
                                            }
                                        />
                                    </div>
                                    <div className='mb-3'>
                                        <p>คูปองถูกนำมาใช้กับ</p>
                                        <Controller
                                            name="usage"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => 
                                            <Radio.Group onChange={e=>{setValueRadio(e.target.value)}} value={value}>
                                                <Radio value='all'>ทั้งร้าน</Radio>
                                                <Radio value='some'>เฉพาะสินค้า (กรุณาระบุหลังกดยืนยัน)</Radio>
                                            </Radio.Group>
                                            }
                                        />
                                    </div>
                                    
                                </CardContent>
                            </Card>
                            <Card className='mb-3'>
                                <CardContent >
                                    <h5>การตั้งค่าส่วนลด</h5>
                                    <div className='row'>
                                        <div className='col-3' onClick={e=> setActiveButton(1)}>
                                            <div className='border p-2' style={{borderRadius:'5px',height:'118px' }}>
                                                ส่วนลดแบบจำนวนเงิน
                                                <div style={{display:'flex', flexWrap:'wrap', borderColor:'red'}}>
                                                    <div className='border d-flex align-items-center justify-content-center' style={{borderRadius:'8px',height:'70px', width:'80px', backgroundColor:activeButton === 1 ?'#FEF1F3' : 'white'}}>
                                                        <div>
                                                            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" className={classes.small} />
                                                            <p>Shop name</p>
                                                        </div>
                                                    </div>
                                                    <div className='border p-2' style={{borderRadius:'8px',height:'70px', width:'170px', backgroundColor:activeButton === 1 ?'#FEF1F3' : 'white'}}>
                                                        <span>{discountBath} THB</span><br/>
                                                        <span>Min spend {} THB</span><br/>
                                                        <span>start - end</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-3' onClick={e=> setActiveButton(2)}>
                                             <div className='border p-2' style={{borderRadius:'5px',height:'118px'}}>
                                                ส่วนลดแบบเปอร์เซ็น
                                                <div style={{display:'flex', flexWrap:'wrap'}}>
                                                    <div className='border d-flex align-items-center justify-content-center' style={{borderRadius:'10px',height:'70px', width:'80px', backgroundColor:activeButton === 2 ?'#FEF1F3' : 'white'}}>
                                                        <div>
                                                            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" className={classes.small} />
                                                            <p>Shop name</p>
                                                        </div>
                                                    </div>
                                                    <div className='border p-2' style={{borderRadius:'8px',height:'70px', width:'170px', backgroundColor:activeButton === 2 ?'#FEF1F3' : 'white'}}>
                                                        <span>{discountBath} %off</span><br/>
                                                        <span>Min spend {} THB</span><br/>
                                                        <span>start - end</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mt-5'>
                                        {activeButton === 1 ? 
                                        
                                        <div>
                                            <div className='row'>
                                                <div className="col-3">
                                                    <label htmlFor="cost_price" className="form-label">
                                                        เมื่อมูลค่าคำสั่งซื้อถึง (THB)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        {...register('discount_bath', { required: true, })}
                                                        className={`form-control text-end ${errors.discount_bath ? 'is-invalid' : ''}`}
                                                        id="discount_bath"
                                                        placeholder="" />
                                                </div>
                                                <div className="col-3">
                                                    <label htmlFor="cost_price" className="form-label">
                                                        ส่วนลดจะเป็น (THB)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        {...register('cost_price', { required: true, })}
                                                        className={`form-control text-end ${errors.cost_price ? 'is-invalid' : ''}`}
                                                        id="cost_price"
                                                        placeholder="" />
                                                </div>
                                            </div>
                                            <div className='row mt-4'>
                                                <div className="col-3">
                                                    <label htmlFor="cost_price" className="form-label">
                                                        จำนวนคูปองที่จะสร้างทั้งหมด
                                                    </label>
                                                    <input
                                                        type="number"
                                                        {...register('cost_price', { required: true, })}
                                                        className={`form-control text-end ${errors.cost_price ? 'is-invalid' : ''}`}
                                                        id="cost_price"
                                                        placeholder="" />
                                                </div>
                                                <div className="col-3">
                                                    <label htmlFor="cost_price" className="form-label">
                                                        ส่วนลดจะเป็น
                                                    </label>
                                                    <input
                                                        type="number"
                                                        {...register('cost_price', { required: true, })}
                                                        className={`form-control text-end ${errors.cost_price ? 'is-invalid' : ''}`}
                                                        id="cost_price"
                                                        placeholder="" />
                                                </div>
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <div className='row'>
                                                <div className="col-3">
                                                    <label htmlFor="cost_price" className="form-label">
                                                        เมื่อมูลค่าคำสั่งซื้อถึง (THB)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        {...register('discount_bath', { required: true, })}
                                                        className={`form-control text-end ${errors.discount_bath ? 'is-invalid' : ''}`}
                                                        id="discount_bath"
                                                        placeholder="" />
                                                </div>
                                                <div className="col-3">
                                                    <label htmlFor="cost_price" className="form-label">
                                                        ส่วนลดจะเป็น (THB)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        {...register('cost_price', { required: true, })}
                                                        className={`form-control text-end ${errors.cost_price ? 'is-invalid' : ''}`}
                                                        id="cost_price"
                                                        placeholder="" />
                                                   
                                                </div>
                                            </div>
                                            <div className='row mt-4'>
                                                <div className="col-3">
                                                    <label htmlFor="cost_price" className="form-label">
                                                        ส่วนลดสูงสุดต่อการสั่งซื้อ
                                                    </label>
                                                    <input
                                                        type="number"
                                                        {...register('cost_price', { required: true, })}
                                                        className={`form-control text-end ${errors.cost_price ? 'is-invalid' : ''}`}
                                                        id="cost_price"
                                                        placeholder="" />
                                                </div>
                                                
                                            </div>

                                            <div className='row mt-4'>
                                                <div className="col-3">
                                                    <label htmlFor="cost_price" className="form-label">
                                                        จำนวนคูปองที่จะสร้างทั้งหมด
                                                    </label>
                                                    <input
                                                        type="number"
                                                        {...register('cost_price', { required: true, })}
                                                        className={`form-control text-end ${errors.cost_price ? 'is-invalid' : ''}`}
                                                        id="cost_price"
                                                        placeholder="" />
                                                </div>
                                                <div className="col-3">
                                                    <label htmlFor="cost_price" className="form-label">
                                                        จำกัด การใช้คูปองต่อลูกค้าหนึ่งคน
                                                    </label>
                                                    <input
                                                        type="number"
                                                        {...register('cost_price', { required: true, })}
                                                        className={`form-control text-end ${errors.cost_price ? 'is-invalid' : ''}`}
                                                        id="cost_price"
                                                        placeholder="" />
                                                </div>
                                            </div>
                                        </div>
                                    }
                                        
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent>
                                    <div className='d-flex justify-content-end'>
                                        <div className='btn btn-outline-secondary'>ยกเลิก</div>
                                        <div className='btn btn-primary'>ยืนยัน</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className='col-3'>
                            <Card>
                                <CardContent>
                                    <p>Tips for คูปองส่วนลดร้านค้า</p>
                                </CardContent>
                            </Card>
                            
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default createDiscount
