CREATE TABLE capitals (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  country TEXT UNIQUE,
  -- not required in description, but interpreted for experience
  color TEXT DEFAULT 'red'
);

