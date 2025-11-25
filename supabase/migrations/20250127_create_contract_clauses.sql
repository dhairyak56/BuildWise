-- Drop existing table if it exists
DROP TABLE IF EXISTS contract_clauses CASCADE;

-- Create contract clauses table
CREATE TABLE contract_clauses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    description TEXT,
    is_required BOOLEAN DEFAULT false,
    applicable_to TEXT[], -- residential, commercial, renovation, subcontractor
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_contract_clauses_category ON contract_clauses(category);
CREATE INDEX idx_contract_clauses_applicable_to ON contract_clauses USING GIN(applicable_to);

-- Enable RLS
ALTER TABLE contract_clauses ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read clauses
CREATE POLICY "Anyone can view clauses"
    ON contract_clauses FOR SELECT
    USING (true);

-- Insert default clauses

-- PAYMENT TERMS CLAUSES
INSERT INTO contract_clauses (title, category, content, description, is_required, applicable_to) VALUES
(
    'Progress Payment Schedule',
    'payment',
    'The Client shall pay the Builder according to the following schedule:

1. Deposit: [DEPOSIT_PERCENT]% upon signing this agreement
2. Base Stage: [BASE_PERCENT]% upon completion of base/slab
3. Frame Stage: [FRAME_PERCENT]% upon completion of frame
4. Lock-up Stage: [LOCKUP_PERCENT]% upon lock-up (windows and doors installed)
5. Fixing Stage: [FIXING_PERCENT]% upon completion of internal fixing
6. Practical Completion: [PC_PERCENT]% upon practical completion
7. Final Payment: [FINAL_PERCENT]% upon final completion and defects rectification

Each progress payment shall be made within [PAYMENT_DAYS] days of the Builder submitting a valid progress claim.',
    'Standard residential construction progress payment schedule',
    true,
    ARRAY['residential', 'renovation']
),
(
    'Retention Amount',
    'payment',
    'The Client may retain [RETENTION_PERCENT]% of each progress payment as security for the proper performance of the works. The retention amount shall be:

a) Held in a separate account (if required by law)
b) Released [RETENTION_RELEASE_PERCENT]% upon practical completion
c) Released [RETENTION_FINAL_PERCENT]% upon final completion and expiry of the defects liability period

Interest on retention (if applicable) shall be [RETENTION_INTEREST].',
    'Retention amount terms for security',
    false,
    ARRAY['residential', 'commercial', 'renovation']
),
(
    'Late Payment Interest',
    'payment',
    'If the Client fails to make any payment by the due date, the Builder may:

a) Suspend works until payment is received
b) Charge interest on overdue amounts at [INTEREST_RATE]% per annum
c) Recover all costs associated with debt collection

The Builder shall provide [NOTICE_DAYS] days written notice before suspending works for non-payment.',
    'Consequences and interest for late payments',
    false,
    ARRAY['residential', 'commercial', 'renovation', 'subcontractor']
);

-- WARRANTY CLAUSES
INSERT INTO contract_clauses (title, category, content, description, is_required, applicable_to) VALUES
(
    'Workmanship Warranty',
    'warranty',
    'The Builder warrants that:

a) All works will be performed in a proper and workmanlike manner
b) Works will be carried out with reasonable care and skill
c) Works will comply with all applicable laws, codes, and standards
d) Materials used will be new (unless otherwise specified) and fit for their intended purpose
e) Works will be free from defects in workmanship and materials

This warranty shall remain in effect for [WARRANTY_PERIOD] from the date of practical completion.',
    'General workmanship and materials warranty',
    true,
    ARRAY['residential', 'commercial', 'renovation', 'subcontractor']
),
(
    'Structural Warranty',
    'warranty',
    'The Builder provides a structural warranty for [STRUCTURAL_WARRANTY_YEARS] years from practical completion, warranting that:

a) The structural elements of the building are free from major defects
b) The building is structurally sound and fit for habitation/use
c) The structure complies with the Building Code of Australia

Major structural defects include defects that:
- Cause the building to be uninhabitable or unusable
- Threaten the physical safety of occupants
- Result in the building being likely to collapse

