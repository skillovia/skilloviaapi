CREATE TABLE wallet (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  balance BIGINT DEFAULT 0, -- store in the smallest unit: pence (e.g. 10000 = £100.00)
  currency VARCHAR(10) DEFAULT 'gbp',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
