import React, { useState, Fragment, useEffect } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import clsx from 'clsx'
import MenuIcon from '@material-ui/icons/Menu';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import SettingsIcon from '@material-ui/icons/Settings';
import { SidebarData } from './SidebarData'
import { useRouter } from "next/router";
import {
    Drawer, Button, IconButton,
    SwipeableDrawer, List, ListItem, ListItemIcon,
    ListItemText, Collapse, Menu, MenuItem,
    Divider, Hidden
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { APIshopLogout } from '../services/api'
import AppLogo from '../assets/images/icon-logo.png'
import Image from 'next/image'


const useStyles = makeStyles({
    nested: {
        paddingLeft: '2.5rem',
    },
    menuActive: {
        color: '#fff',
        background: '#3A82FF',
    },
    menu: {
        color: '#111'
    }
})
function Sidebar() {
    const router = useRouter();
    const [sidebar, setSidebar] = useState(false)
    const showSidebar = () => setSidebar(!sidebar)
    const classes = useStyles()
    const [index, setIndex] = useState(null)
    const [indexOpen, setIndexOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const [showVerify, setShowVerify] = useState(false)
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    }

    const setOpenCollapseMeu = (i, open) => {
        setIndex(i)
        setIndexOpen(open)
    }

    useEffect(() => {
        const _data = sessionStorage.getItem('_data')
        if (_data) {
            console.log(`check verify`)
            if (!_data.shop_verification) setShowVerify(true)
        }
    })
    // console.log(`router.pathname`, router.pathname)
    const list = (
        <div
            className='sidebar-list'
            role="presentation"
        >
            <div className='sidebar-haeder mx-2'>
                <Image src={AppLogo} alt="me" width="64" height="64" />
                <span>SHOPFiiN</span>
            </div>

            <List component="nav">
                {SidebarData.map((menu, i) => (
                    <div key={menu.id}>
                        {menu.subNav && menu.subNav.length && <>
                            <ListItem className={`main-menu ${index === i && indexOpen ? 'active' : ''}`} onClick={() => setOpenCollapseMeu(i, index !== i ? true : !indexOpen)}>
                                <ListItemIcon>{menu.icon}</ListItemIcon>
                                <ListItemText primary={menu.title} />
                                {/* {index === i && indexOpen ? <ExpandLess /> : <ExpandMore />} */}
                            </ListItem>
                            {menu.subNav.map(sub => (
                                // <Collapse key={sub.title} in={index === i && indexOpen} timeout="auto" unmountOnExit>
                                <List disablePadding key={sub.title}>
                                    <Link href={`${menu.prefix}${sub.path}`}>
                                        <ListItem className='sub-menu' button className={clsx(classes.nested, {
                                            [classes.menuActive]: `${menu.prefix}${sub.path}` === router.pathname,
                                            [classes.menu]: `${menu.prefix}${sub.path}` !== router.pathname,
                                        })}>
                                            <ListItemText primary={sub.title} />
                                        </ListItem>
                                    </Link>
                                </List>
                                // </Collapse>
                            ))}
                        </>}
                        {!menu.subNav && <Link href={`${menu.prefix}`}>
                            <ListItem button
                                // onClick={() => setOpenCollapseMeu(i, index !== i ? true : !indexOpen)}
                                className={`one-menu ${menu.prefix === router.pathname ? 'active' : ''}`}>
                                <ListItemIcon>{menu.icon}</ListItemIcon>
                                <ListItemText primary={menu.title} />
                            </ListItem>
                        </Link>}

                    </div>
                ))}
            </List>
        </div >
    )

    const options = [
        {
            name: 'แหล่งเรียนรู้',
            onClick: () => { }
        },
        {
            name: 'ศูนย์ช่วยเหลือ',
            onClick: () => { }
        },
        {
            name: 'ข้อมูลส่วนตัว',
            onClick: () => { }
        },
        {
            name: 'การจัดการผู้ใช้',
            onClick: () => { }
        },
        {
            name: 'ตั้งค่าบัญชี',
            onClick: () => { }
        },
        {
            name: 'ตั้งค่าระบบแชท',
            onClick: () => { }
        },
        {
            name: 'ออกจากระบบ',
            onClick: () => APIshopLogout()
        }
    ]

    return (
        <>
            <div className="header-nav z-index-10 d-flex px-1 align-items-center justify-content-between">
                <IconButton
                    onClick={showSidebar}
                    aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <div>
                    {showVerify && <Button color="primary"
                        onClick={() => { }}>
                        กรุณายืนยันตัวตน
                    </Button>}
                    <IconButton
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={handleClick}>
                        <SettingsIcon />
                    </IconButton>
                </div>

            </div>
            <Drawer
                className='d-none fixd-menu'
                variant='permanent'
                anchor='left'
                open={true}
            >
                {list}
            </Drawer>
            <SwipeableDrawer
                anchor='left'
                open={sidebar}
                onClose={() => setSidebar(false)}
                onOpen={() => setSidebar(true)}
            >
                {list}
            </SwipeableDrawer>

            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        // maxHeight: 48 * 4.5,
                        width: '13rem',
                    },
                }}
            >
                {options.map((option) => (
                    <MenuItem className='justify-content-center' key={option.name} selected={option.name === 'Pyxis'} onClick={option.onClick}>
                        {option.name}
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}

export default Sidebar
