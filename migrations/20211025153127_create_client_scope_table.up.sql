CREATE TABLE IF NOT EXISTS client_scope(
  client_id INT NOT NULL,
  scope_id INT NOT NULL,
  PRIMARY KEY (client_id, scope_id)
);
