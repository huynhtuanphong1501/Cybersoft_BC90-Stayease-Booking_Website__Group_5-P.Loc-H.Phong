import React from 'react'

const Dashboard = () => {
    return (
        <div className="space-y-8 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 bg-gray-50 min-h-screen">

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow hover:shadow-lg transition">
                    <p className="text-xs sm:text-sm text-gray-500">Total Users</p>
                    <p className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">1,245</p>
                </div>

                <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow hover:shadow-lg transition">
                    <p className="text-xs sm:text-sm text-gray-500">Active Listings</p>
                    <p className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">320</p>
                </div>

                <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow hover:shadow-lg transition">
                    <p className="text-xs sm:text-sm text-gray-500">Total Bookings</p>
                    <p className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">742</p>
                </div>

                <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow hover:shadow-lg transition">
                    <p className="text-xs sm:text-sm text-gray-500">Monthly Revenue</p>
                    <p className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">$18,450</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4">Recent Activity</h3>

                    <ul className="space-y-4 text-sm sm:text-base">
                        <li className="flex flex-col sm:flex-row sm:justify-between gap-1">
                            <span className="text-gray-700">User John booked Listing A</span>
                            <span className="text-xs sm:text-sm text-gray-400">2 hours ago</span>
                        </li>
                        <li className="flex flex-col sm:flex-row sm:justify-between gap-1">
                            <span className="text-gray-700">User Anna created a new listing</span>
                            <span className="text-xs sm:text-sm text-gray-400">5 hours ago</span>
                        </li>
                        <li className="flex flex-col sm:flex-row sm:justify-between gap-1">
                            <span className="text-gray-700">Booking #4821 completed</span>
                            <span className="text-xs sm:text-sm text-gray-400">1 day ago</span>
                        </li>
                        <li className="flex flex-col sm:flex-row sm:justify-between gap-1">
                            <span className="text-gray-700">Listing B was approved</span>
                            <span className="text-xs sm:text-sm text-gray-400">2 days ago</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4">System Status</h3>

                    <div className="space-y-4 text-sm sm:text-base">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Server Status</span>
                            <span className="text-green-600 font-medium">Online</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Payment Gateway</span>
                            <span className="text-green-600 font-medium">Active</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Pending Reports</span>
                            <span className="text-orange-500 font-medium">3</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">System Alerts</span>
                            <span className="text-red-500 font-medium">1</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4">Quick Admin Actions</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <button className="w-full rounded-xl bg-black text-white py-3 text-sm sm:text-base hover:bg-gray-800 transition">Add New Listing</button>
                    <button className="w-full rounded-xl bg-gray-100 text-gray-800 py-3 text-sm sm:text-base hover:bg-gray-200 transition">Manage Users</button>
                    <button className="w-full rounded-xl bg-gray-100 text-gray-800 py-3 text-sm sm:text-base hover:bg-gray-200 transition">View Reports</button>
                </div>
            </div>

        </div>
    )
}

export default Dashboard
