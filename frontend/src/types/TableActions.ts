export interface TableActions {
    label: string
    icon: string
    class: string
    condition: (row: any) => boolean
    action: (row: any) => void
}
