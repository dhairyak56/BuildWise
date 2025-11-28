-- Create milestones table for project milestones
CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_milestones_project_id ON milestones(project_id);
CREATE INDEX idx_milestones_due_date ON milestones(due_date);
CREATE INDEX idx_milestones_status ON milestones(status);

-- Enable Row Level Security
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view milestones for their projects" ON milestones;
DROP POLICY IF EXISTS "Users can create milestones for their projects" ON milestones;
DROP POLICY IF EXISTS "Users can update milestones for their projects" ON milestones;
DROP POLICY IF EXISTS "Users can delete milestones for their projects" ON milestones;

-- RLS Policies for milestones
CREATE POLICY "Users can view milestones for their projects"
  ON milestones FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = milestones.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create milestones for their projects"
  ON milestones FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = milestones.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update milestones for their projects"
  ON milestones FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = milestones.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete milestones for their projects"
  ON milestones FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = milestones.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Update projects table to ensure we have date fields
ALTER TABLE projects 
  ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE;

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_milestone_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS milestone_updated_at ON milestones;

-- Trigger to update updated_at on milestone changes
CREATE TRIGGER milestone_updated_at
  BEFORE UPDATE ON milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_milestone_updated_at();

-- View to get calendar events (combines projects, milestones, and deadlines)
CREATE OR REPLACE VIEW calendar_events AS
SELECT 
  'project' as event_type,
  p.id as event_id,
  p.name as title,
  NULL::TEXT as description,
  p.start_date as start_date,
  p.end_date as end_date,
  p.status,
  p.user_id,
  NULL::UUID as project_id
FROM projects p
WHERE p.start_date IS NOT NULL OR p.end_date IS NOT NULL

UNION ALL

SELECT 
  'milestone' as event_type,
  m.id as event_id,
  m.title,
  m.description,
  m.due_date as start_date,
  m.due_date as end_date,
  m.status,
  p.user_id,
  m.project_id
FROM milestones m
JOIN projects p ON m.project_id = p.id

UNION ALL

SELECT 
  'payment' as event_type,
  pay.id as event_id,
  'Payment: ' || p.name as title,
  'Payment of $' || pay.amount::text as description,
  pay.payment_date as start_date,
  pay.payment_date as end_date,
  pay.status,
  p.user_id,
  pay.project_id
FROM payments pay
JOIN projects p ON pay.project_id = p.id
WHERE pay.payment_date IS NOT NULL;
