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
const MySwal = withReactContent(Swal)

function login() {
    const dispatch = useDispatch()
    const [main, setMain] = useState(1)
    const [showPassword, setShowPassword] = useState(false)
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    }
    const { register, control, handleSubmit, formState: { errors }, setError } = useForm()
    const onSubmit = (data) => {
        console.log(`LOGIN DATA`, data)
        return MySwal.fire({
            title: 'ข้อความจากระบบ',
            text: 'res.message',
            icon: 'warning'
        })
    }
    return (
        <div className="blank-layout">
            <div className="main-container">
                <div className="header-container">
                </div>
                <div className="content-container">
                    <div className="row d-flex align-items-center">
                        <div className="col-md-5 d-none d-md-flex justify-content-center">
                            <Image
                                src={shopping}
                                alt="Picture of the author"
                                className='login-image animate__repeat-3 animate__animated animate__pulse'
                                width={500}
                                height={500}
                            />
                        </div>
                        <div className="col-md-7 d-flex justify-content-center">
                            <Card className='login-form'>
                                <CardContent className='d-flex flex-column'>
                                    {main === 1 ?
                                        <Fragment>
                                            <div className="h4">เข้าสู่ระบบ</div>
                                            <form onSubmit={handleSubmit(onSubmit)}>
                                                <Controller
                                                    name="email"
                                                    control={control}
                                                    defaultValue=""
                                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                        <TextField
                                                            type='email'
                                                            className="d-flex"
                                                            label="Email"
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
                                                    rules={{ required: true, minLength: 8 }}
                                                />
                                                <Button className="w-100 my-2" type='submit' variant="contained" color="primary">
                                                    เข้าสู่ระบบ
                                                </Button>
                                            </form>
                                            <div className='mt-2 d-flex justify-content-between'>
                                                <span className='link' onClick={() => setMain(2)}>รีเซ็ตรหัสผ่าน</span>
                                                <Link href="/register">
                                                    <a>ลงทะเบียน</a>
                                                </Link>
                                            </div>
                                        </Fragment>
                                        :
                                        <Fragment>
                                            <div className="h4 mb-3">รีเซ็ตรหัสผ่าน</div>
                                            <div className="h6">เราจะส่งข้อความรหัสไปยัง email ของคุณ</div>
                                            <Input id='email-reset' placeholder='email ของคุณ' className='mb-3' />
                                            <Button variant="contained" color="primary" className="mb-2">
                                                ยืนยัน
                                            </Button>
                                            <Button variant="outlined" onClick={() => setMain(1)}>กลับ</Button>
                                        </Fragment>
                                    }
                                </CardContent>
                            </Card>
                        </div>

                    </div>
                </div>
            </div>
            {/* login page
            <button onClick={() => dispatch(Login())}>Login</button>
            <button onClick={() => dispatch(Logout())}>Logout</button> */}
        </div>
    )
}

export default login

