import { useEffect, useState, Fragment } from 'react'
import { Card, CardContent, CardAction } from '@material-ui/core'
function Dashbord() {
    return (
        <div>
            <div className="row">
                <div className="col-md-6">
                    <Card>
                        <CardContent>
                            รายละเอียดร้านค้า
                        </CardContent>
                    </Card>
                </div>
                <div className="col-md-6">
                    <Card>
                        <CardContent>
                            ประกาศ
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Dashbord
