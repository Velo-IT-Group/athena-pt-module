'use client';
import React from 'react';
import { Bar, BarChart, ResponsiveContainer } from 'recharts';

const ResponsiveBarChart = ({ data }: { data: any[] }) => {
	return (
		<ResponsiveContainer width='100%' height='100%'>
			<BarChart data={data}>
				<Bar
					dataKey='goal'
					style={
						{
							fill: 'hsl(var(--foreground))',
							opacity: 0.9,
						} as React.CSSProperties
					}
				/>
			</BarChart>
		</ResponsiveContainer>
	);
};

export default ResponsiveBarChart;
