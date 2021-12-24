import { useState, useEffect, useRef, Fragment } from 'react'

function PromotionPage() {
    useEffect(() => {
        document.title = 'โปรโมชั่น'
    }, [])
    return (
        <div>
            Promotion
        </div>
    )
}

export default PromotionPage
