-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ancestry segments table
CREATE TABLE IF NOT EXISTS ancestry_segments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ancestry TEXT NOT NULL,
  copy_number INTEGER NOT NULL,
  chromosome TEXT NOT NULL,
  start_point BIGINT NOT NULL,
  end_point BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes for performance
  INDEX idx_user_ancestry ON ancestry_segments(user_id, ancestry),
  INDEX idx_chromosome ON ancestry_segments(chromosome)
);

-- Ancestry insights table
CREATE TABLE IF NOT EXISTS ancestry_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ancestry TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  chromosome TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Full text search
  search_vector TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('english', title || ' ' || description)
  ) STORED,
  
  INDEX idx_search_vector ON ancestry_insights USING GIN(search_vector),
  INDEX idx_user_insights ON ancestry_insights(user_id)
);

-- Search history table
CREATE TABLE IF NOT EXISTS search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  ancestry_context TEXT,
  results JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_user_searches ON search_history(user_id, created_at DESC)
);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ancestry_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ancestry_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own ancestry segments" ON ancestry_segments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own insights" ON ancestry_insights
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own search history" ON search_history
  FOR ALL USING (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();