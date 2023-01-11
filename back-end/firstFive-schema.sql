CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  contact_num TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  type_of_user TEXT NOT NULL,
  bio TEXT
);

CREATE TABLE company_requests (
  request_id SERIAL PRIMARY KEY,
  co_username TEXT NOT NULL
    REFERENCES users ON DELETE CASCADE, 
  project_desc TEXT NOT NULL,
  timeframe TEXT NOT NULL,
  searching_for_professional TEXT NOT NULL
);


CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  message_from TEXT NOT NULL REFERENCES users ON DELETE CASCADE,
  message_to TEXT NOT NULL REFERENCES users ON DELETE CASCADE
);

CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  from_username TEXT NOT NULL REFERENCES users ON DELETE CASCADE,
  to_username TEXT NOT NULL REFERENCES users ON DELETE CASCADE,
  body text NOT NULL,
  sent_at timestamp with time zone NOT NULL,
  read_at timestamp with time zone
);
