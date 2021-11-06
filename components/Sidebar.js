import React, { useState, Fragment } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import clsx from 'clsx'
// import MenuIcon, HighlightOffIcon from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import SettingsIcon from '@material-ui/icons/Settings';
import CloseIcon from '@material-ui/icons/Close';
import { SidebarData } from './SidebarData'
import { useRouter } from "next/router";
import {
    Drawer, Button, IconButton,
    SwipeableDrawer, List, ListItem, ListItemIcon,
    ListItemText, Collapse, Menu, MenuItem,
    Divider
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
    list: {
        minWidth: 'fit-content',
        width: '250px'
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    fullList: {
        width: 'auto',
    },
    nested: {
        paddingLeft: '2.5rem',
    },
    menuActive: {
        color: '#201ADB',
        background: '#E2EFFF',
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
    const [anchorEl, setAnchorEl] = useState(null);
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
    console.log(`router.pathname`, router.pathname)
    const list = (
        <div
            className={clsx(classes.list)}
            role="presentation"
        >
            <div className={classes.drawerHeader}>
                Logo จ้าา
                <IconButton onClick={() => setSidebar(false)}>
                    <CloseIcon />
                </IconButton>
            </div>
            <List component="nav">
                {SidebarData.map((menu, i) => (
                    <div key={menu.id}>
                        <ListItem className={`main-menu ${index === i && indexOpen ? 'active' : ''}`} onClick={() => setOpenCollapseMeu(i, index !== i ? true : !indexOpen)}>
                            <ListItemIcon>{menu.icon}</ListItemIcon>
                            <ListItemText primary={menu.title} />
                            {index === i && indexOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        {menu.subNav && menu.subNav.length && menu.subNav.map(sub => (
                            <Collapse key={sub.title} in={index === i && indexOpen} timeout="auto" unmountOnExit>
                                <List disablePadding>
                                    <Link href={`${menu.prefix}${sub.path}`}>
                                        <ListItem className='sub-menu' button className={clsx(classes.nested, {
                                            [classes.menuActive]: `${menu.prefix}${sub.path}` === router.pathname,
                                            [classes.menu]: `${menu.prefix}${sub.path}` !== router.pathname,
                                        })}>
                                            <ListItemText primary={sub.title} />
                                        </ListItem>
                                    </Link>
                                </List>
                            </Collapse>
                        ))}
                    </div>
                ))}
            </List>
        </div >
    )

    const options = [
        'แหล่งเรียนรู้',
        'ศูนย์ช่วยเหลือ',
        'ข้อมูลส่วนตัว',
        'การจัดการผู้ใช้',
        'ตั้งค่าบัญชี',
        'ตั้งค่าระบบแชท',
        'ออกจากระบบ'
    ]

    return (
        <>
            <div className="header-nav d-flex px-1 align-items-center justify-content-between">
                <IconButton
                    onClick={showSidebar}
                    aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleClick}>
                    <SettingsIcon />
                </IconButton>
            </div>
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
                        width: '15rem',
                    },
                }}
            >
                {options.map((option) => (
                    <MenuItem className='justify-content-center' key={option} selected={option === 'Pyxis'} onClick={handleClose}>
                        {option}
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}

export default Sidebar
