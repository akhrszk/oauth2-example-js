CREATE TABLE IF NOT EXISTS redirect_uris(
  id INT NOT NULL AUTO_INCREMENT,
  app_id INT NOT NULL,
  uri VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE INDEX (app_id, uri),
  FOREIGN KEY (app_id) REFERENCES apps(id) ON UPDATE CASCADE ON DELETE RESTRICT
);
