import React, { PropsWithChildren } from "@rbxts/react";

interface BillboardProps extends PropsWithChildren {
	readonly size?: UDim2;
	readonly adornee?: BasePart;
}

export default ({ size, adornee, children }: BillboardProps) => {
	return (
		<billboardgui Size={size} Adornee={adornee}>
			{children}
		</billboardgui>
	);
};
