<?php

namespace App\Repository;

use App\Entity\Book;
use App\Entity\Loan;
use App\Entity\Media;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Book|null find($id, $lockMode = null, $lockVersion = null)
 * @method Book|null findOneBy(array $criteria, array $orderBy = null)
 * @method Book[]    findAll()
 * @method Book[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BookRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Book::class);
    }

    // /**
    //  * @return Book[] Returns an array of Book objects
    //  */
    /*
     *
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('b.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Book
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
    public function findLateBooks():?array
    {
        return $this->createQueryBuilder('book')
            ->innerJoin('book.loans','loan')
            ->andWhere('loan.returnedAt is null')
            ->andWhere('DATE_DIFF(CURRENT_TIMESTAMP(),loan.takenAt)>10')
            ->getQuery()
            ->getResult();

    }
    public function mostFiveBooks():?array
    {
        return $this->createQueryBuilder('book')
            ->select('book,count(loan.id) as loans')
            ->leftJoin('book.loans','loan')
            ->groupBy('book.id')
            ->orderBy('loans','DESC')
            ->setMaxResults(5)
            ->getQuery()
            ->getResult();
    }
    public function searchbytitle($title)
    {

        return $this->createQueryBuilder('book')
            ->where('book.title LIKE :title ')
            ->setParameter('title', $title)
            ->getQuery()
            ->getResult();

    }
}
