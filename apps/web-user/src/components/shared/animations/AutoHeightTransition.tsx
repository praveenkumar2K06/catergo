import { animated, useSpring } from "@react-spring/web";
import { useLayoutEffect, useState } from "react";
import useMeasure from "react-use-measure";

export function AutoHeightTransition({
	children,
}: {
	children: React.ReactNode;
}) {
	const [ref, bounds] = useMeasure();
	const [height, setHeight] = useState(0);

	useLayoutEffect(() => {
		if (bounds.height > 0) {
			setHeight(bounds.height);
		}
	}, [bounds.height]);

	const springs = useSpring({
		height: height || "auto",
		config: { tension: 200, friction: 20 },
	});

	return (
		<animated.div
			style={{
				...springs,
				overflow: "hidden",
				position: "relative",
			}}
		>
			<div
				ref={ref}
				style={{
					position: "relative", // Change from absolute to relative
					width: "100%",
				}}
			>
				{children}
			</div>
		</animated.div>
	);
}
