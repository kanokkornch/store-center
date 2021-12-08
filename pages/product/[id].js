import { useState, useEffect, useRef, Fragment } from 'react'
import { useRouter } from 'next/router'
// import { }

function productItem() {
    const router = useRouter()
    const { id } = router.query
    return (
        <div>
            <p>product Item: {id}</p>
        </div>
    )
}

export default productItem
