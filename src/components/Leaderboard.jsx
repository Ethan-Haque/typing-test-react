import React from 'react'

const Leaderboard = () => {
    return (
        <div name="leaderboard" className="flex flex-col justify-around items-center h-screen  text-white text-[2vmin] bg-[#0d47a1]">
            <table className="table-auto  border-2">
                <thead className="border-b">
                    <tr>
                        <th className="px-6 py-4">Test1</th>
                        <th className="px-6 py-4">Test2</th>
                        <th className="px-6 py-4">Test3</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b">
                        <td className="px-6 py-4">Test</td>
                        <td className="px-6 py-4">Test</td>
                        <td className="px-6 py-4">Test</td>
                    </tr>
                    <tr className="border-b">
                        <td className="px-6 py-4">Test</td>
                        <td className="px-6 py-4">Test</td>
                        <td className="px-6 py-4">Test</td>
                    </tr>
                    <tr className="border-b">
                        <td className="px-6 py-4">Test</td>
                        <td className="px-6 py-4">Test</td>
                        <td className="px-6 py-4">Test</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Leaderboard;