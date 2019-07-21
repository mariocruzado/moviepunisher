CREATE DATABASE moviepunisher;

USE moviepunisher;

CREATE USER 'mpclient'@'localhost' IDENTIFIED WITH mysql_native_password BY 'mpclientpass';

GRANT ALL PRIVILEGES ON moviepunisher.* TO 'mpclient'@'localhost';


CREATE TABLE profile (
	profile_id TINYINT NOT NULL AUTO_INCREMENT,
	profile_name VARCHAR(25) NOT NULL,
	profile_icon NVARCHAR(25),
	CONSTRAINT PK_profile PRIMARY KEY (profile_id)
	CONSTRAINT UQ_name UNIQUE (profile_name)
);

CREATE TABLE user (
	user_id INT NOT NULL AUTO_INCREMENT,
	user_email VARCHAR(100) NOT NULL,
	user_name VARCHAR(50) NOT NULL,
	user_password VARCHAR(25) NOT NULL,
	user_isadmin BOOL NOT NULL DEFAULT 0,
	user_isbanned BOOL NOT NULL DEFAULT 0,
	profile_id TINYINT NOT NULL,
	user_desc VARCHAR(255),
	user_points INT,
	CONSTRAINT PK_user PRIMARY KEY (user_id),
	CONSTRAINT UQ_name UNIQUE (user_name),
	CONSTRAINT UQ_email UNIQUE (user_email)
	CONSTRAINT FK_user_profile FOREIGN KEY (profile_id) REFERENCES profile(profile_id)
);

CREATE TABLE review (
	review_id INT NOT NULL AUTO_INCREMENT,
	film_id INT NOT NULL,
	user_id INT NOT NULL,
	review_content VARCHAR(255),
	review_rating TINYINT NOT NULL,
	CONSTRAINT PK_review PRIMARY KEY (review_id),
	CONSTRAINT FK_review_user FOREIGN KEY (user_id) REFERENCES user (user_id)
);

CREATE TABLE comment (
	comment_id INT NOT NULL AUTO_INCREMENT,
	user_id INT NOT NULL,
	review_id INT NOT NULL,
	film_id INT NOT NULL,
	comment_content VARCHAR(255),
	CONSTRAINT PK_comment PRIMARY KEY (comment_id),
	CONSTRAINT FK_comment_user FOREIGN KEY (user_id) REFERENCES user (user_id),
	CONSTRAINT FK_comment_review FOREIGN KEY (review_id) REFERENCES review (review_id)
);

CREATE TABLE reward (
	reward_id INT NOT NULL AUTO_INCREMENT,
	reward_rank VARCHAR(10) NOT NULL,
	user_id INT NOT NULL,
	CONSTRAINT PK_reward PRIMARY KEY (reward_id),
	CONSTRAINT FK_user_reward FOREIGN KEY (user_id) REFERENCES user (user_id)
);
	
