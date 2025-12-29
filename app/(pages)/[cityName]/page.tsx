import BackToTopButton from '@/app/components/BackToTop'
import HomeFooter from '@/app/components/HomeFooter'
import HomeHeader from '@/app/components/HomeHeader'
import React from 'react'

const CityName = () => {
    return (
        <>
            <HomeHeader />

            <main>
                <div>
                    Đây là trang về các city
                </div>
            </main>

            <BackToTopButton />

            <HomeFooter />
        </>
    )
}

export default CityName
