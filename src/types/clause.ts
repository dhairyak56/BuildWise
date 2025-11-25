export interface ContractClause {
    id: string
    title: string
    category: string
    content: string
    description: string | null
    is_required: boolean
    applicable_to: string[]
    created_at: string
    updated_at: string
}

export type ClauseCategory =
    | 'payment'
    | 'warranty'
    | 'insurance'
    | 'termination'
    | 'variation'
    | 'dispute'
    | 'time'
    | 'safety'
    | 'general'
