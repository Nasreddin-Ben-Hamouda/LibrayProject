<?php

namespace App\Entity;

use App\Repository\MediaRepository;
use Doctrine\ORM\Mapping as ORM;
use Hashids\Hashids;

/**
 * @ORM\Entity(repositoryClass=MediaRepository::class)
 * @ORM\Table (name="medias")
 */
class Media
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * bidirectional - Many medias have one book
     * @ORM\ManyToOne(targetEntity=Book::class,inversedBy="medias")
     * @ORM\JoinColumn(name="book_id",referencedColumnName="id",onDelete="CASCADE")
     */
    private $book;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $path;

    public function getId(): ?int
    {
        return $this->id;
    }
    public function getHashid(): ?string
    {
        $hashids=new Hashids('',5);
        return $hashids->encodeHex($this->id);
    }
    public function getBook():Book
    {
        return $this->book;
    }

    public function setBook(Book $book): self
    {
        $this->book = $book;

        return $this;
    }

    public function getPath(): ?string
    {
        return $this->path;
    }

    public function setPath(?string $path): self
    {
        $this->path = $path;

        return $this;
    }
}
