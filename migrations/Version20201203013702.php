<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20201203013702 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE books (id INT AUTO_INCREMENT NOT NULL, reference VARCHAR(255) NOT NULL, title VARCHAR(255) NOT NULL, author VARCHAR(255) NOT NULL, category VARCHAR(255) NOT NULL, subject VARCHAR(255) DEFAULT NULL, status INT DEFAULT 0 NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE loans (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, book_id INT NOT NULL, taken_at DATETIME NOT NULL, returned_at DATETIME DEFAULT NULL, INDEX IDX_82C24DBCA76ED395 (user_id), INDEX IDX_82C24DBC16A2B381 (book_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE medias (id INT AUTO_INCREMENT NOT NULL, book_id INT DEFAULT NULL, path VARCHAR(255) DEFAULT NULL, INDEX IDX_12D2AF8116A2B381 (book_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE users (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, is_verified TINYINT(1) NOT NULL, confirmation_token VARCHAR(255) DEFAULT NULL, photo VARCHAR(255) DEFAULT NULL, student_number BIGINT DEFAULT NULL, phone INT DEFAULT NULL, address VARCHAR(255) DEFAULT NULL, salary DOUBLE PRECISION DEFAULT \'0\' NOT NULL, roles LONGTEXT NOT NULL COMMENT \'(DC2Type:json)\', UNIQUE INDEX UNIQ_1483A5E9E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE loans ADD CONSTRAINT FK_82C24DBCA76ED395 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE loans ADD CONSTRAINT FK_82C24DBC16A2B381 FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE medias ADD CONSTRAINT FK_12D2AF8116A2B381 FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE loans DROP FOREIGN KEY FK_82C24DBC16A2B381');
        $this->addSql('ALTER TABLE medias DROP FOREIGN KEY FK_12D2AF8116A2B381');
        $this->addSql('ALTER TABLE loans DROP FOREIGN KEY FK_82C24DBCA76ED395');
        $this->addSql('DROP TABLE books');
        $this->addSql('DROP TABLE loans');
        $this->addSql('DROP TABLE medias');
        $this->addSql('DROP TABLE users');
    }
}
