import { useEffect, useState, Fragment } from 'react'
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux'
import { Login, Logout } from '../store/actions/authAction'
import {
    Card, CardContent, CardAction, TextField, FormControl,
    InputLabel, Input, InputAdornment, IconButton, Button,
    FormHelperText
} from '@material-ui/core'
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import Image from 'next/image'
import registering from '../assets/images/undraw_Accept_terms_re_lj38.png'
import 'animate.css';
import Link from 'next/link'
import { useForm, Controller } from "react-hook-form";
import { APIshopRegister } from '../services/api'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
function register() {
    const { reset, control, handleSubmit, formState: { errors }, setError } = useForm({
        defaultValues: {
            name: '',
            username: '',
            password: '',
            confirm_password: '',
            email: '',
            phone: ''
        }
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    }
    const onSubmit = (data) => {
        if (data.password !== data.confirm_password) {
            setError('confirm_password', { type: 'manual', message: 'ยืนยันรหัสผ่านไม่ตรงกับรหัสผ่าน' })
        } else {
            APIshopRegister(data).then(res => {
                if (res.status) {
                    reset()
                    return MySwal.fire({
                        title: res.message,
                        text: 'ท่านสามารถเข้าสู่ระบบได้แล้ว',
                        icon: 'success'
                    })
                } else {
                    return MySwal.fire({
                        title: 'ข้อความจากระบบ',
                        text: res.message,
                        icon: 'error'
                    })
                }
            }).catch(err => {
                return MySwal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'เกิดความผิดพลาดของ Service',
                    showConfirmButton: false,
                    timer: 2000
                })
            })
            // console.log(`REGISTER DATA`, data)
        }
    }
    return (
        <div className="blank-layout">
            <div className="main-container">
                <div className="content-container">
                    <div className="row">
                        <div className="col-md-6 d-none d-md-flex">
                            <Image
                                src={registering}
                                alt="Picture of the author"
                                className='login-image'
                                width={500}
                                height={500}
                            />
                        </div>
                        <div className="col-md-6">
                            <Card className='login-form'>
                                <CardContent className='d-flex flex-column'>
                                    <div className="h4">ลงทะเบียน กับ FiinShop</div>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <Controller
                                            name="name"
                                            control={control}
                                            defaultValue=""
                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                <TextField
                                                    className="d-flex"
                                                    label="ชื่อ - นามสกุล"
                                                    id="standard-basic"
                                                    value={value}
                                                    onChange={onChange}
                                                    error={!!error}
                                                    size="small"
                                                // helperText={error ? error.message : null}
                                                />
                                            )}
                                            rules={{ required: true }}
                                        />
                                        <Controller
                                            name="username"
                                            control={control}
                                            defaultValue=""
                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                <TextField
                                                    type='text'
                                                    className="d-flex"
                                                    label="Username"
                                                    id="standard-basic"
                                                    value={value}
                                                    onChange={onChange}
                                                    error={!!error}
                                                    size="small"
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
                                                        label="Password"
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
                                        <Controller
                                            name="confirm_password"
                                            control={control}
                                            defaultValue=""
                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                <FormControl className='d-block'>
                                                    <InputLabel htmlFor="confirm-password-input">Confirm password</InputLabel>
                                                    <Input
                                                        fullWidth
                                                        id="confirm-password-input"
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        value={value}
                                                        onChange={onChange}
                                                        error={!!error}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    aria-label="toggle password visibility"
                                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                    onMouseDown={handleMouseDownPassword}
                                                                >
                                                                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        }
                                                    />
                                                </FormControl>
                                            )}
                                            rules={{ required: true, minLength: 8 }}
                                        />
                                        {errors.confirm_password && errors.confirm_password.message && <FormHelperText id="error-text">{errors.confirm_password.message}</FormHelperText>}
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
                                            name="phone"
                                            control={control}
                                            defaultValue=""
                                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                                <TextField
                                                    type='text'
                                                    className="d-flex"
                                                    label="หมายเลขโทรศัพท์"
                                                    id="standard-basic"
                                                    value={value}
                                                    onChange={onChange}
                                                    placeholder="081999XXXX"
                                                    error={!!error}
                                                // helperText={error ? error.message : null}
                                                />
                                            )}
                                            rules={{ required: true, pattern: /[0-9]{10}/, maxLength: 10 }}
                                        />
                                        {errors.phone && <FormHelperText id="error-text">หมายเลขโทรศัพท์ไม่ถูกต้อง</FormHelperText>}
                                        <Button className="w-100 my-2" type='submit' variant="contained" color="primary">
                                            ลงทะเบียน
                                        </Button>
                                    </form>
                                    <Link href="/login">
                                        <Button variant="outlined" color="primary">
                                            เข้าสู่ระบบ
                                        </Button>
                                    </Link>
                                    {/* <button onClick={()=>{
                                        console.log(`REACT_APP_SELLER_API`, process.env.REACT_APP_SELLER_API)
                                    }}>env</button> */}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default register
