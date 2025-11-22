// Pre-built contract templates for BuildWise

export interface ContractTemplate {
    name: string
    description: string
    category: string
    template_content: string
    is_default: boolean
}

export const DEFAULT_TEMPLATES: ContractTemplate[] = [
    {
        name: "Residential Construction Contract",
        description: "Standard contract for residential construction projects",
        category: "Residential",
        is_default: true,
        template_content: `# RESIDENTIAL CONSTRUCTION CONTRACT

**Contract Date:** {{contract_date}}
**Project Name:** {{project_name}}

## PARTIES

**Contractor:**
{{contractor_name}}
{{contractor_address}}
ABN: {{contractor_abn}}

**Client:**
{{client_name}}
{{client_address}}

## PROJECT DETAILS

**Project Address:** {{project_address}}
**Scope of Work:** {{scope_of_work}}

## FINANCIAL TERMS

**Contract Value:** \${{contract_value}}
**Payment Schedule:**
{{payment_schedule}}

**Payment Terms:** Payment is due within 14 days of invoice date.

## PROJECT TIMELINE

**Commencement Date:** {{start_date}}
**Completion Date:** {{end_date}}

## SCOPE OF WORK

The Contractor agrees to perform the following work:

{{detailed_scope}}

## MATERIALS AND WORKMANSHIP

1. All materials shall be new and of good quality
2. Work shall be performed in a professional and workmanlike manner
3. Work shall comply with all applicable building codes and regulations

## CHANGES AND VARIATIONS

Any changes to the scope of work must be agreed upon in writing by both parties. Additional costs will be documented in a variation order.

## WARRANTIES

The Contractor warrants that:
- All work will be free from defects for a period of 12 months
- All work will comply with relevant building standards
- All materials used will be fit for purpose

## INSURANCE

The Contractor maintains:
- Public Liability Insurance: \${{insurance_amount}}
- Workers Compensation Insurance (where applicable)

## TERMINATION

Either party may terminate this contract with 14 days written notice if:
- The other party breaches a material term of this contract
- The other party becomes insolvent

## DISPUTE RESOLUTION

Any disputes shall be resolved through:
1. Good faith negotiation
2. Mediation (if negotiation fails)
3. Legal proceedings (as a last resort)

## SIGNATURES

**Contractor:**
Signature: _________________
Name: {{contractor_name}}
Date: _________________

**Client:**
Signature: _________________
Name: {{client_name}}
Date: _________________

---
*This contract is governed by the laws of Australia*`
    },
    {
        name: "Commercial Construction Contract",
        description: "Contract template for commercial building projects",
        category: "Commercial",
        is_default: true,
        template_content: `# COMMERCIAL CONSTRUCTION CONTRACT

**Contract Number:** {{contract_number}}
**Date:** {{contract_date}}

## PARTIES

**Contractor:**
{{contractor_name}}
{{contractor_address}}
ABN: {{contractor_abn}}
License: {{contractor_license}}

**Client:**
{{client_name}}
{{client_address}}
ABN: {{client_abn}}

## PROJECT INFORMATION

**Project Name:** {{project_name}}
**Site Address:** {{project_address}}
**Project Type:** {{job_type}}

## CONTRACT SUM

**Total Contract Value:** \${{contract_value}} (excluding GST)
**GST Amount:** \${{gst_amount}}
**Total Including GST:** \${{total_with_gst}}

## PAYMENT TERMS

{{payment_schedule}}

**Progress Claims:** Monthly, based on work completed
**Retention:** {{retention_percentage}}% held until practical completion
**Payment Period:** 30 days from date of invoice

## PROJECT TIMELINE

**Commencement Date:** {{start_date}}
**Practical Completion Date:** {{end_date}}
**Liquidated Damages:** \${{liquidated_damages}} per day for delays

## SCOPE OF WORKS

The Contractor shall provide all labor, materials, equipment, and services necessary to complete:

{{detailed_scope}}

## SPECIFICATIONS

All work shall be completed in accordance with:
- Architectural drawings dated {{drawing_date}}
- Engineering specifications
- Australian Building Codes
- Relevant Australian Standards

## SITE MANAGEMENT

**Site Manager:** {{site_manager}}
**Working Hours:** {{working_hours}}
**Site Access:** {{site_access_details}}

## INSURANCE REQUIREMENTS

The Contractor shall maintain:
- Public Liability Insurance: Minimum \${{public_liability_amount}}
- Contract Works Insurance: Full replacement value
- Workers Compensation Insurance

## QUALITY ASSURANCE

- All work subject to inspection and approval
- Defects liability period: {{defects_period}} months
- Regular progress meetings: {{meeting_frequency}}

## VARIATIONS

- All variations must be approved in writing
- Variation orders to include cost and time implications
- No work on variations without written approval

## HEALTH AND SAFETY

The Contractor shall:
- Maintain a safe work environment
- Comply with all WHS regulations
- Provide SWMS for high-risk activities
- Conduct regular safety inspections

## COMPLETION AND HANDOVER

Upon practical completion:
- Defects list to be prepared
- Final inspection conducted
- As-built documentation provided
- Warranties and manuals delivered

## TERMINATION

Grounds for termination include:
- Material breach of contract
- Insolvency
- Suspension of work for {{suspension_period}} days
- Failure to maintain insurance

## DISPUTE RESOLUTION

1. Direct negotiation between parties
2. Mediation by agreed mediator
3. Arbitration or legal proceedings

## GENERAL CONDITIONS

This contract is subject to the General Conditions of Contract for {{contract_standard}}.

## SIGNATURES

**For the Contractor:**
Signature: _________________
Name: {{contractor_name}}
Position: {{contractor_position}}
Date: _________________

**For the Client:**
Signature: _________________
Name: {{client_name}}
Position: {{client_position}}
Date: _________________

---
*This contract is governed by the laws of {{jurisdiction}}*`
    },
    {
        name: "Renovation Contract",
        description: "Contract for home renovation and remodeling projects",
        category: "Renovation",
        is_default: true,
        template_content: `# HOME RENOVATION CONTRACT

**Date:** {{contract_date}}
**Project:** {{project_name}}

## CONTRACTOR DETAILS

**Company:** {{contractor_name}}
**Address:** {{contractor_address}}
**Phone:** {{contractor_phone}}
**Email:** {{contractor_email}}
**License:** {{contractor_license}}

## HOMEOWNER DETAILS

**Name:** {{client_name}}
**Property Address:** {{project_address}}
**Phone:** {{client_phone}}
**Email:** {{client_email}}

## RENOVATION SCOPE

**Areas to be Renovated:**
{{renovation_areas}}

**Work to be Performed:**
{{detailed_scope}}

## PRICING

**Total Contract Price:** \${{contract_value}}

**Breakdown:**
{{cost_breakdown}}

**Payment Schedule:**
{{payment_schedule}}

## PROJECT SCHEDULE

**Start Date:** {{start_date}}
**Estimated Completion:** {{end_date}}
**Working Days:** {{working_days}}
**Working Hours:** {{working_hours}}

## MATERIALS

**Materials Supplied by Contractor:**
{{contractor_materials}}

**Materials Supplied by Homeowner:**
{{homeowner_materials}}

**Allowances:**
{{allowances}}

## PERMITS AND APPROVALS

The Contractor will obtain all necessary:
- Building permits
- Council approvals
- Compliance certificates

## SITE CONDITIONS

**Access:** {{site_access}}
**Parking:** {{parking_arrangements}}
**Utilities:** {{utilities_access}}
**Waste Disposal:** Contractor responsible for all construction waste

## HOMEOWNER RESPONSIBILITIES

The Homeowner agrees to:
- Provide clear access to work areas
- Remove personal items from work areas
- Vacate premises if required for safety
- Make timely decisions on selections

## PROTECTION AND CLEANUP

The Contractor will:
- Protect existing finishes and furnishings
- Clean work area daily
- Perform final cleanup upon completion
- Remove all construction debris

## CHANGES AND EXTRAS

- All changes must be approved in writing
- Change orders will detail cost and time impact
- Payment for extras due before work commences

## WARRANTIES

**Workmanship Warranty:** {{warranty_period}} months
**Materials Warranty:** As per manufacturer specifications

The Contractor warrants that all work will be:
- Completed in a professional manner
- Free from defects in workmanship
- Compliant with building codes

## DELAYS

The Contractor is not responsible for delays caused by:
- Weather conditions
- Material delivery delays
- Changes requested by Homeowner
- Unforeseen conditions

## INSURANCE

The Contractor maintains:
- Public Liability Insurance: \${{insurance_amount}}
- Workers Compensation Insurance

## TERMINATION

Either party may terminate with {{termination_notice}} days written notice.

Upon termination:
- Payment for work completed to date
- Return of any unused materials
- Site left in safe condition

## DISPUTE RESOLUTION

Disputes will be resolved through:
1. Direct discussion
2. Mediation
3. Legal proceedings if necessary

## ADDITIONAL TERMS

{{additional_terms}}

## ACCEPTANCE

By signing below, both parties agree to the terms and conditions outlined in this contract.

**Contractor:**
Signature: _________________
Name: {{contractor_name}}
Date: _________________

**Homeowner:**
Signature: _________________
Name: {{client_name}}
Date: _________________

---
*This contract represents the entire agreement between the parties*`
    },
    {
        name: "Subcontractor Agreement",
        description: "Agreement for engaging subcontractors on projects",
        category: "Subcontractor",
        is_default: true,
        template_content: `# SUBCONTRACTOR AGREEMENT

**Agreement Date:** {{contract_date}}
**Project:** {{project_name}}

## PRINCIPAL CONTRACTOR

**Company:** {{contractor_name}}
**ABN:** {{contractor_abn}}
**Address:** {{contractor_address}}
**Contact:** {{contractor_contact}}

## SUBCONTRACTOR

**Company:** {{subcontractor_name}}
**ABN:** {{subcontractor_abn}}
**License:** {{subcontractor_license}}
**Address:** {{subcontractor_address}}
**Contact:** {{subcontractor_contact}}

## PROJECT DETAILS

**Project Name:** {{project_name}}
**Site Address:** {{project_address}}
**Client:** {{client_name}}

## SCOPE OF SUBCONTRACT WORKS

The Subcontractor shall perform the following works:

{{scope_of_work}}

**Specifications:** As per drawings and specifications dated {{spec_date}}

## CONTRACT VALUE

**Subcontract Sum:** \${{contract_value}} (excluding GST)
**GST:** \${{gst_amount}}
**Total:** \${{total_with_gst}}

## PAYMENT TERMS

{{payment_schedule}}

**Payment Claims:** {{claim_frequency}}
**Payment Period:** {{payment_days}} days from approved claim
**Retention:** {{retention_percentage}}% until practical completion

## PROGRAM

**Commencement Date:** {{start_date}}
**Completion Date:** {{end_date}}
**Working Hours:** {{working_hours}}

## SUBCONTRACTOR OBLIGATIONS

The Subcontractor shall:
- Provide all labor, materials, and equipment
- Complete works in a professional manner
- Comply with all site rules and procedures
- Attend site meetings as required
- Maintain site cleanliness in work areas

## INSURANCE

The Subcontractor must maintain:
- Public Liability Insurance: Minimum \${{public_liability}}
- Workers Compensation Insurance
- Professional Indemnity (if applicable)

Proof of insurance must be provided before commencing work.

## SAFETY REQUIREMENTS

The Subcontractor must:
- Comply with all WHS legislation
- Provide SWMS for high-risk work
- Attend site inductions
- Use appropriate PPE
- Report all incidents immediately

## QUALITY STANDARDS

All work must:
- Meet Australian Standards
- Comply with building codes
- Be subject to inspection
- Be rectified if defective

## VARIATIONS

- Variations must be approved in writing
- Variation claims must include supporting documentation
- No payment for unauthorized variations

## DEFECTS LIABILITY

**Defects Period:** {{defects_period}} months from practical completion

The Subcontractor must rectify all defects within {{rectification_days}} days of notification.

## SITE CONDITIONS

**Site Access:** {{site_access}}
**Facilities:** {{site_facilities}}
**Parking:** {{parking}}
**Storage:** {{storage_arrangements}}

## COORDINATION

The Subcontractor must:
- Coordinate with other trades
- Attend coordination meetings
- Provide progress updates
- Notify of any delays immediately

## MATERIALS AND EQUIPMENT

**Materials:** {{materials_responsibility}}
**Equipment:** {{equipment_responsibility}}
**Samples:** To be submitted for approval before procurement

## DOCUMENTATION

The Subcontractor must provide:
- Method statements
- Material certificates
- Test results
- As-built drawings
- Warranties and manuals

## SUSPENSION AND TERMINATION

The Principal may suspend or terminate if:
- Subcontractor breaches contract
- Work quality is unsatisfactory
- Safety violations occur
- Insolvency occurs

## INDEMNITY

The Subcontractor indemnifies the Principal against:
- Claims arising from Subcontractor's work
- Damage to property
- Personal injury
- Breach of statutory obligations

## CONFIDENTIALITY

The Subcontractor must maintain confidentiality of:
- Project information
- Client details
- Commercial terms

## GENERAL CONDITIONS

This agreement is subject to {{general_conditions}}.

## SIGNATURES

**Principal Contractor:**
Signature: _________________
Name: {{contractor_name}}
Position: {{contractor_position}}
Date: _________________

**Subcontractor:**
Signature: _________________
Name: {{subcontractor_name}}
Position: {{subcontractor_position}}
Date: _________________

---
*This agreement is governed by the laws of {{jurisdiction}}*`
    },
    {
        name: "Maintenance Contract",
        description: "Ongoing maintenance services agreement",
        category: "Maintenance",
        is_default: true,
        template_content: `# MAINTENANCE SERVICES CONTRACT

**Contract Date:** {{contract_date}}
**Contract Period:** {{contract_period}}

## SERVICE PROVIDER

**Company:** {{contractor_name}}
**ABN:** {{contractor_abn}}
**Address:** {{contractor_address}}
**Phone:** {{contractor_phone}}
**Email:** {{contractor_email}}

## CLIENT

**Name:** {{client_name}}
**Property Address:** {{project_address}}
**Phone:** {{client_phone}}
**Email:** {{client_email}}

## SERVICES COVERED

This maintenance contract covers:

{{services_list}}

## SERVICE SCHEDULE

**Regular Maintenance Visits:** {{visit_frequency}}
**Visit Duration:** {{visit_duration}}
**Preferred Days:** {{preferred_days}}
**Time:** {{preferred_time}}

## PRICING

**Monthly Fee:** \${{monthly_fee}}
**Annual Contract Value:** \${{annual_value}}

**Payment Terms:** {{payment_terms}}

**Services Included in Monthly Fee:**
{{included_services}}

**Additional Services (Charged Separately):**
{{additional_services}}

## RESPONSE TIMES

**Emergency Callout:** {{emergency_response}} hours
**Urgent Repairs:** {{urgent_response}} hours
**Standard Maintenance:** {{standard_response}} business days

**Emergency Contact:** {{emergency_contact}}

## SCOPE OF MAINTENANCE

**Preventive Maintenance:**
{{preventive_maintenance}}

**Inspections:**
{{inspection_schedule}}

**Reporting:**
{{reporting_requirements}}

## EXCLUSIONS

This contract does not cover:
{{exclusions}}

## PARTS AND MATERIALS

**Parts Supply:** {{parts_responsibility}}
**Material Costs:** {{material_costs}}
**Markup:** {{markup_percentage}}%

## CONTRACTOR RESPONSIBILITIES

The Service Provider will:
- Perform scheduled maintenance
- Respond to service calls within specified timeframes
- Provide qualified technicians
- Supply all necessary tools and equipment
- Maintain service records
- Provide monthly reports

## CLIENT RESPONSIBILITIES

The Client will:
- Provide access to property
- Report issues promptly
- Make timely payments
- Maintain property in reasonable condition

## TERM AND RENEWAL

**Initial Term:** {{initial_term}}
**Renewal:** Automatic annual renewal unless {{notice_period}} days notice given
**Price Review:** Annual review on anniversary date

## TERMINATION

Either party may terminate with {{termination_notice}} days written notice.

**Early Termination Fee:** {{early_termination_fee}}

## WARRANTIES

**Workmanship Warranty:** {{warranty_period}} months
**Parts Warranty:** As per manufacturer

## INSURANCE

The Service Provider maintains:
- Public Liability Insurance: \${{insurance_amount}}
- Professional Indemnity Insurance
- Workers Compensation Insurance

## LIMITATION OF LIABILITY

The Service Provider's liability is limited to:
- Re-performance of defective work
- Maximum of annual contract value

## FORCE MAJEURE

Neither party liable for delays due to circumstances beyond reasonable control.

## PRIVACY

Both parties agree to comply with Privacy Act requirements.

## DISPUTE RESOLUTION

Disputes will be resolved through:
1. Direct negotiation
2. Mediation
3. Legal proceedings

## SPECIAL CONDITIONS

{{special_conditions}}

## SIGNATURES

**Service Provider:**
Signature: _________________
Name: {{contractor_name}}
Date: _________________

**Client:**
Signature: _________________
Name: {{client_name}}
Date: _________________

---
*This contract is governed by the laws of {{jurisdiction}}*`
    }
]

// Helper function to populate template with project data
export function populateTemplate(templateContent: string, data: Record<string, unknown>): string {
    let populated = templateContent

    // Replace all {{variable}} placeholders with actual data
    Object.keys(data).forEach(key => {
        const value = data[key]
        populated = populated.replace(
            new RegExp(`{{${key}}}`, 'g'),
            String(value ?? '')
        )
    })

    // Remove any remaining unpopulated placeholders
    populated = populated.replace(/{{[^}]+}}/g, '[To be completed]')

    return populated
}

// Helper function to extract variables from template
export function extractTemplateVariables(template: string): string[] {
    const matches = template.match(/{{([^}]+)}}/g) || []
    return matches.map(match => match.replace(/{{|}}/g, ''))
}
