"use client"


import {
    TooltipProvider,
    Tooltip,
    TooltipTrigger,
    TooltipContent
} from "@/components/ui/tooltip";

interface ActionTooltipProps {
    label: string
    children: React.ReactNode
    side?: "top" | "bottom" | "left" | "right"
    align?: "start" | "center" | "end"
}

export const ActionTooltip = ({
                           label,
                           children,
                           side,
                           align
                       }: ActionTooltipProps
) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent side={side} align={align}>
                    <p className="font-semibold text-sm capitalize">
                        {label.toUpperCase()}
                    </p>
                </TooltipContent>
            </Tooltip>

        </TooltipProvider>
    )
}
