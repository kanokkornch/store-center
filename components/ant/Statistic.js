import { Tooltip } from 'antd'
import { Card, CardContent } from '@material-ui/core'
import { numberFormat } from '../../services/utills'
function StatisticCard(props) {
    const {
        component = 'div',
        title = 'ยอดขาย',
        value = 0,
        valueUnit = 'baht',
        type = 'number',
        tooltip = null,
        classStyle = ''
    } = props
    return <>{
        component === 'div' ? <div className={`stat-card ${classStyle}`}>
            {
                tooltip ?
                    <div className='stat-title'>
                        <Tooltip title={tooltip}>{title}
                        </Tooltip>
                    </div> :
                    <div className='stat-title'>{title}</div>
            }
            <div className='stat-value'>
                {valueUnit === 'baht' && <span className="baht">฿</span>}
                {type === 'number' ? numberFormat(value) : value}
                {valueUnit === 'percent' && <span className='ms-1'>%</span>}
            </div>
        </div> : <Card className={`stat-card ${classStyle}`}>
            <CardContent>
                {
                    tooltip ?
                        <div className='stat-title'>
                            <Tooltip title={tooltip}>{title}
                            </Tooltip>
                        </div> :
                        <div className='stat-title'>{title}</div>
                }
                <div className='stat-value'>
                    {valueUnit === 'baht' && <span className="baht">฿</span>}
                    {type === 'number' ? numberFormat(value) : value}
                    {valueUnit === 'percent' && <span className='ms-1'>%</span>}
                </div>
            </CardContent>
        </Card>
    }</>
}

export default StatisticCard;
