import HomeFooter from '@/app/components/HomeFooter'
import HomeHeader from '@/app/components/HomeHeader'
import React from 'react'

const CheckOut = () => {
    return (
        <div className="bg-white min-h-screen">
            <HomeHeader />
            <main className="app-container mx-auto py-6 md:py-10 text-black">
                <section className="relative group overflow-hidden rounded-xl md:rounded-2xl mb-8 md:mb-12 border border-[#335765] shadow-sm cursor-pointer">
                </section>
            </main>
            <HomeFooter />
        </div >
    )
}

export default CheckOut
