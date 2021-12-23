import { useEffect, useState, Fragment } from 'react'
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux'
import { Login, Logout } from '../store/actions/authAction'
import {
    Card, CardContent, CardAction, TextField, FormControl,
    InputLabel, Input, InputAdornment, IconButton, Button
} from '@material-ui/core'
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import Image from 'next/image'
import shopping from '../assets/images/undraw_Successful_purchase_re_mpig.png'
import 'animate.css';
import Link from 'next/link'
import { useForm, Controller } from "react-hook-form";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { APIshopLogin } from '../services/api'
import { message } from 'antd'
const MySwal = withReactContent(Swal)

function LoginPage() {
    const dispatch = useDispatch()
    const [main, setMain] = useState(1)
    const [showPassword, setShowPassword] = useState(false)
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    }
    const { register, control, handleSubmit, formState: { errors }, setError } = useForm()
    const onSubmit = (data) => {
        const loading = message.loading('รอสักครู่...')
        APIshopLogin(data).then(res => {
            setTimeout(loading, 0)
            if (res && !res.status) {
                message.error(res.message)
            } else {
                message.success('กำลังเข้าสู่เว็บไซต์...')
            }
        }).catch(err => {
            setTimeout(loading, 0)
            message.error('เกิดความผิดพลาดของ Service')
        })
    }
    return (
        <div className="blank-layout login-page">
            <div className="row m-0 login-section">
                <div className="col-md-6 d-none d-md-flex section-one flex-column">
                    <div className='welcome'>Welcome.</div>
                    <div className='title'>Login</div>
                </div>
                <div className="col-md-6 section-two justify-content-center">
                    <div className="welcome d-flex d-md-none">FiinShop welcome.</div>
                    <div className="title d-flex d-md-none">Login to your account</div>
                    {main === 1 ?
                        <Fragment>
                            <div className="h4 d-none d-md-flex">เข้าสู่ระบบ</div>
                            <form className='w-100' onSubmit={handleSubmit(onSubmit)}>
                                <Controller
                                    name="username"
                                    control={control}
                                    defaultValue=""
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <TextField
                                            type='username'
                                            className="d-flex"
                                            label="Username"
                                            id="standard-basic"
                                            value={value}
                                            onChange={onChange}
                                            error={!!error}
                                        // helperText={error ? error.message : null}
                                        />
                                    )}
                                    rules={{ required: true }}
                                />
                                <Controller
                                    name="password"
                                    control={control}
                                    defaultValue=""
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <FormControl className='d-block'>
                                            <InputLabel htmlFor="password-input">Password</InputLabel>
                                            <Input
                                                fullWidth
                                                size="small"
                                                label="รหัสผ่าน"
                                                id="password-input"
                                                type={showPassword ? 'text' : 'password'}
                                                value={value}
                                                onChange={onChange}
                                                error={!!error}
                                                // helperText={error ? error.message : null}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            onMouseDown={handleMouseDownPassword}
                                                        >
                                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                        </FormControl>
                                    )}
                                    rules={{ required: true }}
                                />
                                <Button className="w-100 my-2" type='submit' variant="contained" color="primary">
                                    เข้าสู่ระบบ
                                </Button>
                            </form>
                            <div className='w-100 d-flex justify-content-between'>
                                <span className='link' onClick={() => setMain(2)}>รีเซ็ตรหัสผ่าน</span>
                                <Link href="/register">
                                    <a>ลงทะเบียน</a>
                                </Link>
                            </div>
                        </Fragment>
                        :
                        <Fragment>
                            <div className="h4 mb-3">รีเซ็ตรหัสผ่าน</div>
                            <div className="h6 align-self-start">เราจะส่งข้อความรหัสไปยัง email ของคุณ</div>
                            <Input id='email-reset' placeholder='email ของคุณ' className='mb-3 w-100' />
                            <div className="d-flex w-100 justify-content-between">
                                <Button variant="contained" color="primary" className="mb-2">
                                    ยืนยัน
                                </Button>
                                <Button variant="outlined" onClick={() => setMain(1)}>กลับ</Button>
                            </div>
                        </Fragment>
                    }
                </div>
            </div>
            {/* login page
            <button onClick={() => dispatch(Login())}>Login</button>
            <button onClick={() => dispatch(Logout())}>Logout</button> */}
        </div>
    )
}

export default LoginPage