This warranty is in addition to any statutory warranties required by law.',
    'Long-term structural warranty',
    true,
    ARRAY['residential', 'commercial']
),
(
    'Defects Liability Period',
    'warranty',
    'A defects liability period of [DEFECTS_PERIOD] months shall apply from the date of practical completion.

During this period, the Builder shall:
a) Rectify any defects notified by the Client within [RECTIFICATION_DAYS] days
b) Make good any damage caused during rectification works
c) Maintain appropriate insurance coverage

The Client shall:
a) Notify the Builder in writing of any defects discovered
b) Allow reasonable access for inspection and rectification
c) Not carry out rectification works themselves without written consent

At the end of the defects liability period, a final inspection shall be conducted.',
    'Defects liability period terms',
    true,
    ARRAY['residential', 'commercial', 'renovation']
);

-- INSURANCE CLAUSES
INSERT INTO contract_clauses (title, category, content, description, is_required, applicable_to) VALUES
(
    'Builder Insurance Requirements',
    'insurance',
    'The Builder warrants that they hold and will maintain for the duration of the works:

a) Public Liability Insurance: Minimum $[PUBLIC_LIABILITY_AMOUNT] million
b) Contract Works Insurance: Covering the full replacement value of the works
c) Workers Compensation Insurance: As required by applicable state/territory legislation
d) Professional Indemnity Insurance: $[PI_AMOUNT] million (if applicable)

The Builder shall provide certificates of currency upon request and notify the Client immediately if any policy is cancelled or not renewed.',
    'Required insurance coverage for builder',
    true,
    ARRAY['residential', 'commercial', 'renovation', 'subcontractor']
),
(
    'Home Warranty Insurance',
    'insurance',
    'The Builder shall obtain and provide to the Client a Home Warranty Insurance policy (also known as Home Building Compensation) as required by [STATE] legislation.

This insurance shall:
a) Cover the contract value of $[CONTRACT_VALUE]
b) Provide coverage for [HWI_PERIOD] years from completion
c) Protect against incomplete works, defective works, and builder insolvency
d) Be provided before any deposit is paid or works commence

A copy of the insurance certificate shall be attached to this contract.',
    'Mandatory home warranty insurance (residential)',
    true,
    ARRAY['residential', 'renovation']
);

-- TERMINATION CLAUSES
INSERT INTO contract_clauses (title, category, content, description, is_required, applicable_to) VALUES
(
    'Termination for Default',
    'termination',
    'Either party may terminate this contract if the other party:

a) Fails to comply with a material term of this contract
b) Becomes insolvent or bankrupt
c) Abandons the works (Builder only)
d) Persistently fails to supply adequate materials or labor (Builder only)
e) Fails to make payment when due (Client only)

Before terminating, the non-defaulting party must:
1. Provide written notice specifying the default
2. Allow [CURE_PERIOD] days for the default to be remedied
3. If not remedied, provide written notice of termination

Upon termination for default, the defaulting party shall be liable for all costs and damages incurred.',
    'Termination rights for breach of contract',
    true,
    ARRAY['residential', 'commercial', 'renovation', 'subcontractor']
),
(
    'Termination for Convenience',
    'termination',
    'The Client may terminate this contract for convenience at any time by providing [NOTICE_DAYS] days written notice to the Builder.

Upon termination for convenience, the Client shall pay:
a) All amounts due for works completed to the date of termination
b) The reasonable cost of materials ordered but not yet delivered
c) A termination fee of [TERMINATION_FEE_PERCENT]% of the remaining contract value
d) All reasonable costs incurred by the Builder as a result of termination

The Builder shall:
a) Cease works immediately upon receiving notice (unless otherwise directed)
b) Remove all equipment and materials from site
c) Provide all documentation and warranties for completed works',
    'Client right to terminate without cause',
    false,
    ARRAY['residential', 'commercial', 'renovation']
);

-- VARIATION CLAUSES
INSERT INTO contract_clauses (title, category, content, description, is_required, applicable_to) VALUES
(
    'Variation Procedure',
    'variation',
    'No variation to the works shall be made unless:

a) Requested in writing by the Client
b) Priced by the Builder and agreed in writing by both parties
c) Documented in a formal variation order signed by both parties

