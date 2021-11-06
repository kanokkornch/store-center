import { useState, useEffect } from 'react'
import { Card, CardContent, CardAction } from '@material-ui/core'

function creation() {
    return (
        <div>
            <div className="h3">เพิ่มสินค้า</div>
            <div className="row">
                <div className="col-md-8">
                    <Card>
                        <CardContent>
                            <div className="h5">ข้อมูลทั่วไป</div>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-md-4"></div>
            </div>
        </div>
    )
}

export default creation
