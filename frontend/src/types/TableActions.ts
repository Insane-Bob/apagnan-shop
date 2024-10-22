export interface TableActions {
    label: string
    icon: string
    class: string
    condition?: (row: any) => boolean
    action: (row: any) => void
    children?: TableActions[]
    trigger?: boolean
    confirmation?: {
        title: string
        message: string
        styleConfirm?: string
        styleCancel?: string
        styleFooter?: string
    }
}
