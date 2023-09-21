import {create} from "zustand";

interface AlertSettings {
    title: string
    message: string
    okButtonText: string
    cancelButtonText: string
    onOk?: () => void
    onCancel?: () => void
}

interface AlertStore {
    isOpen: boolean
    settings?: AlertSettings
    onOpen: (setting: AlertSettings) => void
    onClose: () => void
}

export const useAlert = create<AlertStore>((set, get) => ({
    isOpen: false,
    settings: undefined,
    onOpen: (setting) => set({isOpen: true, settings: setting}),
    onClose: () => set({isOpen: false})
}))