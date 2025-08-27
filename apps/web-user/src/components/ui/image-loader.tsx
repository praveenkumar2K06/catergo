import { useState } from "react";

type NextImageLoadingProps = {
	src: string;
	alt: string;
	className?: string;
	rounded?: boolean;
	shimmer?: boolean;
	wrapperClassName?: string;
	fallbackSrc?: string;
};

export default function NextImageLoading({
	src,
	alt,
	className = "",
	rounded = true,
	shimmer = true,
	wrapperClassName = "",
	fallbackSrc,
	...rest
}: NextImageLoadingProps) {
	const [isLoaded, setIsLoaded] = useState(false);
	const [hasError, setHasError] = useState(false);
	const [currentSrc, setCurrentSrc] = useState(src);

	return (
		<div
			className={`relative overflow-hidden ${rounded ? "rounded-2xl" : ""} ${wrapperClassName}`}
			aria-busy={!isLoaded}
		>
			{/* Skeleton / shimmer */}
			{!isLoaded && (
				<div
					className={`absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-neutral-800 ${
						shimmer ? "animate-pulse" : ""
					}`}
					aria-hidden="true"
				>
					{/* subtle SVG shimmer for nicer effect */}
					{shimmer && (
						<svg
							className="h-full w-full"
							preserveAspectRatio="none"
							viewBox="0 0 400 200"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>Loading...</title>
							<defs>
								<linearGradient id="g">
									<stop stopColor="#f3f4f6" offset="0%" />
									<stop stopColor="#e5e7eb" offset="50%" />
									<stop stopColor="#f3f4f6" offset="100%" />
								</linearGradient>
							</defs>
							<rect width="400" height="200" fill="url(#g)" />
						</svg>
					)}
				</div>
			)}

			<img
				src={currentSrc}
				alt={alt}
				className={`transform transition-all duration-500 ease-out will-change-auto ${
					isLoaded
						? "scale-100 opacity-100 blur-0"
						: "scale-102 opacity-0 blur-sm"
				} ${className}`}
				onLoad={() => setIsLoaded(true)}
				onError={() => {
					if (
						!hasError &&
						fallbackSrc &&
						currentSrc !== fallbackSrc
					) {
						setHasError(true);
						setCurrentSrc(fallbackSrc);
						setIsLoaded(false);
					}
				}}
				{...rest}
			/>
		</div>
	);
}
