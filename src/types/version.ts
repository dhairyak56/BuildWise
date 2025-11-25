export interface ContractVersion {
    id: string
    contract_id: string
    version_number: number
    content: {
        text: string
    }
    changes_summary: string | null
    created_by: string | null
    created_at: string
}

export interface ContractChange {
    id: string
    version_id: string
    change_type: 'added' | 'removed' | 'modified'
    section_title: string | null
    old_content: string | null
    new_content: string | null
    created_at: string
}
