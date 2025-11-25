-- Drop existing table if it exists
DROP TABLE IF EXISTS contract_templates CASCADE;

-- Create contract templates table
CREATE TABLE contract_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- residential, commercial, subcontractor, renovation
    template_content JSONB NOT NULL, -- structured template with sections
    template_variables TEXT[], -- list of variables like {{CLIENT_NAME}}, {{PROJECT_VALUE}}
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_contract_templates_category ON contract_templates(category);

-- Enable RLS
ALTER TABLE contract_templates ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read templates
CREATE POLICY "Anyone can view templates"
    ON contract_templates FOR SELECT
    USING (true);

-- Insert default templates
INSERT INTO contract_templates (name, description, category, template_content, template_variables, is_default) VALUES
(
    'Residential Construction Contract',
    'Standard contract for residential building projects including new homes, extensions, and major renovations',
    'residential',
    '{
        "sections": [
            {
                "title": "Parties",
                "content": "This agreement is made on {{CONTRACT_DATE}} between:\n\nTHE BUILDER: {{BUILDER_NAME}} (ABN: {{BUILDER_ABN}})\nAddress: {{BUILDER_ADDRESS}}\n\nTHE CLIENT: {{CLIENT_NAME}}\nAddress: {{CLIENT_ADDRESS}}"
            },
            {
                "title": "Project Details",
                "content": "The Builder agrees to construct the following works:\n\nProject Name: {{PROJECT_NAME}}\nSite Address: {{SITE_ADDRESS}}\nScope of Work: {{SCOPE_OF_WORK}}\n\nIn accordance with the plans and specifications attached as Schedule A."
            },
            {
                "title": "Contract Sum",
                "content": "The Client agrees to pay the Builder the sum of ${{CONTRACT_VALUE}} (AUD) plus GST for the complete and proper execution of the works.\n\nPayment Schedule:\n- Deposit: {{DEPOSIT_AMOUNT}}% upon signing\n- Progress payments as per attached schedule\n- Final payment upon practical completion\n\nRetention: {{RETENTION_PERCENT}}% to be held for {{DEFECTS_PERIOD}} months"
            },
            {
                "title": "Time for Completion",
                "content": "Commencement Date: {{START_DATE}}\nPractical Completion Date: {{END_DATE}}\n\nLiquidated Damages: ${{LIQUIDATED_DAMAGES}} per day for delays caused by the Builder"
            },
            {
                "title": "Variations",
                "content": "No variation to the works shall be made unless:\na) Requested in writing by the Client\nb) Priced and agreed to in writing by both parties\nc) Documented in a variation order\n\nThe Builder shall not be obliged to carry out any variation until the variation order is signed."
            },
            {
                "title": "Insurance",
                "content": "The Builder warrants that they hold:\n- Public Liability Insurance: Minimum ${{PUBLIC_LIABILITY}} million\n- Contract Works Insurance covering the full value of works\n- Workers Compensation Insurance as required by law\n\nCopies of certificates of currency to be provided upon request."
            },
            {
                "title": "Warranties",
                "content": "The Builder warrants that:\na) All works will be performed in a proper and workmanlike manner\nb) Materials will be new and fit for purpose\nc) Works will comply with all applicable laws and standards\nd) The Builder holds all necessary licenses and permits\n\nDefects Liability Period: {{DEFECTS_PERIOD}} months from practical completion"
            },
            {
                "title": "Dispute Resolution",
                "content": "In the event of a dispute:\n1. The parties will first attempt to resolve through direct negotiation\n2. If unresolved within 14 days, the matter will be referred to mediation\n3. If mediation fails, the dispute may be referred to arbitration or litigation\n\nThis agreement is governed by the laws of {{STATE}}, Australia."
            }
        ]
    }'::jsonb,
    ARRAY['{{CONTRACT_DATE}}', '{{BUILDER_NAME}}', '{{BUILDER_ABN}}', '{{BUILDER_ADDRESS}}', '{{CLIENT_NAME}}', '{{CLIENT_ADDRESS}}', '{{PROJECT_NAME}}', '{{SITE_ADDRESS}}', '{{SCOPE_OF_WORK}}', '{{CONTRACT_VALUE}}', '{{DEPOSIT_AMOUNT}}', '{{RETENTION_PERCENT}}', '{{DEFECTS_PERIOD}}', '{{START_DATE}}', '{{END_DATE}}', '{{LIQUIDATED_DAMAGES}}', '{{PUBLIC_LIABILITY}}', '{{STATE}}'],
    true
),
(
    'Commercial Fitout Agreement',
    'Contract for commercial interior fitout and refurbishment projects',
    'commercial',
    '{
        "sections": [
            {
                "title": "Parties and Premises",
                "content": "This Commercial Fitout Agreement is made on {{CONTRACT_DATE}} between:\n\nTHE CONTRACTOR: {{BUILDER_NAME}} (ABN: {{BUILDER_ABN}})\n\nTHE CLIENT: {{CLIENT_NAME}} (ABN: {{CLIENT_ABN}})\n\nFor fitout works at: {{SITE_ADDRESS}}"
            },
            {
                "title": "Scope of Works",
                "content": "The Contractor shall provide and install:\n\n{{SCOPE_OF_WORK}}\n\nAll works to be completed in accordance with:\n- Approved plans and specifications\n- Building Code of Australia\n- Relevant Australian Standards\n- Local authority requirements"
            },
            {
                "title": "Contract Price and Payment",
                "content": "Total Contract Price: ${{CONTRACT_VALUE}} (AUD) excluding GST\n\nPayment Terms:\n- 30% deposit upon contract signing\n- 40% upon completion of rough-in works\n- 25% upon practical completion\n- 5% retention held for {{DEFECTS_PERIOD}} months\n\nProgress claims to be submitted monthly with supporting documentation."
            },
            {
                "title": "Program and Access",
                "content": "Commencement: {{START_DATE}}\nCompletion: {{END_DATE}}\n\nWorking Hours: {{WORKING_HOURS}}\n\nThe Client shall provide:\n- Access to the premises during working hours\n- Adequate power and water supply\n- Secure storage area for materials\n\nThe Contractor shall:\n- Minimize disruption to Client''s operations\n- Maintain site cleanliness\n- Comply with building security requirements"
            },
            {
                "title": "Variations and Changes",
                "content": "Variation procedures:\n1. All variations must be requested in writing\n2. Contractor to provide written quote within 5 business days\n3. No variation work to commence without written approval\n4. Time and cost impacts to be documented\n\nClient may reject variations that exceed {{VARIATION_LIMIT}}% of contract value."
            },
            {
                "title": "Quality and Standards",
                "content": "All works shall:\n- Meet or exceed industry standards\n- Use materials as specified or approved equivalents\n- Be completed by qualified tradespeople\n- Comply with WHS regulations\n\nInspections and testing as required by relevant authorities to be arranged by Contractor."
            }
        ]
    }'::jsonb,
    ARRAY['{{CONTRACT_DATE}}', '{{BUILDER_NAME}}', '{{BUILDER_ABN}}', '{{CLIENT_NAME}}', '{{CLIENT_ABN}}', '{{SITE_ADDRESS}}', '{{SCOPE_OF_WORK}}', '{{CONTRACT_VALUE}}', '{{DEFECTS_PERIOD}}', '{{START_DATE}}', '{{END_DATE}}', '{{WORKING_HOURS}}', '{{VARIATION_LIMIT}}'],
    true
),
(
    'Renovation & Extension Contract',
    'Specialized contract for home renovation and extension projects',
    'renovation',
    '{
        "sections": [
            {
                "title": "Agreement",
                "content": "Renovation Contract dated {{CONTRACT_DATE}}\n\nBetween: {{BUILDER_NAME}} (The Builder)\nAnd: {{CLIENT_NAME}} (The Owner)\n\nFor renovation and extension works at: {{SITE_ADDRESS}}"
            },
            {
                "title": "Scope of Renovation Works",
                "content": "The Builder shall carry out the following renovation and extension works:\n\n{{SCOPE_OF_WORK}}\n\nExisting Structure: The Builder acknowledges the works involve modifications to an existing structure built circa {{EXISTING_YEAR}}.\n\nDiscoveries: Additional costs arising from unforeseen conditions in existing structure to be handled as variations."
            },
            {
                "title": "Contract Sum and Payments",
                "content": "Total Contract Sum: ${{CONTRACT_VALUE}} (AUD) including GST\n\nPayment Milestones:\n1. Deposit ({{DEPOSIT_AMOUNT}}%): Upon contract signing\n2. Demolition Complete: {{DEMO_PAYMENT}}%\n3. Frame Complete: {{FRAME_PAYMENT}}%\n4. Lock-up Complete: {{LOCKUP_PAYMENT}}%\n5. Practical Completion: {{PC_PAYMENT}}%\n6. Final Payment: {{FINAL_PAYMENT}}% (after defects period)\n\nRetention: {{RETENTION_PERCENT}}% held for {{DEFECTS_PERIOD}} months"
            },
            {
                "title": "Living Arrangements",
                "content": "The Owner acknowledges that:\n- The property {{OCCUPANCY_STATUS}}\n- Dust and noise will be generated during works\n- Access to certain areas will be restricted\n- Utilities may be temporarily interrupted\n\nThe Builder will:\n- Provide reasonable notice of utility interruptions\n- Maintain safe access to occupied areas\n- Minimize disruption where possible\n- Clean work areas daily"
            },
            {
                "title": "Heritage and Compliance",
                "content": "{{HERITAGE_CLAUSE}}\n\nAll works to comply with:\n- Current Building Code of Australia\n- Local planning requirements\n- Heritage restrictions (if applicable)\n- Energy efficiency standards\n\nBuilder responsible for obtaining all necessary permits and approvals."
            },
            {
                "title": "Warranties and Defects",
                "content": "Structural Warranty: {{STRUCTURAL_WARRANTY}} years\nNon-Structural Warranty: {{DEFECTS_PERIOD}} months\n\nThe Builder warrants:\n- Workmanship to industry standards\n- Materials fit for purpose\n- Compliance with building codes\n- Proper integration with existing structure\n\nDefects to be rectified within {{RECTIFICATION_PERIOD}} days of notification."
            }
        ]
    }'::jsonb,
    ARRAY['{{CONTRACT_DATE}}', '{{BUILDER_NAME}}', '{{CLIENT_NAME}}', '{{SITE_ADDRESS}}', '{{SCOPE_OF_WORK}}', '{{EXISTING_YEAR}}', '{{CONTRACT_VALUE}}', '{{DEPOSIT_AMOUNT}}', '{{DEMO_PAYMENT}}', '{{FRAME_PAYMENT}}', '{{LOCKUP_PAYMENT}}', '{{PC_PAYMENT}}', '{{FINAL_PAYMENT}}', '{{RETENTION_PERCENT}}', '{{DEFECTS_PERIOD}}', '{{OCCUPANCY_STATUS}}', '{{HERITAGE_CLAUSE}}', '{{STRUCTURAL_WARRANTY}}', '{{RECTIFICATION_PERIOD}}'],
    true
);
