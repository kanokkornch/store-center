import React from 'react';
import Link from 'next/link'
import Image from 'next/image'
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import FilterListIcon from '@material-ui/icons/FilterList';
import {
    Skeleton, Empty, Spin, Button as AntdButton, DatePicker,
    Menu, Dropdown, message
} from 'antd'
import { DownOutlined, UserOutlined } from '@ant-design/icons'
import {
    Drawer, Button, Popper, MenuItem, Grow, ClickAwayListener,
    Divider, MenuList,
} from '@material-ui/core'
import dayjs from 'dayjs'
import { numberFormat } from '../services/utills'

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}
function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order,
        orderBy, numSelected, rowCount,
        onRequestSort, headCells, rows } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow className=''>
                <TableCell padding="checkbox">
                    {rows.length > 0 && <input
                        className={`form-check-input ${numSelected > 0 && numSelected < rowCount ? 'indeterminate' : ''}`}
                        type="checkbox"
                        onClick={onSelectAllClick}
                        aria-label='select all desserts'
                        defaultChecked={rowCount > 0 && numSelected === rowCount}>
                    </input>}

                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%'
    },
}));

const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const { numSelected } = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                // <Typography className={classes.title} variant="h6" id="tableTitle" component="div">

                // </Typography>
                <></>
            )}

            {numSelected > 0 ? (<></>
                // <Tooltip title="Delete">
                //     <IconButton aria-label="delete">
                //         <DeleteIcon />
                //     </IconButton>
                // </Tooltip>
            ) : (
                // <Tooltip title="Filter list">
                //     <IconButton aria-label="filter list">
                //         <FilterListIcon />
                //     </IconButton>
                // </Tooltip>
                <></>
            )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

export default function OrderTable(props) {
    const { headCells, rows, notFound = false,
        handleDelete, fetchProducts,
        handleEditModal, tab } = props
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [open, setOpen] = React.useState(false)
    const anchorRef = React.useRef(null)

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };
    const prevOpen = React.useRef(open)

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        // if (newPage < page) {
        //     fetchProducts(parseInt(rowsPerPage), parseInt(listData.offset) - parseInt(rowsPerPage), '')
        // } else {
        //     fetchProducts(parseInt(rowsPerPage), parseInt(listData.offset) + parseInt(rowsPerPage), '')
        // }
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (id) => {
        console.log(`selected`, selected)
        console.log(`isSelected`, selected.indexOf(id) !== -1)
        return selected.indexOf(id) !== -1;
    }

    // const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    const emptyRows = 0;

    const menu = (
        <Menu onClick={(e) => {
            if (selected.length < 1) {
                message.warning('กรุณาเลือกรายการ')
            } else {
                window.location.assign(`/order/label?type=${e.key}&id=${selected.join(',')}`)
            }
        }}>
            <Menu.Item key="invoice" >
                พิมพ์ใบกำกับสินค้า
            </Menu.Item>
            <Menu.Item key="label" >
                พิมพ์ฉลากสำหรับจัดส่ง
            </Menu.Item>
        </Menu>
    )

    return (
        <div className={classes.root}>
            {
                tab === 3 ? <div className='mb-2'>
                    <div className="row">
                        <div className="col-lg-2 col-md-3 col-sm-4">
                            <Dropdown overlay={menu}>
                                <AntdButton>
                                    พิมพ์ <DownOutlined />
                                </AntdButton>
                            </Dropdown>
                        </div>
                    </div>

                </div> : null
            }
            <Spin spinning={false}>
                <Paper className={classes.paper}>
                    <EnhancedTableToolbar numSelected={selected.length} />
                    <TableContainer>
                        <Table
                            className={classes.table}
                            aria-labelledby="tableTitle"
                            size={dense ? 'small' : 'medium'}
                            aria-label="enhanced table"
                        >
                            <EnhancedTableHead
                                classes={classes}
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={handleSelectAllClick}
                                onRequestSort={handleRequestSort}
                                rowCount={rows.length}
                                headCells={headCells}
                                rows={rows}
                            />
                            <TableBody>
                                {rows.length > 0 ? stableSort(rows, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        const isItemSelected = isSelected(row.id);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.id}
                                                selected={isItemSelected}
                                            >
                                                <TableCell padding="checkbox">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        onClick={(event) => handleClick(event, row.id)}
                                                        aria-labelledby={labelId}
                                                        checked={isItemSelected}>
                                                    </input>
                                                </TableCell>
                                                <TableCell style={{ minWidth: '260px' }} component="th" id={labelId} scope="row" padding="none">
                                                    <div className='py-3'>
                                                        <Link href={`/order/${row.id}`}>
                                                            <a>No. {row.id}</a>
                                                        </Link>
                                                        {row.order_detail.map(dt => (
                                                            <div key={dt.product_id} className='d-flex table-header-content pt-3'>
                                                                <Image className='table-image' src={dt.product_thumbnail} width={40} height={40} />
                                                                <div className='d-flex flex-column ms-1'>
                                                                    <span className='title mb-1'>{dt.product_name}</span>
                                                                    {dt.product_option_name && <span className='text-gray'>
                                                                        {dt.product_option_name} : {dt.product_option_value}
                                                                    </span>}
                                                                    <span className='text-gray'>จำนวน: {dt.product_qty}</span>
                                                                </div>
                                                            </div>
                                                        ))}

                                                        {/* {row.product_options.length > 0 ? row.product_options.map(pd => (
                                                            <p><div>
                                                                <img className='me-3 table-image' src={pd.thumbnail} alt="" />
                                                            </div>
                                                            </p>
                                                        )) : null} */}
                                                    </div>


                                                </TableCell>
                                                <TableCell style={{ minWidth: '115px' }}>
                                                    {row.name}
                                                </TableCell>
                                                <TableCell align="right" style={{ minWidth: '115px' }}>
                                                    <span className='text-gray'>฿</span>  {numberFormat(row.total_amount)}
                                                    {/* <IconButton onClick={() => handleEditModal('price',row.id)} aria-label="delete" className='ms-2' size="small">
                                                        <BorderColorIcon fontSize="inherit" />
                                                    </IconButton> */}
                                                    {/* {row.product_options.length > 0 ? row.product_options.map(pd => (
                                                        <p><span>{row.sell_price}</span>
                                                        </p>
                                                    )) : null} */}
                                                </TableCell>
                                                <TableCell style={{ minWidth: '115px' }}>
                                                    {dayjs(row.created_at).format('DD MMM YYYY HH:mm')}
                                                    {/* <IconButton onClick={() => handleEditModal('stock',row.id)} aria-label="delete" className='ms-2' size="small">
                                                        <BorderColorIcon fontSize="inherit" />
                                                    </IconButton> */}
                                                    {/* {row.product_options.length > 0 ? row.product_options.map(pd => (
                                                        <p><span>{row.qty}</span>
                                                        </p>
                                                    )) : null} */}
                                                </TableCell>

                                            </TableRow>
                                        )
                                    }) : !notFound ? <TableRow
                                    >
                                        <TableCell padding="checkbox">
                                            <Skeleton active />
                                        </TableCell>
                                        <TableCell scope="row" padding="none">
                                            <Skeleton active />
                                        </TableCell>
                                        <TableCell><Skeleton active /></TableCell>
                                        <TableCell><Skeleton active /></TableCell>
                                    </TableRow> : <TableRow>
                                    <TableCell className='no-data-table' colSpan={6}><Empty /></TableCell>
                                </TableRow>
                                }
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {rows.length > 0 && <TablePagination
                        rowsPerPageOptions={[10, 20, 50, 70]}
                        component="div"
                        // count={listData.counts > rows.length ? listData.counts : rows.length}
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />}

                </Paper>
                {/* <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            /> */}
            </Spin>
        </div>
    );
}