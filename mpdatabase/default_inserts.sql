INSERT INTO profile (name, avatar) VALUES('Classic', 'classic.png'), 
('Super Freak', 'freak.png'),('Fussy','fussy.png'),('Open-Minded','openmind.png'),('Professsional Critic','prof.png');

INSERT INTO user (id, email, username, password, isadmin, profile_id, description, points) VALUES(1,'doceuno.ceo@gmail.com','master', SHA1('satelite'), true, 2, 'Bad Ass Admin!', 1500),
(2,'dexter@dexters-laboratory.com','dexter',SHA1('deedee'), false, 3, null, 0),
(3,'johnny@kingofseduction.com','johnnybravo',SHA1('stoopid'), false, 5, null, 0),
(4,'cactus@powerpuffgirls.com','cactus',SHA1('powerpuff'), false, 5, null, 250);

INSERT INTO reward (id, prize, user_id) VALUES(1, 'Gold', 1),(2, 'Silver', 2);