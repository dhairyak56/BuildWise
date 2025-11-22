-- Insert clause categories
INSERT INTO clause_categories (name, description, icon, sort_order) VALUES
('Payment Terms', 'Clauses related to payment schedules, methods, and terms', 'DollarSign', 1),
('Warranties & Guarantees', 'Warranty periods, guarantees, and quality assurance', 'Shield', 2),
('Indemnification', 'Liability, indemnification, and insurance clauses', 'AlertTriangle', 3),
('Termination', 'Contract termination conditions and procedures', 'XCircle', 4),
('Change Orders', 'Procedures for handling project changes', 'Edit', 5),
('Dispute Resolution', 'Mediation, arbitration, and legal procedures', 'Scale', 6),
('Insurance Requirements', 'Required insurance coverage and certificates', 'FileText', 7),
('Completion & Acceptance', 'Project completion criteria and acceptance procedures', 'CheckCircle', 8),
('Liens & Waivers', 'Lien waivers and release of claims', 'Lock', 9),
('Confidentiality', 'Non-disclosure and confidentiality agreements', 'Eye', 10);

-- Insert sample clause templates for Payment Terms
INSERT INTO clause_templates (category_id, title, content, description, tags, is_public) 
SELECT id, 'Standard Payment Schedule', 
'Payment shall be made according to the following schedule:

1. **Deposit**: [PERCENTAGE]% of the total contract price upon signing
2. **Progress Payments**: [PERCENTAGE]% upon completion of each milestone
3. **Final Payment**: [PERCENTAGE]% upon project completion and acceptance

All payments are due within [NUMBER] days of invoice date. Late payments will incur a fee of [PERCENTAGE]% per month.',
'Standard milestone-based payment schedule',
ARRAY['payment', 'schedule', 'milestone'],
true
FROM clause_categories WHERE name = 'Payment Terms';

INSERT INTO clause_templates (category_id, title, content, description, tags, is_public)
SELECT id, 'Net 30 Payment Terms',
'Payment is due within thirty (30) days of invoice date. Invoices will be issued upon completion of work or monthly, whichever occurs first. Late payments will be subject to a service charge of 1.5% per month (18% per annum) or the maximum rate permitted by law, whichever is less.',
'Standard 30-day payment terms',
ARRAY['payment', 'net30', 'invoice'],
true
FROM clause_categories WHERE name = 'Payment Terms';

INSERT INTO clause_templates (category_id, title, content, description, tags, is_public)
SELECT id, 'Retainage Clause',
'The Client may retain [PERCENTAGE]% of each progress payment as retainage. Retainage shall be released to the Contractor within [NUMBER] days after:

1. Final completion of all work
2. Acceptance by the Client
3. Receipt of all required lien waivers
4. Submission of all required documentation',
'Standard retainage terms for construction projects',
ARRAY['payment', 'retainage', 'holdback'],
true
FROM clause_categories WHERE name = 'Payment Terms';

-- Insert sample clause templates for Warranties
INSERT INTO clause_templates (category_id, title, content, description, tags, is_public)
SELECT id, 'Workmanship Warranty',
'The Contractor warrants that all work performed under this Contract will be:

1. Completed in a professional and workmanlike manner
2. In compliance with all applicable building codes and regulations
3. Free from defects in materials and workmanship for a period of [NUMBER] year(s) from the date of completion

This warranty does not cover damage resulting from normal wear and tear, misuse, or failure to maintain.',
'Standard workmanship warranty',
ARRAY['warranty', 'workmanship', 'quality'],
true
FROM clause_categories WHERE name = 'Warranties & Guarantees';

INSERT INTO clause_templates (category_id, title, content, description, tags, is_public)
SELECT id, 'Materials Warranty',
'All materials supplied by the Contractor shall be new, of good quality, and free from defects. Materials are warranted for a period of [NUMBER] year(s) from installation. Manufacturer warranties, if longer, shall apply and be transferred to the Client.',
'Warranty for materials and supplies',
ARRAY['warranty', 'materials', 'supplies'],
true
FROM clause_categories WHERE name = 'Warranties & Guarantees';

-- Insert sample clause templates for Indemnification
INSERT INTO clause_templates (category_id, title, content, description, tags, is_public)
SELECT id, 'Mutual Indemnification',
'Each party agrees to indemnify, defend, and hold harmless the other party from and against any and all claims, damages, losses, and expenses arising out of or resulting from:

1. The indemnifying party''s negligent acts or omissions
2. Breach of this Contract by the indemnifying party
3. Violation of applicable laws by the indemnifying party

This indemnification shall not apply to claims arising from the sole negligence of the indemnified party.',
'Mutual indemnification clause',
ARRAY['indemnification', 'liability', 'protection'],
true
FROM clause_categories WHERE name = 'Indemnification';

-- Insert sample clause templates for Termination
INSERT INTO clause_templates (category_id, title, content, description, tags, is_public)
SELECT id, 'Termination for Convenience',
'Either party may terminate this Contract for convenience by providing [NUMBER] days written notice to the other party. Upon termination:

