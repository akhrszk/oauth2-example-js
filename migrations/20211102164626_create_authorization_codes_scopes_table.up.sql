CREATE TABLE IF NOT EXISTS authorization_codes_scopes(
  authorization_code_id INT NOT NULL,
  scope_id INT NOT NULL,
  PRIMARY KEY (authorization_code_id, scope_id),
  FOREIGN KEY (authorization_code_id) REFERENCES authorization_codes(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (scope_id) REFERENCES scopes(id) ON UPDATE CASCADE ON DELETE RESTRICT
);
