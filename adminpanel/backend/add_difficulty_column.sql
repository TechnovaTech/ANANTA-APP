-- Add difficulty column to host_tasks table
ALTER TABLE host_tasks ADD COLUMN difficulty VARCHAR(50) NOT NULL DEFAULT 'Easy';

-- Add difficulty column to viewer_tasks table  
ALTER TABLE viewer_tasks ADD COLUMN difficulty VARCHAR(50) NOT NULL DEFAULT 'Easy';