CREATE DATABASE moviepunisher;

USE moviepunisher;

CREATE USER 'mpclient'@'localhost' IDENTIFIED WITH mysql_native_password BY 'mpclientpass';

GRANT ALL PRIVILEGES ON moviepunisher.* TO 'mpclient'@'localhost';

CREATE TABLE profile (
	id TINYINT NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(40) NOT NULL,
	avatar VARCHAR(200) NULL,
	CONSTRAINT PK_profile PRIMARY KEY (id),
	CONSTRAINT UQ_name UNIQUE (name)
);

CREATE TABLE user (
	id INT NOT NULL AUTO_INCREMENT,
	email VARCHAR(120) NOT NULL,
	username VARCHAR(50) NOT NULL,
	`password` VARCHAR(200) NOT NULL,
	isadmin BOOL NOT NULL DEFAULT 0,
	isbanned BOOL NOT NULL DEFAULT 0,
	regdate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	profile_id TINYINT NOT NULL,
	`description` VARCHAR(255) NULL,
	points INT NULL DEFAULT 0,
	CONSTRAINT PK_user PRIMARY KEY (id),
	CONSTRAINT UQ_name UNIQUE (username),
	CONSTRAINT UQ_email UNIQUE (email),
	CONSTRAINT FK_user_profile FOREIGN KEY (profile_id) REFERENCES profile(id)
);

CREATE TABLE review (
	id INT NOT NULL AUTO_INCREMENT,
	film_id INT NOT NULL,
	user_id INT NOT NULL,
	title VARCHAR(100) NOT NULL,
	content VARCHAR(600),
	rating TINYINT NOT NULL,
	`date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	modifiedby INT NULL,
	CONSTRAINT PK_review PRIMARY KEY (id),
	CONSTRAINT FK_review_user FOREIGN KEY (user_id) REFERENCES user (id)
);

CREATE TABLE comment (
	id INT NOT NULL AUTO_INCREMENT,
	user_id INT NOT NULL,
	review_id INT NOT NULL,
	content VARCHAR(255),
	`date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT PK_comment PRIMARY KEY (id),
	CONSTRAINT FK_comment_user FOREIGN KEY (user_id) REFERENCES user (id),
	CONSTRAINT FK_comment_review FOREIGN KEY (review_id) REFERENCES review (id)
);

CREATE TABLE reward (
	id INT NOT NULL AUTO_INCREMENT,
	prize VARCHAR(10) NOT NULL,
	`date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	user_id INT NOT NULL,
	CONSTRAINT PK_reward PRIMARY KEY (id),
	CONSTRAINT FK_user_reward FOREIGN KEY (user_id) REFERENCES user (id)
);

CREATE TABLE localfilm (
	id INT NOT NULL,
    poster_path VARCHAR(200) NULL,
    original_title VARCHAR(255) NULL,
    release_date VARCHAR(16) NULL,
    overview VARCHAR(2000) NULL,
    local_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    original_language VARCHAR(6) NULL,
    CONSTRAINT PK_localfilm PRIMARY KEY (id)
);

CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `movies_reviews` AS
    SELECT 
        `review`.`film_id` AS `film_id`,
        COUNT(0) AS `nReviews`,
        AVG(`review`.`rating`) AS `average`
    FROM
        `review`
    GROUP BY `review`.`film_id`