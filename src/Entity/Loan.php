<?php

namespace App\Entity;

use App\Repository\LoanRepository;
use Doctrine\ORM\Mapping as ORM;
use Hashids\Hashids;

/**
 * @ORM\Entity(repositoryClass=LoanRepository::class)
 * @ORM\Table (name="loans")
 */
class Loan
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var object
     * Bidirectional - Many loans borrowed by one home
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="loans")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", nullable=false, onDelete="CASCADE")
     */
    private $user;

    /**
     * @var object
     * Bidirectional - Many loans for one book
     * @ORM\ManyToOne(targetEntity=Book::class, inversedBy="loans")
     * @ORM\JoinColumn(name="book_id", referencedColumnName="id", nullable=false, onDelete="CASCADE")
     */
    private $book;

    /**
     * @ORM\Column(type="datetime")
     */
    private $takenAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $returnedAt;

    public function getId(): ?int
    {
        return $this->id;
    }
    public function getHashid(): ?string
    {
        $hashids=new Hashids('',5);
        return $hashids->encodeHex($this->id);
    }

    public function getUser()
    {
        return $this->user;
    }

    public function setUser($user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getBook()
    {
        return $this->book;
    }

    public function setBook($book): self
    {
        $this->book = $book;

        return $this;
    }

    public function getTakenAt(): ?\DateTimeInterface
    {
        return $this->takenAt;
    }

    public function setTakenAt(\DateTimeInterface $takenAt): self
    {
        $this->takenAt = $takenAt;

        return $this;
    }

    public function getReturnedAt(): ?\DateTimeInterface
    {
        return $this->returnedAt;
    }

    public function setReturnedAt(?\DateTimeInterface $returnedAt): self
    {
        $this->returnedAt = $returnedAt;

        return $this;
    }
    public function checkExpiredDate()
    {
        if(date_diff(new\DateTime(), $this->takenAt)->d >10)
            return true;
        else
            return false;

    }
}