1. The Contractor shall stop work immediately
2. The Client shall pay for all work completed to date
3. The Contractor shall return all Client property
4. Both parties shall release each other from further obligations

The Contractor is entitled to payment for work performed through the termination date.',
'Allows either party to terminate with notice',
ARRAY['termination', 'convenience', 'notice'],
true
FROM clause_categories WHERE name = 'Termination';

INSERT INTO clause_templates (category_id, title, content, description, tags, is_public)
SELECT id, 'Termination for Cause',
'Either party may terminate this Contract for cause if the other party:

1. Materially breaches this Contract and fails to cure within [NUMBER] days of written notice
2. Becomes insolvent or files for bankruptcy
3. Abandons the project
4. Fails to comply with applicable laws

Upon termination for cause, the non-breaching party may seek all available legal remedies.',
'Termination due to breach or default',
ARRAY['termination', 'cause', 'breach', 'default'],
true
FROM clause_categories WHERE name = 'Termination';

-- Insert sample clause templates for Change Orders
INSERT INTO clause_templates (category_id, title, content, description, tags, is_public)
SELECT id, 'Change Order Procedure',
'All changes to the scope of work must be documented in a written Change Order signed by both parties. The Change Order shall include:

1. Description of the change
2. Impact on contract price
3. Impact on completion date
4. Any other affected terms

No change shall be effective until a signed Change Order is executed. The Contractor shall not proceed with changes without an approved Change Order.',
'Standard change order process',
ARRAY['change order', 'scope', 'modifications'],
true
FROM clause_categories WHERE name = 'Change Orders';

-- Insert sample clause templates for Dispute Resolution
INSERT INTO clause_templates (category_id, title, content, description, tags, is_public)
SELECT id, 'Mediation and Arbitration',
'Any dispute arising from this Contract shall be resolved as follows:

1. **Negotiation**: The parties shall first attempt to resolve the dispute through good-faith negotiation
2. **Mediation**: If negotiation fails, the parties shall submit to mediation before a mutually agreed mediator
3. **Arbitration**: If mediation fails, the dispute shall be submitted to binding arbitration in accordance with the rules of the American Arbitration Association

The prevailing party shall be entitled to recover reasonable attorney fees and costs.',
'Multi-step dispute resolution process',
ARRAY['dispute', 'mediation', 'arbitration'],
true
FROM clause_categories WHERE name = 'Dispute Resolution';

-- Insert sample clause templates for Insurance
INSERT INTO clause_templates (category_id, title, content, description, tags, is_public)
SELECT id, 'Required Insurance Coverage',
'The Contractor shall maintain the following insurance coverage throughout the term of this Contract:

1. **General Liability**: Minimum $[AMOUNT] per occurrence
2. **Workers Compensation**: As required by state law
3. **Auto Liability**: Minimum $[AMOUNT] combined single limit
4. **Professional Liability**: Minimum $[AMOUNT] (if applicable)

The Contractor shall provide certificates of insurance naming the Client as additional insured prior to commencing work.',
'Required insurance types and amounts',
ARRAY['insurance', 'liability', 'coverage'],
true
FROM clause_categories WHERE name = 'Insurance Requirements';

-- Insert sample clause templates for Completion
INSERT INTO clause_templates (category_id, title, content, description, tags, is_public)
SELECT id, 'Substantial Completion',
'Substantial Completion occurs when:

1. All work is complete except for minor punch list items
2. The project is suitable for its intended use
3. All required inspections have been passed
4. A certificate of occupancy has been issued (if required)

Upon Substantial Completion, the Contractor shall provide a punch list of remaining items to be completed within [NUMBER] days.',
'Definition of substantial completion',
ARRAY['completion', 'substantial', 'punchlist'],
true
FROM clause_categories WHERE name = 'Completion & Acceptance';

-- Insert sample clause templates for Liens
INSERT INTO clause_templates (category_id, title, content, description, tags, is_public)
SELECT id, 'Lien Waiver Requirement',
'Prior to receiving final payment, the Contractor shall provide:

1. Unconditional lien waivers from all subcontractors and suppliers
2. Proof of payment to all parties with lien rights
3. An unconditional final lien waiver from the Contractor

The Client may withhold final payment until all required lien waivers are received.',
'Requirements for lien waivers',
ARRAY['lien', 'waiver', 'release'],
true
FROM clause_categories WHERE name = 'Liens & Waivers';

-- Insert sample clause templates for Confidentiality
INSERT INTO clause_templates (category_id, title, content, description, tags, is_public)
SELECT id, 'Confidentiality Agreement',
'Both parties agree to maintain the confidentiality of all proprietary information disclosed during this Contract, including:

1. Business plans and strategies
2. Financial information
3. Technical specifications
4. Client lists and contacts

This obligation shall survive termination of this Contract for a period of [NUMBER] years. Confidential information does not include information that:

1. Is publicly available
2. Was known prior to disclosure
3. Is independently developed
4. Must be disclosed by law',
'Standard confidentiality and NDA terms',
ARRAY['confidentiality', 'nda', 'proprietary'],
true
FROM clause_categories WHERE name = 'Confidentiality';
