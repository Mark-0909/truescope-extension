export default function BiasBar({ label, value = 0, color = 'bg-gray-400', type = 'simple' }) {
	const clamped = Math.max(0, Math.min(100, Number(value) || 0));

	if (type === 'consistency') {
		return (
			<div className="w-full mb-2">
				<div className="flex items-center justify-between text-[10px] text-gray-500 mb-1 font-bold">
					<span>Support</span>
					<span>Neutral</span>
					<span>Refute</span>
				</div>
				<div className="h-3 w-full bg-red-800 rounded-full overflow-hidden">
					<div
						className="h-3 bg-green-700 rounded-full"
						style={{ width: `${clamped}%` }}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full">
			<div className="flex items-center justify-between">
				<p className="text-xs font-medium text-gray-600">{label}</p>
				<p className="text-xs font-bold text-gray-800">{clamped}%</p>
			</div>
			<div className="h-2 w-full bg-gray-200 rounded">
				<div className={`h-2 ${color} rounded`} style={{ width: `${clamped}%` }} />
			</div>
		</div>
	);
}
