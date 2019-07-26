INSERT INTO profile (name, avatar) VALUES('Classic', 'classic.png'), 
('Super Freak', 'freak.png'),('Fussy','fussy.png'),('Open-Minded','openmind.png'),('Professsional Critic','prof.png');

INSERT INTO user (id, email, username, password, isadmin, profile_id, description, points) VALUES(1,'doceuno.ceo@gmail.com','master', SHA1('satelite'), true, 2, 'Bad Ass Admin!', 1500),
(2,'dexter@dexters-laboratory.com','dexter',SHA1('deedee'), false, 3, null, 0),
(3,'johnny@kingofseduction.com','johnnybravo',SHA1('stoopid'), false, 5, null, 0),
(4,'cactus@powerpuffgirls.com','cactus',SHA1('powerpuff'), false, 5, null, 250),
(5,'cousin@cowandchicken.com','bonelesschicken',SHA1('boneless'), false, 1, 'Boneless chicken in the house!', 0),
(6,'erase1@erase.com','testuser1',SHA1('satelite'), false, 2, null, 0),
(7,'erase2@erase.com','testuser2',SHA1('satelite'), false, 2, null, 0),
(8,'erase3@erase.com','testuser3',SHA1('satelite'), false, 2, null, 0),
(9,'erase4@erase.com','testuser4',SHA1('satelite'), false, 2, null, 0),


INSERT INTO review (id,film_id, user_id, title, content, rating, modifiedby) VALUES(1,420818, 1, 'Muy bonita y bien hecha', 'La película simplemente me fascinó, podría enumerar un montón de factores pero estoy haciendo pruebas para mi app', 5, null),
(2,420818, 2, 'No me gustó nada!', 'Echo de menos los dibujos animados y soy un crítico bastante exigente así que lo siento, pero no me gusta!', 2, null),
(3,420818, 3, 'Si pero no!', 'La verdad es que no se muy bien qué opinar porque el factor nostalgia es fundamental para mí y me quedo con la de dibujos sin pensarmelo mucho', 3, 1),
(4,613473, 5, 'Maravillosa y espectacular','Me ha parecido muy buena, la verdad, tengo poco más que añadir aunque esto deberían ser críticas extensas',5,5),
(5,613473, 1, 'Volvería a verla sin duda','Cumplió las espectativas, críticas aún sosas',4,null);


INSERT INTO comment (id, user_id, review_id, content) VALUES(1, 1, 1, 'Me parece útil esta crítica'),
(2,5,1,'No se yo...'),(3,5,2, 'A mí si me gustó!'), (4, 1, 5, 'Comentario por defecto para test'), (5, 4, 5, 'Por defecto comento');

INSERT INTO reward (id, prize, user_id) VALUES(1, 'Gold', 1),(2, 'Silver', 2);