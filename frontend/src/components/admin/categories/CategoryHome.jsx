import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts'; // ResponsiveContainer is removed

const CategoryHome = () => {
    const chartData = [
        {
            Product: 'Wedding Events',
            January: 861,
            February: 504,
            March: 1101.5
        },
        {
            Product: 'Birthday Events',
            January: 1281,
            February: 652.7,
            March: 1190.3
        },
        {
            Product: 'Corparate Events',
            January: 861,
            February: 504,
            March: 1101.5
        },

    ];

    // Define the exact dimensions from the parent div
    const CHART_WIDTH = 400;
    const CHART_HEIGHT = 300;

    const navigate = useNavigate()

    return (
        // The parent container maintains the exact size: 400px wide, 300px tall
        <div className='ml-[-20px] flex gap-x-10'>

            <div className='w-[400px] h-[260px] border-2 mt-[-10px] p-2 rounded-2xl bg-white shadow-lg flex flex-col ml-[50px]'>


                {/* Render BarChart with fixed width and height props */}
                <BarChart
                    width={CHART_WIDTH - 10} // Adjust slightly for padding/margin
                    height={CHART_HEIGHT - 60} // Adjust for title and margins
                    data={chartData}
                    margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                >


                    {/* X-Axis: Rotated product labels */}
                    <XAxis
                        dataKey="Product"
                        stroke="#666"
                        angle={0}
                        textAnchor="end"
                        height={30} // Reduced height to fit in the small container
                    />

                    {/* Y-Axis: Sales revenue formatting */}
                    <YAxis
                        stroke="#666"
                        tickFormatter={(value) => `$${value}`}
                    />

                    <Tooltip />

                    {/* Legend positioned at the bottom */}
                    <Legend wrapperStyle={{ position: 'relative', top: 5 }} />

                    {/* Bar Components */}
                    <Bar dataKey="January" fill="#007ACC" name="Jan Sales" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="February" fill="#FF5733" name="Feb Sales" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="March" fill="#28A745" name="Mar Sales" radius={[3, 3, 0, 0]} />

                </BarChart>
            </div>

            <div className="p-6 flex justify-center">

                <div className="bg-pink-200 rounded-xl p-6 text-center w-full max-w-md">
                    <h2 className="text-2xl font-bold text-pink-800 mb-4">Category Slide Manager</h2>
                    <p className="text-pink-700 mb-6">Manage all your slides and images from one place.</p>
                    <button
                        className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
                        onClick={() => navigate("/admin/categories/heroslide")}
                    >
                        Go to Slides
                    </button>
                </div>

            </div>


        </div>
    );
};

export default CategoryHome;