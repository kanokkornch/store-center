import { useEffect, useState, Fragment } from 'react'
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux'
import { Login, Logout } from '../store/actions/authAction'
import {
    Card, CardContent, CardAction, TextField, FormControl,
    InputLabel, Input, InputAdornment, IconButton, Button,
    FormHelperText, FormControlLabel, FormGroup
} from '@material-ui/core'
import Checkbox from '@material-ui/core/Checkbox';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import Image from 'next/image'
import registering from '../assets/images/undraw_Accept_terms_re_lj38.png'
// import 'animate.css';
import Link from 'next/link'
import { useForm, Controller } from "react-hook-form";
import { APIshopRegister } from '../services/api'
import { message } from 'antd'
function RegisterPage() {
    const { reset, control, handleSubmit, formState: { errors }, setError, clearErrors, clearForm } = useForm({
        defaultValues: {
            name: '',
            username: '',
            password: '',
            confirm_password: '',
            email: '',
            phone: '',
            accept_term_service: false
        }
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [acceptTermService, setAcceptTermService] = useState(false)
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    }
    const onSubmit = async (data) => {
        if (data.password !== data.confirm_password) {
            setError('confirm_password', { type: 'manual', message: 'ยืนยันรหัสผ่านไม่ตรงกับรหัสผ่าน' })
        } else if (!acceptTermService) {
            setError('accept_term_service', { type: 'manual', message: 'กรุณายอมรับเงื่อนไขก่อนลงทะเบียน' })
        } else {
            const loading = message.loading('รอสักครู่...')
            APIshopRegister(data).then(res => {
                setTimeout(loading, 0)
                if (res.success) {
                    reset()
                    setAcceptTermService(false)
                    message.success('ลงทะเบียนสำเร็จ. คุณสามารถเข้าสู่ระบบได้แล้ว')
                } else {
                    message.error(res.message)
                }
            }).catch(err => {
                setTimeout(loading, 0)
                message.error('service ไม่พร้อมใช้งานขณะนี้')
                console.error(err)
            })
            // console.log(`REGISTER DATA`, data)
        }
    }
    const handleAcceptTermService = (e) => {
        if (e.target.checked) {
            clearErrors('accept_term_service')
        }
        setAcceptTermService(e.target.checked)
    }

    return (
        <div className="blank-layout">
            <div className="row m-0 signup-section">
                <div className="col-md-6 d-none d-md-flex section-one flex-column">
                    <div className='welcome'>Welcome.</div>
                    <div className='title'>Sign Up</div>
                </div>
                <div className="col-md-6 section-two">
                    <div className="login-form-container">
                        <div className="welcome d-flex d-md-none">FiinShop welcome.</div>
                        <div className="title">Create your new account</div>
                        <form className='w-100' onSubmit={handleSubmit(onSubmit)}>
                            <Controller
                                name="name"
                                control={control}
                                defaultValue=""
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <TextField
                                        fullWidth
                                        label="Fullname"
                                        id="standard-basic"
                                        value={value}
                                        onChange={onChange}
                                        error={!!error}
                                        size="small"
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
                                    />
                                )}
                                rules={{ required: true, pattern: /[0-9]{10}/, maxLength: 10 }}
                            />
                            {errors.phone && <FormHelperText id="error-text">หมายเลขโทรศัพท์ไม่ถูกต้อง</FormHelperText>}
                            <div className="form-check mt-3">
                                <input
                                    className="form-check-input"
                                    name='acceptTermService'
                                    type="checkbox"
                                    checked={acceptTermService}
                                    onChange={handleAcceptTermService}
                                    id="acceptTermService" />
                                <label className="form-check-label" htmlFor="acceptTermService">
                                    ยอมรับเงื่อนไขและข้อตกลง
                                </label>
                            </div>
                            {errors.accept_term_service && <FormHelperText id="error-text">{errors.accept_term_service.message}</FormHelperText>}
                            <Button className="w-100 my-2" type='submit' variant="contained" color="primary">
                                ลงทะเบียน
                            </Button>
                        </form>
                        <Link href="/login">
                            <Button className="w-100" variant="outlined" color="primary">
                                เข้าสู่ระบบ
                            </Button>
                        </Link>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default RegisterPage
