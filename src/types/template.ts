export interface ContractTemplate {
    id: string
    name: string
    description: string
    category: 'residential' | 'commercial' | 'subcontractor' | 'renovation'
    template_content: {
        sections: TemplateSection[]
    }
    template_variables: string[]
    is_default: boolean
    created_at: string
    updated_at: string
}

export interface TemplateSection {
    title: string
    content: string
}

export interface TemplateVariables {
    [key: string]: string
}
