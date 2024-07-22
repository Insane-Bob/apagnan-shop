export interface TableColumns {
    label: string
    key: string
    sorting?: boolean
    maxWidth?: string
    position?: 'left' | 'center' | 'right'
    toDisplay?: (value: any) => string
    sortingType?: 'string' | 'number' | 'date' | 'boolean' | 'custom' | 'none'
}
