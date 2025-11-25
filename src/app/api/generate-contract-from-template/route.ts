import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { logAction } from '@/lib/logger'

// POST: Generate contract from template
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { templateId, variables, projectId } = body

        // Validate required fields
        if (!templateId || !variables) {
            return NextResponse.json(
                { error: 'Template ID and variables are required' },
                { status: 400 }
            )
        }

        const supabase = createClient()

        // Fetch the template
        const { data: template, error: templateError } = await supabase
            .from('contract_templates')
            .select('*')
            .eq('id', templateId)
            .single()

        if (templateError || !template) {
            return NextResponse.json(
                { error: 'Template not found' },
                { status: 404 }
            )
        }

        // Replace variables in template content
        let contractContent = ''

        template.template_content.sections.forEach((section: any) => {
            contractContent += `\n\n## ${section.title}\n\n`

            let sectionContent = section.content

            // Replace all variables
            Object.keys(variables).forEach(variable => {
                const value = variables[variable] || '[TO BE DETERMINED]'
                sectionContent = sectionContent.replace(new RegExp(variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value)
            })

            contractContent += sectionContent
        })

        // Add signature section
        contractContent += `\n\n## Signatures\n\n`
        contractContent += `**THE BUILDER**\n\n`
        contractContent += `Signature: _________________________\n`
        contractContent += `Name: ${variables['{{BUILDER_NAME}}'] || '_________________________'}\n`
        contractContent += `Date: _________________________\n\n`
        contractContent += `**THE CLIENT**\n\n`
        contractContent += `Signature: _________________________\n`
        contractContent += `Name: ${variables['{{CLIENT_NAME}}'] || '_________________________'}\n`
        contractContent += `Date: _________________________\n`

        // Log the action
        if (projectId) {
            await logAction(supabase, {
                action: 'Contract Generated from Template',
                projectId,
                details: {
                    templateName: template.name,
                    templateId
                }
            })
        }

        return NextResponse.json({
            contract: contractContent,
            templateName: template.name,
            success: true
        })

    } catch (error) {
        console.error('Error generating contract from template:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json(
            {
                error: 'Failed to generate contract from template',
                details: errorMessage
            },
            { status: 500 }
        )
    }
}
