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
import registering from '../assets/images/undraw_Accept_terms_re_lj38.png'
import 'animate.css';
import Link from 'next/link'
function register() {
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
                                    <div className="h4">ลงทะเบียน</div>
                                    <Link href="/login">
                                        <Button variant="outlined" color="primary">
                                            เข้าสู่ระบบ
                                        </Button>
                                        {/* <a>เข้าสู่ระบบ</a> */}
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default register
