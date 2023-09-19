import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

/**
 * combination an or more className
 * @param inputs classNames
 * @returns className String
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const TODO = (message: string) => {
    alert(message)
}