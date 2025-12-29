import React from 'react'

const Admin = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 shadow">
                    <p className="text-sm text-gray-500">Users</p>
                    <p className="text-2xl font-bold mt-2">1,245</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow">
                    <p className="text-sm text-gray-500">Listings</p>
                    <p className="text-2xl font-bold mt-2">320</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow">
                    <p className="text-sm text-gray-500">Bookings</p>
                    <p className="text-2xl font-bold mt-2">742</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow">
                    <p className="text-sm text-gray-500">Revenue</p>
                    <p className="text-2xl font-bold mt-2">$18,450</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow">
                <h2 className="text-lg sm:text-xl font-semibold mb-4">Recent Activity</h2>
                <ul className="space-y-3 text-sm sm:text-base">
                    <li className="flex justify-between">
                        <span>User John booked Listing A</span>
                        <span className="text-gray-400">2h ago</span>
                    </li>
                    <li className="flex justify-between">
                        <span>User Anna created new listing</span>
                        <span className="text-gray-400">5h ago</span>
                    </li>
                    <li className="flex justify-between">
                        <span>Booking #4821 completed</span>
                        <span className="text-gray-400">1d ago</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Admin
