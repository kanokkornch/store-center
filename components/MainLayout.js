import { Fragment } from 'react'
import Sidebar from './Sidebar'
import Head from 'next/head'
function MainLayout({ children, title }) {
    return (
        <div className="main-layout">
            <Sidebar />
            <div className="main-layout-content">
                <div className="content">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default MainLayout
