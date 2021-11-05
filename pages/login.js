import { useEffect } from 'react'
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux'
import { Login, Logout } from '../store/actions/authAction'

function login() {
    const dispatch = useDispatch()
    return (
        <div>
            login page
            <button onClick={() => dispatch(Login())}>Login</button>
            <button onClick={() => dispatch(Logout())}>Logout</button>
        </div>
    )
}

export default login