Each variation order shall specify:
- Description of the varied works
- Effect on contract price (addition or deduction)
- Effect on completion date (if any)
- Any other relevant terms

The Builder shall not be obliged to carry out any variation until a signed variation order is received.

Variations exceeding [VARIATION_THRESHOLD]% of the original contract value may require additional approvals.',
    'Formal process for contract variations',
    true,
    ARRAY['residential', 'commercial', 'renovation', 'subcontractor']
),
(
    'Variation Pricing',
    'variation',
    'Variations shall be priced using the following methodology:

a) For additional works: Cost plus [MARGIN_PERCENT]% margin
b) For omitted works: Actual cost saved less [ADMIN_FEE_PERCENT]% administration fee
c) For substituted works: Difference between original and new work

Cost shall include:
- Labor at [LABOR_RATE] per hour
- Materials at invoice cost plus [MATERIALS_MARKUP]%
- Plant and equipment at reasonable hire rates
- Subcontractor costs plus [SUBCONTRACTOR_MARGIN]%

All variation quotes shall be provided within [QUOTE_DAYS] business days of request.',
    'How variations are priced and calculated',
    false,
    ARRAY['residential', 'commercial', 'renovation', 'subcontractor']
);

-- DISPUTE RESOLUTION CLAUSES
INSERT INTO contract_clauses (title, category, content, description, is_required, applicable_to) VALUES
(
    'Dispute Resolution Process',
    'dispute',
    'In the event of any dispute arising under this contract, the parties agree to:

1. NEGOTIATION: First attempt to resolve the dispute through direct negotiation between senior representatives within [NEGOTIATION_DAYS] days

2. MEDIATION: If negotiation fails, refer the dispute to mediation conducted by:
   - A mediator agreed by both parties, or
   - A mediator appointed by [MEDIATION_BODY]
   - Each party to bear their own costs and share mediator costs equally

3. EXPERT DETERMINATION: For technical disputes, either party may request determination by an independent expert in the relevant field

4. ARBITRATION OR LITIGATION: If the above processes fail, the dispute may be referred to:
   - Arbitration under [ARBITRATION_RULES], or
   - The courts of [JURISDICTION]

During dispute resolution, both parties shall continue to perform their obligations under this contract unless otherwise agreed.',
    'Multi-step dispute resolution process',
    true,
    ARRAY['residential', 'commercial', 'renovation', 'subcontractor']
);

-- TIME EXTENSION CLAUSES
INSERT INTO contract_clauses (title, category, content, description, is_required, applicable_to) VALUES
(
    'Extension of Time',
    'time',
    'The Builder shall be entitled to an extension of time for completion if delayed by:

a) Variations ordered by the Client
b) Inclement weather beyond normal seasonal expectations
c) Industrial disputes not specific to the Builder
d) Delays caused by the Client or Client''s consultants
e) Delays by authorities in providing approvals
f) Force majeure events
g) Discovery of unforeseen site conditions
h) Suspension of works by the Client

To claim an extension of time, the Builder must:
1. Notify the Client in writing within [EOT_NOTICE_DAYS] days of becoming aware of the delay
2. Provide details of the cause and estimated delay period
3. Demonstrate reasonable efforts to mitigate the delay

The Client shall assess the claim and grant a fair and reasonable extension within [EOT_ASSESSMENT_DAYS] days.',
    'Grounds and process for time extensions',
    true,
    ARRAY['residential', 'commercial', 'renovation']
),
(
    'Liquidated Damages',
    'time',
    'If the Builder fails to achieve practical completion by the completion date (as extended), the Client may deduct liquidated damages of $[LD_AMOUNT] per [LD_PERIOD] for each [LD_PERIOD] of delay, up to a maximum of [LD_MAX_PERCENT]% of the contract value.

Liquidated damages:
a) Are not a penalty but a genuine pre-estimate of loss
b) May be deducted from any monies due to the Builder
c) Do not limit the Client''s right to terminate for persistent delay
d) Shall cease to accrue upon practical completion

The Builder shall not be liable for liquidated damages if the delay is caused by the Client or events entitling the Builder to an extension of time.',
    'Damages for late completion',
    false,
    ARRAY['residential', 'commercial', 'renovation']
);
